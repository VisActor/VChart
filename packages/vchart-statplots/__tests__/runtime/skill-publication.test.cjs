const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const moduleURL = new URL('../../scripts/sync-visualization-skill.mjs', pathToFileURL(__filename));

async function readMaybe(file) {
  try { return await fs.readFile(file); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
}
async function tree(root) {
  let names;
  try { names = await fs.readdir(root); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return null;
  }
  const result = {};
  for (const name of names) result[name] = await fs.readFile(path.join(root, name));
  return result;
}
async function fixture(layout = 'modern') {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'dsv-publication-'));
  const root = path.join(temp, 'resources');
  const manifestPath = path.join(temp, 'manifest.json');
  const stagingRoot = root + '.staging-test';
  const stagingManifestPath = manifestPath + '.staging-test';
  const controllerPath = path.join(temp, 'controller.js');
  if (layout !== 'fresh') {
    await fs.mkdir(root);
    await fs.writeFile(path.join(root, 'old.txt'), 'old resources');
    await fs.writeFile(controllerPath, 'old controller');
    if (layout === 'legacy') {
      await fs.writeFile(path.join(root, 'manifest.json'), 'old embedded manifest');
      await fs.writeFile(path.join(root, 'package.json'), 'old package');
    } else await fs.writeFile(manifestPath, 'old manifest');
  }
  const result = { temp, root, manifestPath, stagingRoot, stagingManifestPath, controllerPath, controllerBytes: Buffer.from('new controller') };
  await stage(result);
  return result;
}
async function stage(f) {
  await fs.mkdir(f.stagingRoot);
  await fs.writeFile(path.join(f.stagingRoot, 'new.txt'), 'new resources');
  await fs.writeFile(f.stagingManifestPath, 'new manifest');
}
async function validate(f) {
  assert.deepEqual(await fs.readdir(f.root), ['new.txt']);
  assert.equal((await fs.readFile(f.manifestPath)).toString(), 'new manifest');
  assert.equal((await fs.readFile(f.controllerPath)).toString(), 'new controller');
}

for (const entry of [
  { phase: 'backup-manifest', layout: 'modern' },
  { phase: 'install-root', layout: 'modern' },
  { phase: 'install-manifest', layout: 'modern' },
  { phase: 'controller', layout: 'modern' },
  { phase: 'validate', layout: 'modern' },
  { phase: 'validate', layout: 'legacy' },
  { phase: 'validate', layout: 'fresh' }
]) {
  test(`publication restores ${entry.layout} state after ${entry.phase} failure, then can retry`, async t => {
    const { publishSnapshot } = await import(moduleURL);
    const f = await fixture(entry.layout);
    const before = { root: await tree(f.root), manifest: await readMaybe(f.manifestPath), controller: await readMaybe(f.controllerPath) };
    let failed = false;
    const rename = fs.rename;
    const writeFile = fs.writeFile;
    const fault = () => { failed = true; throw new Error('injected publication failure'); };
    t.mock.method(fs, 'rename', async (source, target) => {
      if (!failed && (
        (entry.phase === 'backup-manifest' && source === f.manifestPath) ||
        (entry.phase === 'install-root' && source === f.stagingRoot) ||
        (entry.phase === 'install-manifest' && source === f.stagingManifestPath)
      )) fault();
      return rename(source, target);
    });
    t.mock.method(fs, 'writeFile', async (file, bytes, ...args) => {
      if (!failed && entry.phase === 'controller' && file === f.controllerPath) {
        await writeFile(file, 'partial write');
        fault();
      }
      return writeFile(file, bytes, ...args);
    });
    try {
      await assert.rejects(publishSnapshot({ ...f, validate: async () => {
        await validate(f);
        if (entry.phase === 'validate') fault();
      } }), /injected publication failure/);
      assert.equal(failed, true);
      assert.deepEqual(await tree(f.root), before.root);
      assert.deepEqual(await readMaybe(f.manifestPath), before.manifest);
      assert.deepEqual(await readMaybe(f.controllerPath), before.controller);
      assert.deepEqual((await fs.readdir(f.temp)).filter(name => /\.(staging|backup)-/.test(name)), []);
      await stage(f);
      await publishSnapshot({ ...f, validate: () => validate(f) });
      await validate(f);
      assert.deepEqual((await fs.readdir(f.temp)).filter(name => /\.(staging|backup)-/.test(name)), []);
    } finally {
      t.mock.restoreAll();
      await fs.rm(f.temp, { recursive: true, force: true });
    }
  });
}

test('rollback failure preserves the remaining backup and restores other targets', async t => {
  const { publishSnapshot } = await import(moduleURL);
  const f = await fixture();
  const rename = fs.rename;
  const backup = `${f.root}.backup-${process.pid}`;
  t.mock.method(fs, 'rename', async (source, target) => {
    if (source === backup) throw new Error('injected root restore failure');
    return rename(source, target);
  });
  try {
    await assert.rejects(publishSnapshot({ ...f, validate: async () => { throw new Error('injected validation failure'); } }), AggregateError);
    assert.equal((await fs.readFile(path.join(backup, 'old.txt'))).toString(), 'old resources');
    assert.equal((await fs.readFile(f.manifestPath)).toString(), 'old manifest');
    assert.equal((await fs.readFile(f.controllerPath)).toString(), 'old controller');
  } finally {
    t.mock.restoreAll();
    await fs.rm(f.temp, { recursive: true, force: true });
  }
});
