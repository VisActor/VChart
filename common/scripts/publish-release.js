const { execFileSync } = require('node:child_process');
const { readdirSync } = require('node:fs');
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

// 加载实际待上传的 UMD，检查编译注入版本和 Factory 注册表命名空间。
function verifyVChart(file, entry, version) {
  const source = readTar(['-xOf', entry], file);
  const context = createContext({ exports: {} });
  context.module = { exports: context.exports };
  runInContext(source, context, { filename: entry, timeout: 5000 });
  const factoryKey = JSON.stringify(`@visactor/vchart/factory-registry@${version}`);
  if (context.module.exports.version !== version || !runInContext(`globalThis[Symbol.for(${factoryKey})]`, context)) {
    throw new Error(`VChart runtime version or Factory registry does not match ${version}: ${entry}`);
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

  return published.map(({ packageName: name }) => {
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
    if (name === '@visactor/vchart') {
      for (const entry of metadata.unpkgFiles) verifyVChart(file, `package/${entry}`, version);
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

if (require.main === module) {
  const [, , folder, version, tag] = process.argv;
  const packages = validatePackages(folder, version);
  console.log(`Validated ${packages.length} release tarballs for ${version}.`);
  if (tag !== undefined) publishPackages(packages, tag, new Set((process.env.MISSING_PACKAGES ?? '').split(',').filter(Boolean)));
}

module.exports = { validatePackages, publishPackages };
