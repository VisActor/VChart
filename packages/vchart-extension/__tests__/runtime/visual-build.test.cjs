const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

test('extension export reuses the explicit current core bundle and builds its own resource', async t => {
  const { build } = await import('../../scripts/visual/build.mjs');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'vchart-extension-core-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, 'packages/vchart'), { recursive: true });
  await fs.writeFile(path.join(root, 'packages/vchart/tsconfig.json'), JSON.stringify({ compilerOptions: {} }));
  const core = path.join(root, 'current-core.js'), output = path.join(root, 'candidate.js');
  await fs.writeFile(core, 'globalThis.currentCore = true;');
  const calls = [];
  const runtime = {
    async run(command, args, cwd) {
      // 真实核心构建会调用其他包；本轮只允许构建扩展，组合内容必须来自给定核心。
      calls.push({ command, args, cwd });
      assert.equal(cwd, path.join(root, 'packages/vchart-extension'));
      const directory = path.join(root, 'candidate-extension/build');
      await fs.mkdir(directory, { recursive: true });
      await fs.writeFile(path.join(directory, 'index.js'), 'globalThis.currentExtension = true;');
    }
  };
  await build(root, output, runtime, 'build.log', core);
  assert.equal(await fs.readFile(core, 'utf8'), 'globalThis.currentCore = true;');
  assert.equal(
    await fs.readFile(output, 'utf8'),
    'globalThis.currentCore = true;\n;\nglobalThis.currentExtension = true;'
  );
  assert.equal(calls.length, 1);
  await assert.rejects(build(root, path.join(root, 'missing.js'), runtime, 'build.log', path.join(root, 'absent.js')), {
    code: 'ENOENT'
  });
  assert.equal(calls.length, 1);
});
