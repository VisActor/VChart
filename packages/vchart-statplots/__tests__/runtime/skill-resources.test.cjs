const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { createHash } = require('node:crypto');
const moduleURL = new URL('../../scripts/sync-visualization-skill.mjs', require('node:url').pathToFileURL(__filename));

test('tarball integrity is checked before extraction', async () => {
  const { verifyTarball } = await import(moduleURL);
  const bytes = Buffer.from('fixed release');
  const integrity = 'sha512-' + createHash('sha512').update(bytes).digest('base64');
  verifyTarball(bytes, integrity);
  assert.throws(() => verifyTarball(Buffer.from('changed'), integrity), /integrity/);
});

test('offline check detects altered resources and missing files', async () => {
  const { checkResources } = await import(moduleURL);
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'dsv-resources-'));
  try {
    const bytes = Buffer.from('{}');
    const name = 'schema/plots/histogram.schema.json';
    await fs.mkdir(path.join(root, 'schema/plots'), { recursive: true });
    await fs.writeFile(path.join(root, name), bytes);
    await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify({
      version: '2.1.8-alpha.0', files: { [name]: { sha256: createHash('sha256').update(bytes).digest('hex') } }, workspaceAssets: {}
    }));
    await checkResources(root);
    await fs.writeFile(path.join(root, name), '{"changed":true}');
    await assert.rejects(checkResources(root), /sha256.*histogram/);
    await fs.unlink(path.join(root, name));
    await assert.rejects(checkResources(root), /histogram/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
