import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { saveReport } from '../__tests__/visual/report.mjs';

// 业务断言失败可作为待调查证据；当前失败、基础设施失败及普通缺图绝不变成通过。
test('修复报告保留旧版失败并严格区分执行错误', async () => {
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'visual-regression-'));
  try {
    await fs.writeFile(path.join(dir, 'current.png'), 'fixture');
    const baseline = {
      id: 'one',
      status: 'error',
      code: 'INTERACTION_ASSERTION_FAILED',
      category: 'interaction',
      errors: ['漏洞复现'],
      attachments: []
    };
    const current = {
      id: 'one',
      status: 'passed',
      errors: [],
      attachments: [{ name: 'rendered', path: 'current.png' }]
    };
    const summary = {
      status: 'passed',
      request: { baseline: 'a'.repeat(40), offline: true },
      environment: {},
      cases: [{ id: 'one' }],
      baselineResult: { finalized: true, errors: [], tests: [baseline] },
      currentResult: { finalized: true, errors: [], tests: [current] }
    };
    await saveReport(dir, summary);
    let result = JSON.parse(await fs.readFile(path.join(dir, 'summary.json')));
    assert.equal(result.cases[0].status, 'new_baseline');
    assert.match(result.cases[0].rerun, /--offline/);
    assert.equal(result.status, 'diff');
    assert.match(await fs.readFile(path.join(dir, 'index.html'), 'utf8'), /待确认项不代表比较通过/);
    assert.match(await fs.readFile(path.join(dir, 'agent-summary.md'), 'utf8'), /完整执行：true/);
    assert.equal(result.cases[0].errors[0].message, '漏洞复现');
    for (const code of ['TIMEOUT', 'RESOURCE_FAILED', 'MISSING_ARTIFACT']) {
      await saveReport(dir, {
        ...summary,
        baselineResult: { ...summary.baselineResult, tests: [{ ...baseline, code }] }
      });
      result = JSON.parse(await fs.readFile(path.join(dir, 'summary.json')));
      assert.equal(result.status, 'error');
    }
    await saveReport(dir, {
      ...summary,
      currentResult: { ...summary.currentResult, tests: [{ ...current, status: 'error', errors: ['当前失败'] }] }
    });
    result = JSON.parse(await fs.readFile(path.join(dir, 'summary.json')));
    assert.equal(result.status, 'error');
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

// 使用假的 CLI 启动结果验证真实阶段适配器，不依赖浏览器或网络。
test('仅完整旧版业务断言失败允许继续，当前失败和基础设施错误仍抛出', async () => {
  const { executePhase } = await import('./visual/runner.mjs');
  const root = await fs.mkdtemp(path.join(tmpdir(), 'visual-phase-'));
  try {
    const cli = path.join(root, 'packages/vchart/node_modules/@playwright/test');
    await fs.mkdir(cli, { recursive: true });
    await fs.writeFile(path.join(cli, 'package.json'), JSON.stringify({ exports: { './cli': './cli.js' } }));
    await fs.writeFile(path.join(cli, 'cli.js'), '');
    let result = {
      finalized: true,
      status: 'error',
      errors: [],
      tests: [{ id: 'one', status: 'error', code: 'INTERACTION_ASSERTION_FAILED' }]
    };
    const runtime = {
      async run(_command, _args, _cwd, _log, options) {
        await fs.writeFile(path.join(root, `${options.env.VISUAL_PHASE}-result.json`), JSON.stringify(result));
        return 1;
      }
    };
    assert.equal((await executePhase(root, root, 'baseline', '', ['one'], runtime)).status, 'error');
    await assert.rejects(() => executePhase(root, root, 'current', '', ['one'], runtime));
    for (const code of ['TIMEOUT', 'RESOURCE_FAILED', 'MISSING_ARTIFACT']) {
      result.tests[0].code = code;
      await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime));
    }
    result.tests[0].code = 'CASE_ASSERTION_FAILED';
    result.finalized = false;
    await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime));
    result.finalized = true;
    result.errors = ['worker crashed'];
    await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime));
    result.errors = [];
    result.tests[0].status = 'passed';
    await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime));
    result.tests[0].status = 'error';
    result.tests[0].id = 'other';
    await assert.rejects(() => executePhase(root, root, 'baseline', '', ['one'], runtime), /集合/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

// 独立基线依赖必须逐文件匹配基线提交，不能用当前版的锁文件代替。
test('不同锁文件分别准备，错配和目录越界拒绝', async () => {
  const { execFileSync } = await import('node:child_process');
  const { offlineDependencies } = await import('./visual/build.mjs');
  const root = await fs.mkdtemp(path.join(tmpdir(), 'visual-deps-'));
  const previous = process.env.VISUAL_BASELINE_DEPENDENCIES;
  const source = path.join(root, 'source'),
    base = path.join(root, 'base'),
    deps = path.join(root, 'deps');
  const git = args =>
    execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
      cwd: source,
      encoding: 'utf8',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'fixture',
        GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
        GIT_COMMITTER_NAME: 'fixture',
        GIT_COMMITTER_EMAIL: 'fixture@example.invalid'
      }
    }).trim();
  try {
    await fs.mkdir(path.join(source, 'common/config/rush'), { recursive: true });
    await fs.writeFile(path.join(source, 'rush.json'), '{}\n');
    await fs.writeFile(path.join(source, 'common/config/rush/pnpm-lock.yaml'), 'base\n');
    git(['init', '-q']);
    git(['add', '.']);
    git(['commit', '-qm', 'base']);
    const sha = git(['rev-parse', 'HEAD']);
    await fs.cp(source, deps, { recursive: true, filter: file => !file.includes('/.git') });
    await fs.mkdir(path.join(deps, 'common/temp'));
    await fs.writeFile(path.join(source, 'common/config/rush/pnpm-lock.yaml'), 'head\n');
    git(['add', '.']);
    git(['commit', '-qm', 'head']);
    git(['worktree', 'add', '--detach', base, sha]);
    process.env.VISUAL_BASELINE_DEPENDENCIES = deps;
    await offlineDependencies(source, base, sha);
    assert.equal(await fs.realpath(path.join(base, 'common/temp')), await fs.realpath(path.join(deps, 'common/temp')));
    await fs.writeFile(path.join(deps, 'rush.json'), '{"changed":true}');
    await assert.rejects(() => offlineDependencies(source, base, sha), /配置不同/);
    await fs.unlink(path.join(deps, 'rush.json'));
    await fs.symlink(path.join(source, 'rush.json'), path.join(deps, 'rush.json'));
    await assert.rejects(() => offlineDependencies(source, base, sha), /配置不同/);
  } finally {
    if (previous === undefined) delete process.env.VISUAL_BASELINE_DEPENDENCIES;
    else process.env.VISUAL_BASELINE_DEPENDENCIES = previous;
    await fs.rm(root, { recursive: true, force: true });
  }
});

