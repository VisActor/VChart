const { execFileSync } = require('node:child_process');
const { readdirSync } = require('node:fs');
const { createRequire } = require('node:module');
const { resolve, posix } = require('node:path');
const { createContext, runInContext } = require('node:vm');
const { projects } = require('../../rush.json');

const published = projects.filter(project => project.shouldPublish);
const packageNames = new Set(published.map(project => project.packageName));
const registry = 'https://registry.npmjs.org';
const exactVersion = /^\d+\.\d+\.\d+(?:-[a-z]+\.\d+)?$/;
const readTar = (args, file) => execFileSync('tar', [args[0], file, ...args.slice(1)], {
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024
});

// 加载实际待上传的 UMD，校验各入口的运行时版本及主包 Factory 命名空间。
function verifyUmd(file, entry, version, name, requireDependency) {
  const source = readTar(['-xOf', entry], file);
  const exports = {};
  const context = createContext({ exports, module: { exports }, require: requireDependency });
  runInContext(source, context, { filename: entry, timeout: 5000 });
  if (context.module.exports.version !== version) {
    throw new Error(`${name} runtime version does not match ${version}: ${entry}`);
  }
  if (name === '@visactor/vchart') {
    const factoryKey = JSON.stringify(`@visactor/vchart/factory-registry@${version}`);
    if (!runInContext(`globalThis[Symbol.for(${factoryKey})]`, context)) {
      throw new Error(`VChart Factory registry does not match ${version}: ${entry}`);
    }
  }
}

// 检查 Rush 实际打出的整批 tarball，全部通过后才允许第一次写入 npm。
function validatePackages(folder, version) {
  if (!exactVersion.test(version)) throw new Error(`Invalid release version: ${version}`);
  const archiveName = name => `${name.replace(/^@/, '').replace('/', '-')}-${version}.tgz`;
  const actual = readdirSync(folder).filter(file => file.endsWith('.tgz')).sort();
  const expected = [...packageNames].map(archiveName).sort();
  if (!expected.length || JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error('Tarball set does not match the publishable Rush projects.');
  }

  return published.map(({ packageName: name, projectFolder }) => {
    const file = resolve(folder, archiveName(name));
    const metadata = JSON.parse(readTar(['-xOf', 'package/package.json'], file));
    if (metadata.name !== name || metadata.version !== version) {
      throw new Error(`Unexpected tarball manifest: ${metadata.name}@${metadata.version}`);
    }

    const entries = new Set(readTar(['-tzf'], file).trimEnd().split('\n'));
    const required = ['main', 'module', 'browser', 'types', 'typings', 'unpkg']
      .map(key => metadata[key])
      .filter(Boolean)
      .concat(metadata.unpkgFiles ?? []);
    for (const entry of required) {
      if (!entries.has(posix.join('package', entry))) throw new Error(`Missing package entry ${name}:${entry}`);
    }
    for (const dependencies of [metadata.dependencies, metadata.optionalDependencies, metadata.peerDependencies]) {
      for (const [dep, range] of Object.entries(dependencies ?? {})) {
        if (range.startsWith('workspace:') || (packageNames.has(dep) && exactVersion.test(range) && range !== version)) {
          throw new Error(`Invalid packed dependency for ${name}: ${dep}@${range}`);
        }
      }
    }
    if (name === '@visactor/vchart' || name === '@visactor/react-vchart') {
      const requireDependency = name === '@visactor/react-vchart'
        ? createRequire(resolve(__dirname, '../..', projectFolder, 'package.json'))
        : undefined;
      for (const entry of ['build/index.js', 'build/index.min.js']) {
        verifyUmd(file, `package/${entry}`, version, name, requireDependency);
      }
    }
    return { name, file };
  });
}

// 上传已验证的包文件，保留现有部分发布恢复时只补发缺失版本的行为。
function publishPackages(packages, tag, missing, run = execFileSync) {
  if (!/^(latest|alpha|beta|rc|hotfix)$/.test(tag) ||
      !missing.size || [...missing].some(name => !packageNames.has(name))) {
    throw new Error('Invalid npm dist-tag or missing package set.');
  }
  for (const { name, file } of packages) {
    if (missing.has(name)) {
      run('npm', ['publish', file, '--ignore-scripts', '--access', 'public', '--registry', registry, '--tag', tag], {
        stdio: 'inherit'
      });
    }
  }
}

// 浏览器验收读取同一批原包，所有检查通过后才写入 npm。
async function verifyBrowserPackages(packages, version) {
  const archives = new Map(packages.map(({ name, file }) => [name, file]));
  const { verifyReleaseBrowser } = require('./verify-release-browser');
  await verifyReleaseBrowser((name, entry) => readTar(['-xOf', `package/${entry}`], archives.get(name)), version);
}

// CLI 默认仅校验文件，发布模式额外执行浏览器验收。
async function main() {
  const [, , folder, version, tag] = process.argv;
  const packages = validatePackages(folder, version);
  console.log(`Validated ${packages.length} release tarballs for ${version}.`);
  if (tag !== undefined) {
    await verifyBrowserPackages(packages, version);
    publishPackages(packages, tag, new Set((process.env.MISSING_PACKAGES ?? '').split(',').filter(Boolean)));
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { validatePackages, publishPackages, verifyBrowserPackages };
