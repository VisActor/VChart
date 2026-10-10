import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const tick = () => new Promise(resolve => setImmediate(resolve));

function harness({ debug = false, maxSize = 1, autoReady = true, createError = false } = {}) {
  const ipcMain = new EventEmitter();
  const app = new EventEmitter();
  app.getPath = () => '/unused';
  app.quit = () => {
    app.quitCount = (app.quitCount || 0) + 1;
  };
  const windows = [];
  const timers = new Map();
  class BrowserWindow extends EventEmitter {
    constructor() {
      super();
      if (createError) throw new Error('创建窗口失败');
      windows.push(this);
      this.webContents = new EventEmitter();
      this.webContents.id = windows.length;
      this.sent = [];
      this.webContents.send = (...args) => this.sent.push(args);
      this.webContents.openDevTools = () => {};
      this.webContents.isDestroyed = () => this.destroyed;
      this.destroyCount = 0;
    }
    loadURL() {
      if (autoReady)
        queueMicrotask(() => {
          this.webContents.emit('did-finish-load');
          ipcMain.emit('WebContentsReady', { sender: this.webContents });
        });
      return Promise.resolve();
    }
    getBounds() {
      return { width: 10, height: 10 };
    }
    isDestroyed() {
      return !!this.destroyed;
    }
    destroy() {
      assert.equal(this.destroyed, undefined, '窗口不能重复销毁');
      this.destroyed = true;
      this.destroyCount++;
      this.emit('closed');
    }
  }
  const file = require.resolve('jest-electron/lib/electron/main/window-pool');
  const nativeRequire = createRequire(file);
  const module = { exports: {} };
  const context = vm.createContext({
    module,
    exports: module.exports,
    __dirname: dirname(file),
    console,
    process: { env: {} },
    setTimeout(fn, delay) {
      const token = {};
      timers.set(token, { fn, delay });
      return token;
    },
    clearTimeout(token) {
      timers.delete(token);
    },
    require(name) {
      if (name === 'electron') return { app, ipcMain, BrowserWindow };
      if (name === '../../utils/config')
        return {
          Config: class {
            read() {
              return {};
            }
            write() {}
          }
        };
      return nativeRequire(name);
    }
  });
  vm.runInContext(readFileSync(file, 'utf8'), context, { filename: file });
  const pool = new module.exports.WindowPool(maxSize, debug);
  const suite = { path: '/fixture.case.js', config: {}, globalConfig: {} };
  function result(id, win = windows.at(-1)) {
    ipcMain.emit(id, { sender: win.webContents }, { numPassingTests: 1 });
  }
  async function complete(id) {
    const pending = pool.runTest(id, suite);
    await tick();
    const win = windows.at(-1);
    result(id, win);
    await pending;
    return win;
  }
  function fire(delay) {
    const timer = [...timers.values()].find(timer => timer.delay === delay);
    assert.ok(timer, `缺少 ${delay}ms 定时器`);
    timer.fn();
  }
  return {
    pool,
    ipcMain,
    windows,
    timers,
    app,
    suite,
    complete,
    result,
    fire,
    allowCreate() {
      createError = false;
    }
  };
}

test('两个文件使用不同窗口，结束后清理监听和窗口', async () => {
  const h = harness();
  const first = await h.complete('a');
  const second = await h.complete('b');
  assert.notEqual(first.webContents.id, second.webContents.id);
  assert.equal(first.destroyCount, 1);
  assert.equal(second.destroyCount, 1);
  assert.equal(h.ipcMain.listenerCount('a'), 0);
  assert.equal(h.ipcMain.listenerCount('WebContentsReady'), 0);
  assert.equal(h.timers.size, 0);
});