// 离线入口固定提交；缓存命中也不能跳过两侧依赖校验或启动联网安装。
test('离线参数、基线解析与缓存前依赖校验', async () => {
  const { parseOptions } = await import('./visual-test.mjs');
  const { createRuntime } = await import('./visual/runtime.mjs');
  const { resolveBaseline, baselineBuild } = await import('./visual/build.mjs');
  const { execFileSync } = await import('node:child_process');
  assert.throws(() => parseOptions(['--offline']), /需要/);
  assert.throws(() => parseOptions(['--list', '--offline']), /独立/);
  assert.equal(parseOptions(['--baseline', 'a'.repeat(40), '--offline']).offline, true);
  assert.equal(createRuntime({ offline: true }).offline, true);
  const dir = await fs.mkdtemp(path.join(tmpdir(), 'chart-offline-'));
  const previous = process.env.VISUAL_BASELINE_DEPENDENCIES;
  const git = args =>
    execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
      cwd: dir,
      encoding: 'utf8',
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: 'fixture',
        GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
        GIT_COMMITTER_NAME: 'fixture',
        GIT_COMMITTER_EMAIL: 'fixture@example.invalid'
      }
    }).trim();
  try {
    delete process.env.VISUAL_BASELINE_DEPENDENCIES;
    await fs.mkdir(path.join(dir, 'common/config/rush'), { recursive: true });
    await fs.writeFile(path.join(dir, 'rush.json'), '{}');
    await fs.writeFile(path.join(dir, 'common/config/rush/pnpm-lock.yaml'), 'base');
    git(['init', '-q']);
    git(['add', '.']);
    git(['commit', '-qm', 'base']);
    const sha = git(['rev-parse', 'HEAD']);
    const runtime = {
      offline: true,
      run() {
        assert.fail('离线模式不应 fetch 或 install');
      }
    };
    assert.equal(await resolveBaseline(dir, sha, runtime), sha);
    await assert.rejects(() => resolveBaseline(dir, 'a'.repeat(40), runtime), { code: 'BASELINE_FETCH_FAILED' });
    await fs.writeFile(path.join(dir, 'common/config/rush/pnpm-lock.yaml'), 'head');
    await assert.rejects(
      () => baselineBuild(dir, dir, sha, runtime, { baseline: {} }, (_name, operation) => operation()),
      /配置不同/
    );
  } finally {
    if (previous === undefined) delete process.env.VISUAL_BASELINE_DEPENDENCIES;
    else process.env.VISUAL_BASELINE_DEPENDENCIES = previous;
    await fs.rm(dir, { recursive: true, force: true });
  }
});
