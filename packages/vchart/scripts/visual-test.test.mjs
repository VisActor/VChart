import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseOptions } from './visual-test.mjs';
import {
  executePhase as runPhase,
  loadCases,
  selectCases,
  validateResults,
  acquireLock,
  runVisual
} from './visual/runner.mjs';
import { cases as caseMetadata } from '../__tests__/visual/cases/index.mjs';
import { createRuntime, serve, fileManifest, cleanupAll } from './visual/runtime.mjs';
import { readCache, publishCache, build, workingTree } from './visual/build.mjs';
const runtime = createRuntime();
/** 测试从冻结清单选择用例，使用与 CLI 相同的阶段入口。 */
async function executePhase(dir, phase, url, id) {
  const selected = await loadCases(path.join(dir, 'suite'), id);
  return runPhase(
    root,
    dir,
    phase,
    url,
    selected.map(item => item.id),
    runtime
  );
}
/** 通过正式进程管理器验证命令失败。 */
const run = (...args) => runtime.run(...args);
import { saveReport } from '../__tests__/visual/report.mjs';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const packageDir = path.join(root, 'packages/vchart');

test('CLI rejects unknown cases and conflicting baseline options', () => {
  // 参数错误必须在构建之前返回约定的执行错误退出码。
  for (const args of [
    ['--case', 'missing'],
    ['--case', ''],
    ['--dir', 'missing'],
    ['--dir', 'components/empty'],
    ['--dir', ''],
    ['--dir', '/components'],
    ['--dir', '../components'],
    ['--dir', 'components/../charts'],
    ['--dir', 'components/*'],
    ['--dir', 'components\\label'],
    ['--dir', 'components', '--case', 'pie-label'],
    ['--dir', 'components', '--dir=charts'],
    ['--list', '--dir', 'components'],
    ['--check', '--dir', 'components'],
    ['--baseline', ''],
    ['--baseline', 'a'.repeat(40), '--self-compare'],
    ['--update-snapshots'],
    ['--list', '--case', 'bar-stack'],
    ['--check', '--self-compare'],
    ['--check', '--list']
  ]) {
    const result = spawnSync(process.execPath, [path.join(packageDir, 'scripts/visual-test.mjs'), ...args]);
    assert.equal(result.status, 2, result.stderr.toString());
    assert.ok(!result.stdout.toString().includes('构建当前工作区'), '选择错误不得进入构建');
  }
});