test('只有对应窗口的 ready 和结果能结算请求', async () => {
  const h = harness({ autoReady: false });
  const pending = h.pool.runTest('a', h.suite);
  await tick();
  const win = h.windows[0];
  h.ipcMain.emit('WebContentsReady', { sender: {} });
  win.webContents.emit('did-finish-load');
  assert.equal(win.sent.length, 0);
  h.ipcMain.emit('WebContentsReady', { sender: win.webContents });
  await tick();
  assert.equal(win.sent.length, 1);
  h.ipcMain.emit('a', { sender: {} }, {});
  assert.equal(win.destroyCount, 0);
  h.result('a', win);
  await pending;
  assert.equal(win.destroyCount, 1);
});

test('创建和运行一起受并发上限控制，移除第二个窗口不会误删第一个', async () => {
  const h = harness({ maxSize: 2 });
  const first = h.pool.runTest('a', h.suite);
  const second = h.pool.runTest('b', h.suite);
  const third = h.pool.runTest('c', h.suite);
  await tick();
  assert.equal(h.windows.length, 2);
  h.result('b', h.windows[1]);
  await second;
  await tick();
  assert.equal(h.windows.length, 3);
  assert.equal(h.windows[0].destroyCount, 0);
  assert.equal(h.windows[1].destroyCount, 1);
  assert.equal(h.pool.pool.length, 2);
  h.result('a', h.windows[0]);
  h.result('c', h.windows[2]);
  await Promise.all([first, third]);
  assert.equal(h.pool.pool.length, 0);
});

test('创建失败释放槽位，后续文件可正常执行', async () => {
  const h = harness({ createError: true });
  await assert.rejects(h.pool.runTest('a', h.suite), /创建窗口失败/);
  assert.equal(h.pool.pending, 0);
  h.allowCreate();
  await h.complete('b');
});

for (const phase of ['startup', 'running']) {
  for (const failure of ['load', 'crash', 'close', 'timeout']) {
    test(`${phase} 阶段 ${failure} 会拒绝请求并清理，后续文件可运行`, async () => {
      const h = harness({ autoReady: phase !== 'startup' });
      const pending = h.pool.runTest('a', h.suite);
      const rejection = assert.rejects(pending, /fixture\.case\.js/);
      await tick();
      const win = h.windows[0];
      if (failure === 'load') win.webContents.emit('did-fail-load', {}, -6, '找不到页面', '', true);
      if (failure === 'crash') win.webContents.emit('render-process-gone', {}, { reason: 'crashed' });
      if (failure === 'close') win.destroy();
      if (failure === 'timeout') h.fire(phase === 'startup' ? 30000 : 120000);
      await rejection;
      assert.equal(win.destroyCount, 1);
      assert.equal(h.pool.pool.length, 0);
      assert.equal(h.pool.pending, 0);
      assert.equal(h.timers.size, 0);
      assert.equal(h.ipcMain.listenerCount('a'), 0);
      assert.equal(h.ipcMain.listenerCount('WebContentsReady'), 0);
      assert.equal(win.webContents.listenerCount('render-process-gone'), 0);
      const next = h.pool.runTest('b', h.suite);
      await tick();
      const fresh = h.windows[1];
      if (phase === 'startup') {
        h.ipcMain.emit('WebContentsReady', { sender: fresh.webContents });
        await tick();
      }
      h.result('b', fresh);
      await next;
    });
  }
}

test('结果与关闭事件竞争不会重复结算，断言失败仍返回真实结果', async () => {
  const h = harness();
  const pending = h.pool.runTest('a', h.suite);
  await tick();
  const win = h.windows[0];
  h.ipcMain.emit('a', { sender: win.webContents }, { failureMessage: '真实断言失败' });
  win.destroy();
  const outcome = await pending;
  assert.equal(outcome.result.failureMessage, '真实断言失败');
  assert.equal(win.destroyCount, 1);
  assert.equal(h.timers.size, 0);
});

