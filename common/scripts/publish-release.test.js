const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');
const { projects } = require('../../rush.json');
const { validatePackages, publishPackages } = require('./publish-release');

const version = '2.2.3-rc.1';
const candidates = projects.filter(project => project.shouldPublish).map(project => project.packageName);

// 创建真实的本地 tarball，以便验证包入口、peer 和 UMD 版本的失败路径。
function archive(folder, name, { omitEntry = false, oldPeer, factoryVersion = version, umdVersion = version, staleEntry } = {}) {
  const source = mkdtempSync(join(folder, 'package-'));
  const contents = join(source, 'package');
  mkdirSync(contents);
  try {
    const manifest = { name, version, main: 'index.js' };
    if (name === '@visactor/vchart' || name === '@visactor/react-vchart') {
      manifest.unpkgFiles = ['build/index.js', 'build/index.min.js'];
    }
    if (oldPeer) manifest.peerDependencies = { '@visactor/vchart': oldPeer };
    writeFileSync(join(contents, 'package.json'), JSON.stringify(manifest));
    if (!omitEntry) {
      const factoryKey = JSON.stringify(`@visactor/vchart/factory-registry@${factoryVersion}`);
      writeFileSync(join(contents, 'index.js'), `exports.version = ${JSON.stringify(version)};`);
      if (manifest.unpkgFiles) {
        mkdirSync(join(contents, 'build'));
        for (const entry of manifest.unpkgFiles) {
          const buildVersion = entry === staleEntry ? umdVersion : version;
          writeFileSync(join(contents, entry), `exports.version = ${JSON.stringify(buildVersion)}; globalThis[Symbol.for(${factoryKey})] = {};`);
        }
      }
    }
    const file = join(folder, `${name.slice(1).replace('/', '-')}-${version}.tgz`);
    execFileSync('tar', ['-czf', file, '-C', source, 'package']);
  } finally {
    rmSync(source, { recursive: true, force: true });
  }
}

test('validates all Rush tarballs before publishing only the missing versions', t => {
  const folder = mkdtempSync(join(tmpdir(), 'vchart-release-'));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  for (const name of candidates) archive(folder, name);

  const extension = '@visactor/vchart-extension';
  const statplots = '@visactor/vchart-statplots';
  const packages = validatePackages(folder, version);
  assert.equal(packages.length, candidates.length);
  assert.throws(() => publishPackages(packages, '', new Set([extension]), () => assert.fail('unexpected publish')), /Invalid npm dist-tag/);
  const calls = [];
  publishPackages(packages, 'rc', new Set([extension]), (command, args) => calls.push([command, ...args]));
  assert.deepEqual(calls, [[
    'npm', 'publish', join(folder, `visactor-vchart-extension-${version}.tgz`),
    '--ignore-scripts', '--access', 'public', '--registry', 'https://registry.npmjs.org', '--tag', 'rc'
  ]]);

  archive(folder, extension, { omitEntry: true });
  assert.throws(() => validatePackages(folder, version), /Missing package entry @visactor\/vchart-extension/);
  archive(folder, extension);
  archive(folder, statplots, { oldPeer: '2.2.2' });
  assert.throws(() => validatePackages(folder, version), /Invalid packed dependency.*@visactor\/vchart@2\.2\.2/);
  archive(folder, statplots);
  const react = '@visactor/react-vchart';
  for (const staleEntry of ['build/index.js', 'build/index.min.js']) {
    archive(folder, react, { umdVersion: '2.2.2', staleEntry });
    assert.throws(
      () => validatePackages(folder, version),
      /@visactor\/react-vchart runtime version does not match/
    );
  }
  archive(folder, react);
  archive(folder, '@visactor/vchart', { factoryVersion: '2.2.2' });
  assert.throws(() => validatePackages(folder, version), /Factory registry does not match/);
});
