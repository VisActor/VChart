import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const output = await mkdtemp(path.join(tmpdir(), 'vchart-electron-isolation-'));
const scenarios = [
  { name: '正序串行', args: ['--runInBand'] },
  { name: '逆序串行', args: ['--runInBand'], reverse: true },
  { name: '双窗口并发', args: ['--maxWorkers=2'] },
  { name: '断言失败后继续执行', args: ['--runInBand'], failure: true }
];

function execute(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [require.resolve('jest/bin/jest'), ...args], {
      cwd,
      env,
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let log = '';
    let timedOut = false;
    child.stdout.on('data', chunk => {
      log += chunk;
    });
    child.stderr.on('data', chunk => {
      log += chunk;
    });
    const timer = setTimeout(() => {
      timedOut = true;
      if (process.platform === 'win32') execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F']);
      else process.kill(-child.pid, 'SIGKILL');
    }, 120000);
    child.once('error', error => {
      clearTimeout(timer);
      reject(error);
    });
    child.once('close', (code, signal) => {
      clearTimeout(timer);
      if (timedOut || signal) reject(new Error(`Electron 隔离验证未正常结束 (${signal || 'timeout'})\n${log}`));
      else resolve({ code, log });
    });
  });
}

try {
  for (const [index, scenario] of scenarios.entries()) {
    const resultFile = path.join(output, `${index}.json`);
    const started = performance.now();
    const { code, log } = await execute(
      [
        '--config',
        'scripts/test-electron/isolation.config.cjs',
        '--json',
        '--outputFile',
        resultFile,
        ...scenario.args
      ],
      {
        ...process.env,
        DEBUG_MODE: '',
        ELECTRON_ISOLATION_ORDER: scenario.reverse ? 'reverse' : '',
        ELECTRON_ISOLATION_FAILURE: scenario.failure ? '1' : ''
      }
    );
    try {
      assert.equal(code, scenario.failure ? 1 : 0);
      const result = JSON.parse(await readFile(resultFile, 'utf8'));
      assert.equal(result.numPassedTestSuites, 2);
      assert.equal(result.numFailedTestSuites, scenario.failure ? 1 : 0);
      assert.equal(result.numPassedTests, 4);
      const failures = result.testResults.filter(suite => suite.status === 'failed');
      if (scenario.failure) assert.match(failures[0].name, /03-failure\.case\.js$/);
      console.log(`PASS ${scenario.name} (${((performance.now() - started) / 1000).toFixed(2)}s)`);
    } catch (error) {
      throw new Error(`${scenario.name} 验证失败\n${log}`, { cause: error });
    }
  }
} finally {
  await rm(output, { recursive: true, force: true });
}