test('debug 保留最近结果，下一文件及 reload 使用新窗口，不重放历史文件', async () => {
  const h = harness({ debug: true });
  const first = await h.complete('a');
  assert.equal(first.destroyCount, 0);
  const second = await h.complete('b');
  assert.equal(first.destroyCount, 1);
  assert.equal(second.destroyCount, 0);
  h.ipcMain.emit('WebContentsReady', { sender: second.webContents });
  await tick();
  assert.equal(h.windows.length, 3);
  assert.equal(second.destroyCount, 1);
  const fresh = h.windows[2];
  assert.equal(fresh.sent.length, 1);
  h.result(fresh.sent[0][2], fresh);
  await tick();
  assert.equal(h.pool.pending, 0);
  h.pool.clearSaveTests();
  assert.equal(fresh.destroyCount, 1);
  assert.equal(h.ipcMain.listenerCount('WebContentsReady'), 0);
});

function processHarness({ ready = true, spawnError = false } = {}) {
  const children = [];
  const timers = new Map();
  let nextId = 0;
  const file = require.resolve('jest-electron/lib/electron/proc');
  const nativeRequire = createRequire(file);
  const module = { exports: {} };
  vm.runInNewContext(
    readFileSync(file, 'utf8'),
    {
      module,
      exports: module.exports,
      __dirname: dirname(file),
      process: { env: {} },
      console,
      setTimeout(fn, delay) {
        const token = {};
        timers.set(token, { fn, delay });
        return token;
      },
      clearTimeout(token) {
        timers.delete(token);
      },
      require(name) {
        if (name === 'electron') return '/fake-electron';
        if (name === '../../utils/uuid') return { uuid: () => `request-${++nextId}` };
        if (name === 'child_process')
          return {
            spawn() {
              if (spawnError) throw new Error('spawn failed');
              const child = new EventEmitter();
              child.connected = true;
              child.messages = [];
              child.send = (message, callback) => {
                child.messages.push(message);
                callback();
              };
              child.kill = () => {
                child.connected = false;
                child.emit('disconnect');
                child.emit('close', 1, null);
              };
              children.push(child);
              if (ready) queueMicrotask(() => child.emit('message', { type: 'ProcReady' }));
              return child;
            }
          };
        return nativeRequire(name);
      }
    },
    { filename: file }
  );
  return {
    proc: new module.exports.Electron(),
    children,
    timers,
    allowSpawn() {
      spawnError = false;
    },
    respond(child, message, error) {
      child.emit('message', {
        id: message.id,
        type: message.type === 'ProcInitialWin' ? 'ProcInitialWinEnd' : 'ProcRunTestResult',
        result: 'ok',
        error
      });
    }
  };
}

test('parent 并发请求共享进程，按 id 匹配且不为每个请求叠加事件监听', async () => {
  const h = processHarness();
  const requests = Array.from({ length: 20 }, () => h.proc.runTest({ path: 'fixture' }));
  await tick();
  assert.equal(h.children.length, 1);
  const child = h.children[0];
  assert.equal(child.listenerCount('message'), 1);
  assert.equal(child.listenerCount('error'), 1);
  for (const message of child.messages.reverse()) h.respond(child, message);
  assert.deepEqual(await Promise.all(requests), Array(20).fill('ok'));
  assert.equal(h.proc.requests.size, 0);
  h.proc.kill();
  assert.equal(child.listenerCount('message'), 0);
  assert.equal(h.timers.size, 0);
});

for (const event of ['disconnect', 'error', 'close']) {
  test(`parent ${event} 拒绝所有 pending 请求且移除登记`, async () => {
    const h = processHarness();
    const a = h.proc.runTest({ path: 'a' });
    const b = h.proc.initialWin();
    const assertions = [assert.rejects(a), assert.rejects(b)];
    await tick();
    const child = h.children[0];
    if (event === 'error') child.emit(event, new Error('child error'));
    else child.emit(event, 1, 'SIGTERM');
    await Promise.all(assertions);
    assert.equal(h.proc.requests.size, 0);
    h.proc.kill();
  });
}