test(
  'real screenshots distinguish differences, missing inputs and execution failures',
  { timeout: 180000 },
  async t => {
    // 使用已构建的真实 VChart，在独立目录中注入故障，不修改源码或正式报告。
    const bundle = await fs.readFile(path.join(packageDir, 'build/index.js'));
    const output = path.join(root, '.vchart-visual');
    await fs.mkdir(output, { recursive: true });
    const dir = await fs.mkdtemp(path.join(output, 'verify-'));
    await fs.cp(path.join(packageDir, '__tests__/visual'), path.join(dir, 'suite'), { recursive: true });
    await fs.symlink(path.join(packageDir, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
    await fs.writeFile(path.join(dir, 'baseline.js'), bundle);
    await fs.writeFile(path.join(dir, 'current.js'), bundle);
    const { server, url } = await serve(dir);
    const barFile = caseMetadata.find(item => item.id === 'bar-stack').file.slice(2);
    // 真实阶段产物用于验证三图与结构化报告保持一致。
    const summary = () => ({
      status: 'passed',
      environment: {},
      baseline: { repository: 'official', sha: 'a'.repeat(40) },
      local: { head: 'b'.repeat(40), dirty: true },
      selection: {
        mode: 'directory',
        value: 'charts/bar',
        selectedIds: ['bar-stack'],
        selectedCount: 1,
        totalCount: caseMetadata.length
      },
      cases: [
        {
          id: 'bar-stack',
          purpose: '颜色对比',
          source: {
            path: `packages/vchart/__tests__/visual/cases/${barFile}`,
            line: 1,
            frozenPath: `suite/cases/${barFile}`
          }
        }
      ]
    });
    try {
      await t.test('identical bundle passes', async () => {
        // 同一构建分别生成基线和本地图像。
        assert.equal((await executePhase(dir, 'baseline', url, 'bar-stack')).status, 'passed');
        assert.equal((await executePhase(dir, 'current', url, 'bar-stack')).status, 'passed');
      });
      await t.test('scope reports preserve exact selection and reject inconsistent metadata', async () => {
        // 同一真实图片用于检查范围协议，不把未选用例计为未完成或已通过。
        for (const selection of [
          summary().selection,
          { mode: 'case', value: 'bar-stack', selectedIds: ['bar-stack'], selectedCount: 1, totalCount: 10 },
          { mode: 'all', value: null, selectedIds: ['bar-stack'], selectedCount: 1, totalCount: 1 }
        ]) {
          const report = await saveReport(dir, { ...summary(), selection, baseline: { repository: 'working-tree' } });
          assert.equal(report.status, 'passed');
          assert.equal(report.complete, true);
          assert.deepEqual(report.selection, selection);
          assert.equal(report.counts.passed, 1);
          assert.equal(report.counts.not_run, 0);
          assert.match(report.rerun, /--self-compare/);
          assert.ok(!report.rerun.includes('--baseline'));
          const flag =
            selection.mode === 'directory'
              ? "--dir 'charts/bar'"
              : selection.mode === 'case'
              ? "--case 'bar-stack'"
              : '';
          assert.equal(
            report.rerun,
            `node packages/vchart/scripts/visual-test.mjs --self-compare${flag ? ` ${flag}` : ''}`
          );
          const expected = `选中 1 / ${selection.totalCount}；其余 ${selection.totalCount - 1} 个未执行`;
          assert.ok((await fs.readFile(path.join(dir, 'index.html'), 'utf8')).includes(expected));
          assert.ok((await fs.readFile(path.join(dir, 'agent-summary.md'), 'utf8')).includes(expected));
          await fs.access(path.join(dir, report.cases[0].source.frozenPath));
        }
        for (const override of [
          { selectedIds: ['unknown'] },
          { selectedCount: 2 },
          { totalCount: 0 },
          { mode: 'all', value: null }
        ]) {
          const report = await saveReport(dir, { ...summary(), selection: { ...summary().selection, ...override } });
          assert.equal(report.status, 'error');
          assert.equal(report.complete, false);
          assert.ok(report.issues.some(issue => issue.code === 'RESULT_SET_MISMATCH'));
        }
      });
      await t.test('candidate-only color change is a visual difference', async () => {
        // 只修改候选构建的行为，两侧用例代码保持完全一致。
        for (const change of [
          'color: ["#e00000", "#00a000"]',
          'padding: {left: 120, right: 20, top: 20, bottom: 20}',
          'label: {visible: true}'
        ]) {
          await fs.writeFile(
            path.join(dir, 'current.js'),
            Buffer.concat([
              bundle,
              Buffer.from(
                `\nconst Original = VChart.default; VChart.default = class extends Original { constructor(spec, options) { super({...spec, ${change}}, options); } };`
              )
            ])
          );
          assert.equal((await executePhase(dir, 'current', url, 'bar-stack')).status, 'diff', change);
        }
        const input = summary();
        const report = await saveReport(dir, input);
        assert.equal(input.status, 'passed', '汇总不能修改输入状态');
        assert.equal(report.status, 'diff');
        assert.equal(report.counts.diff, 1);
        assert.equal(report.schemaVersion, 1);
        for (const file of Object.values(report.cases[0].images)) {
          assert.ok(file, JSON.stringify(report.cases[0]));
          assert.ok(!path.isAbsolute(file));
          await fs.access(path.join(dir, file));
        }
        assert.match(report.cases[0].rerun, /--baseline a{40} --case 'bar-stack'/);
        assert.match(report.rerun, /--baseline a{40} --dir 'charts\/bar'/);
        assert.ok(!JSON.stringify(report).includes('base64'));
        const markdown = await fs.readFile(path.join(dir, 'agent-summary.md'), 'utf8');
        assert.match(markdown, /bar-stack — diff/);
        // file:// 打开整个报告，确认无需 HTTP 服务，筛选和图片均可用。
        const require = createRequire(path.join(packageDir, 'package.json'));
        const { chromium } = require('@playwright/test');
        const browser = await chromium.launch();
        try {
          const page = await browser.newPage();
          const unexpected = [];
          page.on('request', request => {
            if (!request.url().startsWith('file:')) unexpected.push(request.url());
          });
          page.on('pageerror', error => unexpected.push(error.message));
          await page.goto(new URL(`file://${dir}/index.html`).href);
          assert.ok(
            (await page.locator('[data-testid="selection"]').textContent()).includes(`选中 1 / ${caseMetadata.length}`)
          );
          assert.match(await page.locator('header').textContent(), /所选用例完成比较/);
          assert.equal(
            await page.locator('a', { hasText: '查看冻结用例' }).getAttribute('href'),
            `suite/cases/${barFile}`
          );
          await page.locator('article img').last().scrollIntoViewIfNeeded();
          await page.waitForFunction(() =>
            [...document.querySelectorAll('article img')].every(image => image.complete && image.naturalWidth > 0)
          );
          assert.equal(await page.locator('article img').count(), 3);
          await page.locator('#status').selectOption('passed');
          assert.equal(await page.locator('article:visible').count(), 0);
          await page.locator('#status').selectOption('diff');
          assert.equal(await page.locator('article:visible').count(), 1);
          assert.deepEqual(unexpected, []);
          const moved = `${dir}-moved`;
          try {
            await fs.cp(dir, moved, { recursive: true, filter: source => !source.includes('node_modules') });
            await page.goto(new URL(`file://${moved}/index.html`).href);
            await fs.access(path.join(moved, `suite/cases/${barFile}`));
            await page.locator('article img').last().scrollIntoViewIfNeeded();
            await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth));
          } finally {
            await fs.rm(moved, { recursive: true, force: true });
          }
        } finally {
          await browser.close();
        }
        // 差异图丢失时，报告必须升级为执行错误，并保留诊断。
        const diff = path.join(dir, report.cases[0].images.diff);
        await fs.rename(diff, `${diff}.saved`);
        const missing = await saveReport(dir, summary());
        assert.equal(missing.status, 'error');
        assert.ok(missing.cases[0].errors.some(error => error.category === 'missing_artifact'));
        await fs.rename(`${diff}.saved`, diff);
        await fs.writeFile(path.join(dir, 'current.js'), bundle);
      });
      await t.test('missing screenshot is an execution error', async () => {
        // 缺图不得被自动补成基线。
        const snapshot = path.join(dir, 'snapshots/bar-stack.png');
        await fs.rename(snapshot, `${snapshot}.saved`);
        await assert.rejects(executePhase(dir, 'current', url, 'bar-stack'));
        await assert.rejects(fs.access(snapshot));
        const report = await saveReport(dir, summary());
        assert.equal(report.status, 'error');
        assert.equal(report.cases[0].status, 'error');
        assert.equal(report.cases[0].errors[0].stage, 'comparison');
        await fs.rename(`${snapshot}.saved`, snapshot);
      });
      await t.test('missing bundle and runtime exception are execution errors', async () => {
        // 同时覆盖资源加载和浏览器运行异常。
        await fs.rm(path.join(dir, 'current.js'));
        await assert.rejects(executePhase(dir, 'current', url, 'bar-stack'));
        await fs.writeFile(
          path.join(dir, 'current.js'),
          Buffer.concat([bundle, Buffer.from('\nthrow new Error("intentional runtime failure");')])
        );
        await assert.rejects(executePhase(dir, 'current', url, 'bar-stack'));
        await fs.writeFile(path.join(dir, 'current.js'), bundle);
      });
      await t.test('blocked external request is an execution error', async () => {
        // 禁止页面请求外网，且失败不能退化成像素差异。
        await fs.writeFile(
          path.join(dir, 'current.js'),
          Buffer.concat([bundle, Buffer.from('\nfetch("https://example.com/forbidden");')])
        );
        await assert.rejects(executePhase(dir, 'current', url, 'bar-stack'));
        await fs.writeFile(path.join(dir, 'current.js'), bundle);
      });
      await t.test('empty rendering and incorrect static input cannot pass', async () => {
        // 即使两份产物都能加载，空绘制和错误图表输入仍是执行错误。
        for (const change of ['data: {id: "data", values: []}', 'type: "line"']) {
          await fs.writeFile(
            path.join(dir, 'current.js'),
            Buffer.concat([
              bundle,
              Buffer.from(
                `\nconst Original=VChart.default;VChart.default=class extends Original {constructor(spec,options){super({...spec,${change}},options);}};`
              )
            ])
          );
          await assert.rejects(executePhase(dir, 'current', url, 'bar-stack'));
          const result = JSON.parse(await fs.readFile(path.join(dir, 'current-result.json')));
          assert.equal(result.tests[0].status, 'error');
        }
        await fs.writeFile(path.join(dir, 'current.js'), bundle);
      });
      await t.test('render timeout is an execution error', async () => {
        // 只缩短验证副本的超时，避免故障自检等待正式的三十秒。
        const configFile = path.join(dir, 'suite/settings.mjs');
        const config = await fs.readFile(configFile, 'utf8');
        await fs.writeFile(configFile, config.replace('timeout: 30000', 'timeout: 1000'));
        const pageFile = path.join(dir, 'suite/page.html');
        const page = await fs.readFile(pageFile, 'utf8');
        await fs.writeFile(pageFile, page.replace('window.__visualReady = true', 'window.__visualReady = false'));
        await assert.rejects(executePhase(dir, 'current', url, 'bar-stack'));
        await fs.writeFile(configFile, config);
        await fs.writeFile(pageFile, page);
      });
      await t.test('failed build command rejects instead of using an old artifact', async () => {
        // 命令退出非零时立即停止，不能继续读取已有构建文件。
        await assert.rejects(run(process.execPath, ['-e', 'process.exit(7)'], root, path.join(dir, 'failure.log')));
      });
      await t.test('ineffective interactions cannot pass', async () => {
        // 分别抑制四类交互，验证状态断言而非只验证图片文件存在。
        const configFile = path.join(dir, 'suite/settings.mjs');
        const config = await fs.readFile(configFile, 'utf8');
        await fs.writeFile(configFile, config.replace('timeout: 30000', 'timeout: 1500'));
        for (const id of ['legend-filter', 'tooltip-hover', 'datazoom-drag', 'update-resize']) {
          const casesFile = path.join(dir, 'suite/cases', caseMetadata.find(item => item.id === id).file);
          const original = await fs.readFile(casesFile, 'utf8');
          assert.ok(original.includes('export default {'), '故障注入必须命中真实模块');
          // 替换模块的动作，保留原始 verify；不依赖某一行鼠标代码的格式。
          await fs.writeFile(
            casesFile,
            original.replace('export default {', 'const original = {') +
              '\nexport default {...original, async exercise() {}};\n'
          );
          await assert.rejects(executePhase(dir, 'baseline', url, id), id);
          const result = JSON.parse(await fs.readFile(path.join(dir, 'baseline-result.json'), 'utf8'));
          assert.equal(result.tests[0].id, id);
          assert.equal(result.tests[0].status, 'error');
          await fs.writeFile(casesFile, original);
        }
        await fs.writeFile(configFile, config);
      });
      await t.test('server cannot expose files outside its allowlist', async () => {
        // 服务只能读取两份产物和冻结用例。
        assert.equal((await fetch(`${url}/summary.json`)).status, 404);
        assert.equal((await fetch(`${url}/suite/%2e%2e%2fcurrent.js`)).status, 404);
      });
    } finally {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
      await fs.rm(dir, { recursive: true, force: true });
    }
  }
);

