import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { snapshotSource } from './visual/runner.mjs';
import { workingTree } from './visual/build.mjs';

test('结束快照记录真实源码，截图后编辑或快照读取失败均阻止通过', async () => {
  const root = await fs.mkdtemp(path.join(tmpdir(), 'vchart-source-snapshot-'));
  const git = args =>
    execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
      cwd: root,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'test',
        GIT_AUTHOR_EMAIL: 'test@example.invalid',
        GIT_COMMITTER_NAME: 'test',
        GIT_COMMITTER_EMAIL: 'test@example.invalid'
      }
    });
  try {
    git(['init', '--quiet']);
    await fs.writeFile(path.join(root, 'source.js'), 'before');
    git(['add', '.']);
    git(['commit', '--quiet', '-m', 'fixture']);
    const local = await workingTree(root),
      stable = { local, issues: [] };
    await snapshotSource(root, stable);
    assert.deepEqual(stable.localAfter, local);
    assert.deepEqual(stable.issues, []);
    await fs.writeFile(path.join(root, 'source.js'), 'edited-after-screenshot');
    const changed = { local, issues: [] };
    await snapshotSource(root, changed);
    assert.equal(changed.localAfter.head, local.head);
    assert.notEqual(changed.localAfter.digest, local.digest);
    assert.equal(changed.issues[0].code, 'WORKSPACE_CHANGED');
    const missing = { local, issues: [] };
    await snapshotSource(path.join(root, 'missing'), missing);
    assert.equal(missing.issues[0].code, 'SOURCE_SNAPSHOT_FAILED');
    const unprepared = { issues: [] };
    await snapshotSource(root, unprepared);
    assert.equal(unprepared.localAfter, undefined);
    assert.deepEqual(unprepared.issues, []);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