test('main 返回窗口异常时 parent 拒绝对应请求，后续请求可完成', async () => {
  const h = processHarness();
  const a = h.proc.runTest({ path: 'a' });
  const assertion = assert.rejects(a, /renderer crashed/);
  await tick();
  const child = h.children[0];
  h.respond(child, child.messages[0], 'renderer crashed');
  await assertion;
  const b = h.proc.runTest({ path: 'b' });
  await tick();
  h.respond(child, child.messages[1]);
  assert.equal(await b, 'ok');
  h.proc.kill();
});

test('进程启动失败清除 opening 锁，后续启动可恢复', async () => {
  const h = processHarness({ spawnError: true });
  await assert.rejects(h.proc.initialWin(), /spawn failed/);
  assert.equal(h.proc.opening, undefined);
  h.allowSpawn();
  const pending = h.proc.initialWin();
  await tick();
  h.respond(h.children[0], h.children[0].messages[0]);
  assert.equal(await pending, 'ok');
  h.proc.kill();
});

test('进程启动超时结束子进程并清理启动监听', async () => {
  const h = processHarness({ ready: false });
  const assertion = assert.rejects(h.proc.initialWin(), /startup timed out/);
  await tick();
  [...h.timers.values()][0].fn();
  await assertion;
  const child = h.children[0];
  assert.equal(child.connected, false);
  assert.equal(child.listenerCount('message'), 0);
  assert.equal(child.listenerCount('error'), 0);
  assert.equal(h.timers.size, 0);
});

function mainHarness(debug) {
  const h = harness();
  const parent = new EventEmitter();
  parent.env = { CONCURRENCY: '2', DEBUG_MODE: debug ? 'true' : '' };
  parent.connected = true;
  parent.messages = [];
  parent.send = message => parent.messages.push(message);
  const module = { exports: {} };
  const file = require.resolve('jest-electron/lib/electron/main/index');
  const nativeRequire = createRequire(file);
  vm.runInNewContext(
    readFileSync(file, 'utf8'),
    {
      module,
      exports: module.exports,
      process: parent,
      console,
      require(name) {
        if (name === 'electron') return { app: h.app };
        if (name === './window-pool') return { WindowPool: h.pool.constructor };
        return nativeRequire(name);
      }
    },
    { filename: file }
  );
  h.app.emit('ready');
  return { ...h, parent };
}

test('普通模式文件间零窗口不会退出，parent 断开后退出', async () => {
  const h = mainHarness(false);
  h.parent.emit('message', { type: 'ProcRunTest', id: 'a', test: h.suite });
  await tick();
  h.result('a');
  await tick();
  h.app.emit('window-all-closed');
  assert.equal(h.app.quitCount || 0, 0);
  assert.equal(h.parent.messages.at(-1).id, 'a');
  h.parent.emit('disconnect');
  assert.equal(h.app.quitCount, 1);
});

test('main 为窗口异常返回对应 id 的错误，下一请求继续执行', async () => {
  const h = mainHarness(false);
  h.parent.emit('message', { type: 'ProcRunTest', id: 'a', test: h.suite });
  await tick();
  h.windows[0].webContents.emit('render-process-gone', {}, { reason: 'crashed' });
  await tick();
  const reply = h.parent.messages.at(-1);
  assert.equal(reply.id, 'a');
  assert.match(reply.error, /fixture.*crashed/);
  h.parent.emit('message', { type: 'ProcRunTest', id: 'b', test: h.suite });
  await tick();
  h.result('b');
  await tick();
  assert.equal(h.parent.messages.at(-1).id, 'b');
  assert.equal(h.parent.messages.at(-1).error, undefined);
});

test('debug 用户关闭最近结果窗口后退出', async () => {
  const h = mainHarness(true);
  h.parent.emit('message', { type: 'ProcRunTest', id: 'a', test: h.suite });
  await tick();
  h.result('a');
  await tick();
  h.windows[0].destroy();
  h.app.emit('window-all-closed');
  assert.equal(h.app.quitCount, 1);
  assert.equal(h.ipcMain.listenerCount('WebContentsReady'), 0);
});
