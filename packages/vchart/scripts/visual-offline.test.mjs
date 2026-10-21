import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { parseOptions } from './visual-test.mjs';
import { resolveBaseline, offlineDependencies, baselineBuild } from './visual/build.mjs';

/** 离线模式既不联网，也不能让基线链接借用候选源码或旧配置缓存。 */
test('离线基线固定提交、依赖来源和缓存配置', async () => {
  assert.throws(() => parseOptions(['--offline']), /需要/);
  assert.equal(parseOptions(['--offline', '--baseline', 'a'.repeat(40)]).offline, true);
  const root = await fs.mkdtemp(path.join(tmpdir(), 'vchart-offline-'));
  const worktree = await fs.mkdtemp(path.join(tmpdir(), 'vchart-offline-base-'));
  const git = args =>
    execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'test',
        GIT_AUTHOR_EMAIL: 'test@example.invalid',
        GIT_COMMITTER_NAME: 'test',
        GIT_COMMITTER_EMAIL: 'test@example.invalid'
      }
    }).trim();
  try {
    await fs.mkdir(path.join(root, 'common/config/rush'), { recursive: true });
    await fs.mkdir(path.join(root, 'common/temp'), { recursive: true });
    for (const [file, content] of [
      ['common/config/rush/pnpm-lock.yaml', 'lockfileVersion: 5.4\n'],
      ['common/config/rush/pnpm-config.json', '{"useWorkspaces":true}\n'],
      ['rush.json', '{}\n'],
      ['package.json', '{}\n'],
      ['.gitignore', 'node_modules/\n.vchart-visual/\n']
    ])
      await fs.writeFile(path.join(root, file), content);
    for (const name of ['vchart', 'vutils-extension']) {
      await fs.mkdir(path.join(root, 'packages', name), { recursive: true });
      await fs.writeFile(path.join(root, 'packages', name, 'package.json'), '{}\n');
    }
    await fs.writeFile(path.join(root, 'packages/vutils-extension/version.txt'), 'baseline');
    await fs.mkdir(path.join(root, 'packages/vchart/node_modules/@visactor'), { recursive: true });
    await fs.symlink(
      '../../../vutils-extension',
      path.join(root, 'packages/vchart/node_modules/@visactor/vutils-extension'),
      'dir'
    );
    git(['init', '--quiet']);
    git(['add', '.']);
    git(['-c', 'core.hooksPath=/dev/null', 'commit', '--quiet', '-m', 'fixture']);
    const sha = git(['rev-parse', 'HEAD']);
    await fs.writeFile(path.join(root, 'packages/vutils-extension/version.txt'), 'current');
    await fs.mkdir(path.join(worktree, 'packages/vutils-extension'), { recursive: true });
    await fs.writeFile(path.join(worktree, 'packages/vutils-extension/version.txt'), 'baseline');
    const runtime = { offline: true, run: () => assert.fail('离线模式不能联网 fetch') };
    assert.equal(await resolveBaseline(root, sha, runtime, ''), sha);
    await assert.rejects(() => resolveBaseline(root, undefined, runtime, ''), /基线/);
    await offlineDependencies(root, worktree, sha);
    assert.equal(
      await fs.realpath(path.join(worktree, 'common/temp')),
      await fs.realpath(path.join(root, 'common/temp'))
    );
    assert.equal(
      await fs.readFile(
        path.join(worktree, 'packages/vchart/node_modules/@visactor/vutils-extension/version.txt'),
        'utf8'
      ),
      'baseline'
    );
    const runDir = path.join(root, '.vchart-visual/test-run');
    await fs.mkdir(runDir, { recursive: true });
    const report = { baseline: {} },
      cacheRuntime = {
        offline: true,
        defer() {},
        async run(command, args) {
          assert.equal(command, 'git');
          assert.equal(args[0], 'worktree');
          await fs.mkdir(args[3], { recursive: true });
        }
      };
    const buildOptions = { buildBundle: async (_root, destination) => fs.writeFile(destination, 'cache fixture') };
    await baselineBuild(root, runDir, sha, cacheRuntime, report, (_name, action) => action(), buildOptions);
    await baselineBuild(root, runDir, sha, cacheRuntime, report, (_name, action) => action(), buildOptions);
    assert.equal(report.baseline.cacheHit, true);
    // 锁文件不变也不能共享不同的项目声明，已有基线缓存不能绕过检查。
    await fs.writeFile(path.join(root, 'packages/vchart/package.json'), '{"dependencies":{"beta":"1.0.0"}}\n');
    await assert.rejects(
      () => offlineDependencies(root, path.join(worktree, 'manifest-mismatch'), sha),
      /依赖配置不同/
    );
    await assert.rejects(
      () => baselineBuild(root, runDir, sha, cacheRuntime, report, (_name, action) => action(), buildOptions),
      /依赖配置不同/
    );
    await fs.writeFile(path.join(root, 'packages/vchart/package.json'), '{}\n');
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-config.json'), '{"useWorkspaces":false}\n');
    await assert.rejects(
      () => baselineBuild(root, runDir, sha, cacheRuntime, report, (_name, action) => action(), buildOptions),
      /依赖配置不同/
    );
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-config.json'), '{"useWorkspaces":true}\n');
    await fs.writeFile(path.join(root, 'common/config/rush/pnpm-lock.yaml'), 'changed\n');
    await assert.rejects(() => offlineDependencies(root, worktree, sha), /依赖配置不同/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
    await fs.rm(worktree, { recursive: true, force: true });
  }
});
