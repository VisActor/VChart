const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const script = path.join(__dirname, 'check-npm-release.js');
const version = '2.2.0';

function check(t, responses, options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'check-npm-release-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const projects = ['first', 'second'].map(name => ({
    packageName: `@visactor/${name}`,
    projectFolder: `packages/${name}`,
    shouldPublish: true
  }));
  projects.push({ packageName: '@internal/tool', projectFolder: 'tools/tool', shouldPublish: false });
  fs.writeFileSync(path.join(directory, 'rush.json'), JSON.stringify({ projects }));
  for (const project of projects.filter(project => project.shouldPublish)) {
    const folder = path.join(directory, project.projectFolder);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'package.json'), JSON.stringify({
      name: project.packageName,
      version: options.localVersion || version
    }));
  }
  fs.mkdirSync(path.join(directory, 'bin'));
  const npm = path.join(directory, 'bin/npm');
  fs.writeFileSync(npm, `#!/usr/bin/env node
const fs = require('fs');
const assert = require('assert/strict');
const args = process.argv.slice(2);
assert.equal(args[0], 'view');
assert.deepEqual(args.slice(2), ['version', '--json', '--registry=https://registry.npmjs.org']);
fs.appendFileSync('queries', args[1] + '\\n');
const result = JSON.parse(process.env.RESPONSES)[args[1]];
assert.ok(result, 'unexpected package query: ' + args[1]);
process.stdout.write(result.raw === undefined ? JSON.stringify(result.body) : result.raw);
process.exitCode = result.status;
`);
  fs.chmodSync(npm, 0o755);
  const output = path.join(directory, 'output');
  const result = spawnSync(process.execPath, [script], {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${path.join(directory, 'bin')}${path.delimiter}${process.env.PATH}`,
      GITHUB_OUTPUT: output,
      PACKAGE_VERSION: version,
      GITHUB_EVENT_NAME: options.event || 'push',
      RESUME_PARTIAL_PUBLISH: options.resume || 'false',
      RESPONSES: JSON.stringify(responses)
    }
  });
  assert.ifError(result.error);
  return {
    ...result,
    output: fs.existsSync(output) ? fs.readFileSync(output, 'utf8') : '',
    queries: fs.existsSync(path.join(directory, 'queries')) ? fs.readFileSync(path.join(directory, 'queries'), 'utf8') : ''
  };
}

const present = { status: 0, body: version };
const missing = { status: 1, body: { error: { code: 'E404' } } };
const responses = (first, second) => ({ '@visactor/first@2.2.0': first, '@visactor/second@2.2.0': second });

test('全部缺失时发布，全部存在时跳过，并检查每个应发布包', t => {
  for (const [response, skip] of [[missing, false], [present, true]]) {
    const result = check(t, responses(response, response));
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.output, `skip_publish=${skip}\n`);
    assert.equal(result.queries, '@visactor/first@2.2.0\n@visactor/second@2.2.0\n');
  }
});

test('部分发布默认停止，只有手动事件加显式恢复输入才能继续', t => {
  for (const event of ['push', 'workflow_dispatch']) {
    for (const resume of ['false', 'true']) {
      const result = check(t, responses(present, missing), { event, resume });
      const allowed = event === 'workflow_dispatch' && resume === 'true';
      assert.equal(result.status, allowed ? 0 : 1, result.stderr);
      assert.equal(result.output, allowed ? 'skip_publish=false\n' : '');
      assert.match(result.stdout, /Existing packages: @visactor\/first/);
      assert.match(result.stdout, /Missing packages: @visactor\/second/);
      assert.match(result.stdout + result.stderr, allowed ? /Manual recovery enabled/ : /resume_partial_publish/);
    }
  }
});

test('恢复模式也不能将认证、限流、网络或无效响应当成版本缺失', t => {
  const failures = [
    ...['E401', 'E403', 'E429', 'E500', 'ECONNRESET'].map(code => ({ status: 1, body: { error: { code } } })),
    { status: 1, raw: 'network error' },
    { status: 0, body: '2.1.7' }
  ];
  for (const failure of failures) {
    const result = check(t, responses(present, failure), { event: 'workflow_dispatch', resume: 'true' });
    assert.equal(result.status, 1);
    assert.equal(result.output, '');
    assert.match(result.stderr, /Failed to query|Invalid npm response/);
  }
});

test('本地包版本不一致时，在远端查询及发布放行前失败', t => {
  const result = check(t, {}, { localVersion: '2.1.7', event: 'workflow_dispatch', resume: 'true' });
  assert.equal(result.status, 1);
  assert.equal(result.output, '');
  assert.equal(result.queries, '');
  assert.match(result.stderr, /local version 2.1.7, expected 2.2.0/);
});