test('preparation errors preserve not-run cases and escape HTML', async () => {
  // 未进入 Playwright 的失败也生成可读报告，不伪造图片、通过状态或详细报告链接。
  const dir = await fs.mkdtemp(path.join(root, '.vchart-visual/report-check-'));
  try {
    const report = await saveReport(dir, {
      status: 'error',
      stage: 'localBuild',
      error: '<script>bad()</script>',
      environment: {},
      cases: [{ id: 'bar-stack', purpose: 'minimal' }]
    });
    assert.equal(report.complete, false);
    assert.equal(report.counts.not_run, 1);
    assert.deepEqual(report.logs, {});
    assert.deepEqual(report.cases[0].images, { baseline: null, current: null, diff: null });
    const html = await fs.readFile(path.join(dir, 'index.html'), 'utf8');
    assert.ok(!html.includes('<script>bad()'));
    assert.match(html, /&lt;script&gt;/);
    const markdown = await fs.readFile(path.join(dir, 'agent-summary.md'), 'utf8');
    assert.match(markdown, /localBuild/);
    assert.match(markdown, /bar-stack — not_run/);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('directory selection, optional sources and frozen paths', async () => {
  // 用独立副本模拟未登记文件和工作区变化，不修改仓库 case。
  const dir = await fs.mkdtemp(path.join(root, '.vchart-visual/directory-contracts-'));
  try {
    const source = path.join(dir, 'source');
    const frozen = path.join(dir, 'frozen');
    await fs.cp(path.join(packageDir, '__tests__/visual'), source, { recursive: true });
    const index = path.join(source, 'cases/index.mjs');
    const original = await fs.readFile(index, 'utf8');
    const optional = original.replace(/,\s*sourceExample: '[^']*'/g, '');
    assert.notEqual(optional, original);
    await fs.writeFile(index, optional);
    await fs.mkdir(path.join(source, 'cases/empty'));
    await fs.writeFile(
      path.join(source, 'cases/unregistered.mjs'),
      'throw new Error("must not import unregistered case");'
    );
    await fs.cp(source, frozen, { recursive: true });
    const frozenFiles = await fileManifest(frozen);
    const all = await loadCases(frozen);
    assert.equal(all.length, caseMetadata.length);
    assert.ok(all.every(item => item.sourceExample === undefined));
    assert.equal(selectCases(all).length, caseMetadata.length);
    assert.equal(
      selectCases(all, { dir: 'charts' }).length,
      caseMetadata.filter(item => item.file.startsWith('./charts/')).length
    );
    assert.deepEqual(
      selectCases(all, { dir: 'components' })
        .map(item => item.id)
        .sort(),
      caseMetadata
        .filter(item => item.file.startsWith('./components/'))
        .map(item => item.id)
        .sort()
    );
    assert.ok(selectCases(all, { dir: 'components/label' }).some(item => item.id === 'pie-label'));
    assert.deepEqual(
      selectCases([...all, { id: 'sibling', file: './components/label-other/example.mjs' }], {
        dir: 'components/label'
      }).map(item => item.id),
      caseMetadata.filter(item => item.file.startsWith('./components/label/')).map(item => item.id)
    );
    for (const options of [{ dir: 'empty' }, { dir: 'missing' }, { case: 'missing' }])
      assert.throws(() => selectCases(all, options), { code: 'CASE_MANIFEST_INVALID' });
    assert.throws(() => selectCases(all, { dir: '../components' }), { code: 'INVALID_ARGUMENT' });
    assert.throws(() => selectCases(all, { dir: 'components', case: 'pie-label' }), { code: 'INVALID_ARGUMENT' });
    for (const args of [
      ['--dir', 'components'],
      ['--dir', 'components', '--baseline', 'a'.repeat(40)],
      ['--dir', 'api', '--self-compare']
    ])
      assert.ok(parseOptions(args).dir);
    // 已冻结输入不受原副本后续删除模块或重写清单影响。
    await fs.writeFile(index, 'export const cases=[];');
    await fs.rm(path.join(source, 'cases/components'), { recursive: true });
    assert.deepEqual(
      (await loadCases(frozen)).map(item => item.id),
      all.map(item => item.id)
    );
    assert.deepEqual(await fileManifest(frozen), frozenFiles);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('symlinked case files and parent directories fail before import', async () => {
  // 文件和祖先目录都不能把清单导入指向套件外。
  const dir = await fs.mkdtemp(path.join(root, '.vchart-visual/directory-links-'));
  try {
    for (const [index, relative] of [
      'cases',
      'cases/components',
      'cases/components/label',
      `cases/${caseMetadata[0].file.slice(2)}`
    ].entries()) {
      const suite = path.join(dir, `suite-${index}`);
      await fs.cp(path.join(packageDir, '__tests__/visual'), suite, { recursive: true });
      const target = path.join(suite, relative);
      const outside = path.join(dir, `outside-${index}`);
      await fs.rename(target, outside);
      await fs.symlink(outside, target);
      await assert.rejects(loadCases(suite), { code: 'CASE_MANIFEST_INVALID' });
    }
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('manifest, result identity, caches, locks and cleanup contracts', async t => {
  // 使用独立目录覆盖不会通过正常截图触发的边界，不引入新测试框架。
  const dir = await fs.mkdtemp(path.join(root, '.vchart-visual/contracts-'));
  try {
    await t.test('exact result set', () => {
      for (const ids of [[], ['a', 'a'], ['a', 'c'], ['a', 'b', 'c']])
        assert.throws(() => validateResults({ tests: ids.map(id => ({ id })) }, ['a', 'b']), {
          code: 'RESULT_SET_MISMATCH'
        });
      validateResults({ tests: [{ id: 'b' }, { id: 'a' }] }, ['a', 'b']);
    });
    await t.test('manifest failures and nested fingerprint', async () => {
      for (const [index, transform] of [
        [0, text => text.replace("id: 'line-gap'", "id: 'bar-stack'")],
        [1, text => text.replace(`file: '${caseMetadata[0].file}'`, "file: '../../escape.mjs'")],
        [2, text => text.replace(`file: '${caseMetadata[0].file}'`, "file: './missing.mjs'")]
      ]) {
        const suite = path.join(dir, `suite-${index}`);
        await fs.cp(path.join(packageDir, '__tests__/visual'), suite, { recursive: true });
        const file = path.join(suite, 'cases/index.mjs');
        const original = await fs.readFile(file, 'utf8');
        assert.notEqual(transform(original), original);
        await fs.writeFile(file, transform(original));
        await assert.rejects(loadCases(suite), { code: 'CASE_MANIFEST_INVALID' });
      }
      const empty = path.join(dir, 'empty-suite');
      await fs.mkdir(path.join(empty, 'cases'), { recursive: true });
      await fs.writeFile(
        path.join(empty, 'cases/index.mjs'),
        'export const cases=[]; export async function loadCase() {}'
      );
      await assert.rejects(loadCases(empty), { code: 'CASE_MANIFEST_INVALID' });
      const suite = path.join(dir, 'invalid-export');
      await fs.cp(path.join(packageDir, '__tests__/visual'), suite, { recursive: true });
      await fs.writeFile(path.join(suite, 'cases', caseMetadata[0].file), 'export default {createSpec(){return {};}};');
      await assert.rejects(loadCases(suite), { code: 'CASE_MANIFEST_INVALID' });
      const before = await fileManifest(suite);
      await fs.writeFile(path.join(suite, 'cases/nested-data.json'), '{}');
      assert.notDeepEqual(await fileManifest(suite), before);
    });
    await t.test('cache hit, malformed metadata, missing and damaged bundle', async () => {
      const cache = path.join(dir, 'cache');
      await publishCache(cache, 'key', Buffer.from('bundle'));
      assert.equal((await readCache(cache, 'key')).toString(), 'bundle');
      assert.equal(await readCache(cache, 'different'), null);
      await fs.writeFile(path.join(cache, 'bundle.js'), 'damaged');
      assert.equal(await readCache(cache, 'key'), null);
      await fs.rm(path.join(cache, 'bundle.js'));
      assert.equal(await readCache(cache, 'key'), null);
      await fs.writeFile(path.join(cache, 'metadata.json'), '{');
      assert.equal(await readCache(cache, 'key'), null);
      await publishCache(cache, 'new', Buffer.from('replacement'));
      assert.equal((await readCache(cache, 'new')).toString(), 'replacement');
    });
    await t.test('lock ownership and independent cleanup', async () => {
      const unlock = await acquireLock(dir, { runId: 'owner', pid: process.pid });
      await assert.rejects(acquireLock(dir, { runId: 'other' }), { code: 'RUN_LOCKED' });
      let cleaned = false;
      const errors = await cleanupAll([
        async () => {
          cleaned = true;
        },
        async () => {
          throw Error('intentional');
        }
      ]);
      assert.ok(cleaned);
      assert.equal(errors[0].code, 'CLEANUP_FAILED');
      await unlock();
      await assert.rejects(fs.access(path.join(dir, 'running.lock')));
    });
    await t.test('import has no signal side effects and help does not require a browser', () => {
      const cli = path.join(packageDir, 'scripts/visual-test.mjs');
      const result = spawnSync(process.execPath, [
        '--input-type=module',
        '-e',
        `const before=process.listenerCount('SIGINT');await import(${JSON.stringify(
          cli
        )});if(process.listenerCount('SIGINT')!==before)process.exit(3);`
      ]);
      assert.equal(result.status, 0, result.stderr.toString());
      assert.ok(parseOptions(['--help', '--list', '--check']).help);
      assert.ok(parseOptions(['--help', '--dir', '../invalid']).help);
      assert.throws(() => parseOptions(['--help', '--unknown']), { code: 'INVALID_ARGUMENT' });
      assert.equal(spawnSync(process.execPath, [cli, '--help']).status, 0);
    });
    await t.test('old bundle removed even if successful command produces nothing', async () => {
      const repo = path.join(dir, 'fake-build');
      for (const folder of ['packages/vchart/build', 'packages/vutils-extension', 'tools/bundler', 'common/scripts'])
        await fs.mkdir(path.join(repo, folder), { recursive: true });
      spawnSync('git', ['init', '-q', repo]);
      await fs.writeFile(path.join(repo, '.gitignore'), 'packages/vchart/build/\n');
      await fs.writeFile(path.join(repo, 'packages/vchart/build/index.js'), 'old');
      await fs.writeFile(path.join(repo, 'common/scripts/install-run-rushx.js'), 'process.exit(0);');
      await assert.rejects(build(repo, path.join(dir, 'bundle.js'), runtime, path.join(dir, 'build.log')), {
        code: 'BUILD_FAILED'
      });
      await assert.rejects(fs.access(path.join(repo, 'packages/vchart/build/index.js')));
    });
    await t.test('working tree fingerprint includes uncommitted and untracked changes', async () => {
      const repo = path.join(dir, 'dirty');
      await fs.mkdir(repo);
      spawnSync('git', ['init', '-q', repo]);
      await fs.writeFile(path.join(repo, 'code.js'), 'before');
      spawnSync('git', ['-C', repo, 'add', '.']);
      const committed = spawnSync('git', [
        '-C',
        repo,
        '-c',
        'user.name=Visual Test',
        '-c',
        'user.email=visual@example.invalid',
        'commit',
        '-qm',
        'fixture'
      ]);
      assert.equal(committed.status, 0);
      const before = await workingTree(repo);
      await fs.writeFile(path.join(repo, 'code.js'), 'after');
      assert.notEqual((await workingTree(repo)).digest, before.digest);
      await fs.writeFile(path.join(repo, 'extra.js'), 'untracked');
      assert.equal((await workingTree(repo)).dirty, true);
    });
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('preparation and report failures return 2 and preserve diagnostic JSON', async t => {
  // 隔离工作区缺少安装依赖；报告写入故障不影响源仓库或其他运行。
  const dir = await fs.mkdtemp(path.join(root, '.vchart-visual/failure-run-'));
  try {
    await fs.cp(path.join(packageDir, '__tests__/visual'), path.join(dir, 'packages/vchart/__tests__/visual'), {
      recursive: true
    });
    assert.equal(await runVisual(dir, { 'self-compare': true, dir: 'components' }), 2);
    const runs = path.join(dir, '.vchart-visual/runs');
    const firstDir = path.join(runs, (await fs.readdir(runs))[0]);
    const first = JSON.parse(await fs.readFile(path.join(firstDir, 'summary.json')));
    assert.ok(first.issues.some(issue => issue.code === 'PREFLIGHT_FAILED'));
    assert.equal(first.counts.not_run, caseMetadata.filter(item => item.file.startsWith('./components/')).length);
    assert.equal(first.selection.selectedCount, first.counts.not_run);
    assert.equal(first.selection.totalCount, caseMetadata.length);
    assert.match(first.rerun, /--self-compare --dir 'components'/);
    assert.equal(first.finalized, true);
    const unresolved = await saveReport(firstDir, {
      ...first,
      request: { baseline: 'c'.repeat(40), dir: 'components' }
    });
    assert.match(unresolved.rerun, /--baseline c{40} --dir 'components'/);
    assert.equal(unresolved.status, 'error');
    const write = fs.writeFile.bind(fs);
    const mocked = t.mock.method(fs, 'writeFile', async (file, ...args) => {
      if (String(file).endsWith('index.html'))
        throw Object.assign(new Error('intentional report write failure'), { code: 'EACCES' });
      return write(file, ...args);
    });
    assert.equal(await runVisual(dir, { 'self-compare': true, dir: 'components/label' }), 2);
    mocked.mock.restore();
    const latest = (await fs.readdir(runs)).sort().at(-1);
    const report = JSON.parse(await fs.readFile(path.join(runs, latest, 'summary.json')));
    assert.ok(report.issues.some(issue => issue.code === 'REPORT_FAILED'));
    assert.equal(report.status, 'error');
    assert.equal(report.finalized, true);
    assert.deepEqual(
      report.selection.selectedIds,
      caseMetadata.filter(item => item.file.startsWith('./components/label/')).map(item => item.id)
    );
    assert.match(report.rerun, /--self-compare --dir 'components\/label'/);
    await assert.rejects(fs.access(path.join(dir, '.vchart-visual/running.lock')));
    // 输出目录不可建立时不能尝试构建，直接返回执行错误。
    const blocked = path.join(dir, 'blocked');
    await fs.mkdir(blocked);
    await fs.writeFile(path.join(blocked, '.vchart-visual'), 'not a directory');
    assert.equal(await runVisual(blocked, {}), 2);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('incremental reporter retains completed cases before onEnd', async () => {
  // 进程中断前的每条用例证据必须已经写入磁盘。
  const { default: Reporter } = await import('../__tests__/visual/reporter.mjs');
  const dir = await fs.mkdtemp(path.join(root, '.vchart-visual/partial-'));
  const previous = { dir: process.env.VISUAL_RUN_DIR, phase: process.env.VISUAL_PHASE };
  try {
    process.env.VISUAL_RUN_DIR = dir;
    process.env.VISUAL_PHASE = 'baseline';
    const reporter = new Reporter();
    reporter.onTestEnd(
      { title: 'bar-stack', annotations: [{ type: 'stage', description: 'comparison' }] },
      { status: 'passed', duration: 1, errors: [], attachments: [] }
    );
    const partial = JSON.parse(await fs.readFile(path.join(dir, 'baseline-result.json')));
    assert.equal(partial.finalized, false);
    assert.equal(partial.status, 'error');
    assert.equal(partial.tests[0].id, 'bar-stack');
    assert.equal(partial.tests[0].code, null);
    reporter.onError({ message: 'worker interrupted' });
    reporter.onEnd({ status: 'interrupted' });
    const final = JSON.parse(await fs.readFile(path.join(dir, 'baseline-result.json')));
    assert.equal(final.finalized, true);
    assert.equal(final.status, 'error');
    assert.equal(final.tests.length, 1);
  } finally {
    if (previous.dir === undefined) delete process.env.VISUAL_RUN_DIR;
    else process.env.VISUAL_RUN_DIR = previous.dir;
    if (previous.phase === undefined) delete process.env.VISUAL_PHASE;
    else process.env.VISUAL_PHASE = previous.phase;
    await fs.rm(dir, { recursive: true, force: true });
  }
});

test('browser installation failure is a preflight error', async () => {
  // 在子进程中指定空浏览器目录，不删除或更改用户已安装的 Chromium。
  const empty = await fs.mkdtemp(path.join(root, '.vchart-visual/no-browser-'));
  try {
    const result = spawnSync(process.execPath, [path.join(packageDir, 'scripts/visual-test.mjs'), '--check'], {
      env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: empty },
      encoding: 'utf8'
    });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /PREFLIGHT_FAILED/);
  } finally {
    await fs.rm(empty, { recursive: true, force: true });
  }
});

test('case specs are deterministic and independently allocated', async () => {
  // 重复创建不共享数据对象，防止一个执行阶段污染另一阶段的输入。
  const { loadCase } = await import('../__tests__/visual/cases/index.mjs');
  for (const metadata of caseMetadata) {
    const item = await loadCase(metadata);
    const first = item.createSpec();
    const second = item.createSpec();
    // 回调是每次创建的独立函数；对照函数源码而不要求引用相同。
    function comparable(value) {
      if (typeof value === 'function') return { functionSource: value.toString() };
      if (Array.isArray(value)) return value.map(comparable);
      if (value && typeof value === 'object')
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, comparable(item)]));
      return value;
    }
    assert.deepEqual(comparable(first), comparable(second), metadata.id);
    // 递归检查全部配置对象，兼容顶层数据及 common 系列内部数据。
    function independent(a, b) {
      if (!a || typeof a !== 'object') return;
      assert.notEqual(a, b, metadata.id);
      for (const key of Object.keys(a)) independent(a[key], b[key]);
    }
    independent(first, second);
  }
});

test('migrated cases declare unique BugServer IDs in their module header', async () => {
  // 当前无公开示例来源的用例均为迁移项，来源 ID 只在文件头维护。
  for (const metadata of caseMetadata.filter(item => !item.sourceExample)) {
    const code = await fs.readFile(path.join(packageDir, '__tests__/visual/cases', metadata.file), 'utf8');
    const header = code.match(/\/\*\*[\s\S]*?\*\//)?.[0];
    const line = header?.match(/BugServer case IDs: ([^\r\n]+)/)?.[1];
    assert.ok(line, metadata.id);
    const ids = line.trim().split(/,\s*/);
    assert.ok(ids.length > 0 && ids.every(id => /^[a-f0-9]{24}$/.test(id)), metadata.id);
    assert.equal(new Set(ids).size, ids.length, metadata.id);
  }
});

test('source checks preserve configuration through known transformer normalization', async () => {
  // 只允许已知的数组规范化；原轴、数据长度、函数和组件字段仍须匹配。
  const { assertSpec } = await import('../__tests__/visual/helpers.mjs');
  const expected = { type: 'bar', axes: [{ orient: 'left', inverse: true }], data: { values: [{ x: 1, y: 2 }] } };
  let actual = { ...structuredClone(expected), axes: [...expected.axes, { orient: 'bottom' }] };
  assertSpec(actual, expected);
  actual.axes[0] = { orient: 'left', inverse: false };
  assert.throws(() => assertSpec(actual, expected), /inverse/);
  actual = structuredClone(expected);
  actual.axes = [];
  assert.throws(() => assertSpec(actual, expected), /spec.axes/);
  actual = structuredClone(expected);
  actual.data.values.push({ x: 2, y: 3 });
  assert.throws(() => assertSpec(actual, expected), /spec.data.values/);
  const callback = value => value * 100;
  const components = { crosshair: { xField: { visible: true } }, indicator: { visible: false }, format: callback };
  assertSpec({ crosshair: [components.crosshair], indicator: [components.indicator], format: callback }, components);
  assert.throws(() => assertSpec({ ...components, crosshair: [] }, components), /组件数量/);
  assert.throws(() => assertSpec({ ...components, indicator: [{ visible: true }] }, components), /indicator.visible/);
  assert.throws(() => assertSpec({ ...components, format: value => value * 10 }, components), /回调配置/);
});

test('empty pie checks require a visible placeholder and reject nonzero data slices', async () => {
  // 空数据不能直接跳过有效绘制检查；占位环消失或仍有扇区都必须失败。
  const { verifyEmptyPie } = await import('../__tests__/visual/helpers.mjs');
  const graphic = { attribute: { visible: true, outerRadius: 20 }, globalAABBBounds: { width: () => 40 } };
  let slices = [];
  const series = {
    type: 'pie',
    getMarks: () => [{ name: 'emptyCircle', getGraphics: () => [graphic] }],
    getSeriesMark: () => ({ getGraphics: () => slices })
  };
  const previous = globalThis.window;
  globalThis.window = { __visualChart: { getChart: () => ({ getAllSeries: () => [series] }) } };
  const page = { evaluate: async fn => fn() };
  try {
    await verifyEmptyPie(page);
    graphic.attribute.visible = false;
    await assert.rejects(verifyEmptyPie(page), /占位环/);
    graphic.attribute.visible = true;
    slices = [{ attribute: { visible: true, startAngle: 0, endAngle: 1 } }];
    await assert.rejects(verifyEmptyPie(page), /有效扇区/);
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
});
