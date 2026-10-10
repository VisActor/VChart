# Electron 单测环境隔离优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 本计划默认在当前会话顺序执行，不主动派生子代理。若上述执行技能不可用，按本文的任务、检查点和验收条件执行。

**Goal:** 消除 Electron 窗口复用造成的跨测试文件状态污染，让图元注册、Stage 主图层和测试结果不依赖文件执行顺序。

**Architecture:** 保留一个 Electron 主进程与现有 Jest 调度，每个测试文件使用新建的 BrowserWindow；文件内的测试继续共用该窗口。通过 Rush/PNPM 对 `jest-electron@0.1.12` 应用受版本管理的补丁，统一管理窗口创建、页面就绪、IPC 结果和销毁，保持并发上限。

**Tech Stack:** Node.js 22、Rush 5.148.0、PNPM 10.7.0、Jest 26、jest-electron 0.1.12、Electron 11.5.0；现有 VRender 1.1.11。

## 全局约束

- 当前制定计划时工作区为 `chore/test-electron`，HEAD 为 `d169be9f3`；执行前再次确认分支和工作区，不切换或覆盖用户改动。
- 只改测试基础设施、依赖补丁、验证脚本和说明，不修改 VChart/VRender/VUtils 的业务运行路径。
- 使用 Node.js 22；本机可用路径为 `/Users/bytedance/.nvm/versions/node/v22.23.3/bin`。
- 隔离边界是一个测试文件，不是每条 `test`，也不是整个测试命令。
- 普通、watch、`DEBUG_MODE=1` 模式均执行同一隔离契约；调试模式允许保留最近一次结果窗口，但不得用它执行下一文件。
- 保留 `maxWorkers` 调度能力，不以串行运行、指定幸运顺序或删除 VRender 私有全局变量作为修复。
- `.vchart-statplots/` 当前是未跟踪的诊断目录，不能随计划或补丁提交。正式回归用例迁移到下文列出的路径。
- 本文只制定计划，不代表代码已修改或验证已通过，不在计划阶段提交代码。

## 已确认的依据与限制

`jest-electron` 的 `WindowPool.getAsync()` 会取回空闲窗口，测试 environment 的 `teardown()` 不清理页面上下文。Jest 每个文件重新加载模块，但 VRender 的 application、bootstrap 等状态存放在 `globalThis` 的 Symbol 属性中。由此可能出现旧服务与新模块注册表、节点 ID 生成器混用。

已在两个顺序执行的诊断文件中分别复现：

1. 当前模块成功注册 `rect`，旧 graphic service 却找不到它，抛出 `creator[graphicType] is not a function`。
2. 新 Stage 与旧 Layer 使用不同节点 ID 生成器，ID 碰撞时 Layer 被 `appendChild` 拒绝，出现 `defaultLayer = null`。

用户原始四套失败测试及完整 pre-push 命令在重新运行时均通过，因此上述复现证明了污染机制，尚未重建用户那次完整执行顺序。正式验收必须依赖确定性反例，不能仅以一次全量通过为依据。

## 文件与职责

| 文件                                                                      | 职责                                                                  |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `common/pnpm-patches/jest-electron@0.1.12.patch`                          | 记录第三方依赖修改；Rush 实际生成位置，安装工作区登记为 `patches/…`   |
| `common/config/rush/pnpm-config.json`                                     | 登记生成的 `globalPatchedDependencies`                                |
| `common/config/rush/pnpm-lock.yaml`、`common/config/rush/repo-state.json` | 由 Rush 更新实际发生变化的安装状态，不手改校验值                      |
| `packages/vchart/scripts/test-electron/isolation.config.cjs`              | 专用 Electron 隔离测试配置，复用项目 mapper 与 ts-jest 配置           |
| `packages/vchart/scripts/test-electron/sequencer.cjs`                     | 固定正序/逆序运行两份 fixture，使反例可重复                           |
| `packages/vchart/scripts/test-electron/fixtures/01-line.case.js`          | 初始化 line 与旧服务候选状态，同时验证自身环境正确                    |
| `packages/vchart/scripts/test-electron/fixtures/02-rect-stage.case.js`    | 独立初始化 rect、浏览器环境和 Stage，检查服务、构造器与图层一致       |
| `packages/vchart/scripts/test-electron/fixtures/03-failure.case.js`       | 受配置选择的预期失败文件，验证失败后仍会回收窗口并继续运行            |
| `packages/vchart/scripts/test-electron/verify-isolation.mjs`              | 运行正序、逆序、并发和预期失败矩阵，校验子进程退出码及汇总            |
| `packages/vchart/scripts/test-electron/window-lifecycle.test.mjs`         | 使用 Node 内置测试、受控 Electron mock 验证实际补丁后的窗口池生命周期 |
| `packages/vchart/scripts/test-electron/README.md`                         | 记录隔离契约、补丁维护与执行入口                                      |
| `packages/vchart/package.json`                                            | 增加 `test:electron-isolation` 脚本，供 pre-push 常规测试调用         |

依赖补丁的核心修改目标为：

```text
jest-electron/lib/electron/main/window-pool.js
jest-electron/lib/electron/main/index.js
jest-electron/lib/electron/proc/index.js
```

只有当窗口异常需要新的结果字段时，才联动现有 runner 的协议消费者。测试断言失败仍走当前结果协议，不改变成功结果结构。

## Task 1：建立可重复的隔离反例

**Files:** 新建配置、sequencer、两份正常 fixture 和 `verify-isolation.mjs`。

**Interfaces:** `verify-isolation.mjs` 从仓库任意目录调用均可；其 Jest 子进程 `cwd` 固定为 `packages/vchart`，以符合现有 mapper 对 `process.cwd()` 的依赖。`ELECTRON_ISOLATION_ORDER=reverse` 仅用于专用 sequencer。fixture 扩展名为 `.case.js`，不被普通 `__tests__` 配置重复收集。

- [x] 配置继承 `packages/vchart/jest.config.js`，覆盖 `rootDir`、`roots`、`testRegex` 和 `testSequencer`；不更改公共 mapper。

```js
const path = require('path');
const base = require('../../jest.config.js');
module.exports = {
  ...base,
  rootDir: path.resolve(__dirname, '../..'),
  roots: [path.join(__dirname, 'fixtures')],
  testRegex: '/fixtures/0[12]-.*\\.case\\.js$',
  testSequencer: path.join(__dirname, 'sequencer.cjs')
};
```

- [x] 两份 fixture 都先断言自身未继承跨文件 sentinel，再写入 sentinel；各自完整初始化所需图元和环境，保证单独执行及逆序执行都是有效调用。

```js
const key = Symbol.for('vchart.test.electron-isolation');
test('当前文件没有继承上一文件的全局状态', () => {
  expect(globalThis[key]).toBeUndefined();
  globalThis[key] = true;
});
```

- [x] line fixture 调用 `registerLine()`，检查 `application.graphicService.creator === graphicCreator`，并调用 `application.layerService.getStageLayer({})` 使服务真实初始化。
- [x] rect fixture 自行调用 `loadBrowserEnv()`、`registerRect()`，执行下列核心断言；Stage 无论断言是否成功都在 `finally` 中 release。

```js
expect(application.graphicService.creator).toBe(graphicCreator);
expect(application.graphicService.creator.rect).toBe(createRect);
const group = new Group({});
expect(() => group.createOrUpdateChild('rect', {}, 'rect')).not.toThrow();
expect(application.layerService.layerFactory.LayerCtor).toBe(Layer);
const stage = new Stage({ canvas: document.createElement('canvas'), width: 10, height: 10 });
try {
  expect(stage.defaultLayer).not.toBeNull();
  stage.defaultLayer.appendChild(new Group({}));
} finally {
  stage.release();
}
```

- [x] sequencer 实现 `sort(tests)` 与 `cacheResults()`；正序按文件路径排序，逆序将排序结果 reverse，不修改普通测试执行顺序。
- [x] wrapper 使用 `spawnSync` 或可终止的异步 spawn，调用项目的 `node_modules/jest/bin/jest.js`。默认检查矩阵为正序 `--runInBand`、逆序 `--runInBand`、正序 `--maxWorkers=2`；任意异常退出导致 wrapper 非零退出。为整个子命令设置 120 秒上限，超时必须终止整个测试进程树并报告失败。
- [x] 修改补丁前先运行正序反例，保存 sentinel/注册表一致性失败的输出；再分别只跑每份 fixture，确认它们在新环境中独立通过。未观察到反例失败时，不进入 Task 2。

```sh
export PATH='/Users/bytedance/.nvm/versions/node/v22.23.3/bin:'"$PATH"
cd packages/vchart
node node_modules/jest/bin/jest.js --config scripts/test-electron/isolation.config.cjs --runInBand
```

**交付检查点：** 正常有效的文件单跑通过，旧 runner 顺序执行稳定失败；记录失败为跨文件状态污染，不把无浏览器环境初始化或故意错误的 API 调用当作反例。

## Task 2：修复窗口及进程生命周期，生成可安装补丁

**Files:** 三个依赖内部文件、生成的 patch、Rush 安装配置及必要锁文件；新增生命周期 Node 测试。

**Interfaces:** `WindowPool.runTest(id, test)` 保留 Promise 结果契约 `{ result, id }`。活动测试数与正在创建窗口占用的槽位一起受 `maxSize` 限制。一个 id 最多成功或失败结算一次，结束后相关 IPC、页面就绪和异常事件监听全部移除。

- [x] 先用 `node:test` 与 `vm` 加载实际安装的 `window-pool.js`，仅 mock Electron、配置读写等平台边界。Fake BrowserWindow 继承 EventEmitter，记录实例、发送消息和 destroy 次数，通过 fake ipcMain 发送就绪及结果事件。断言运行两个文件时使用两个不同窗口，而不是为 mock 写一份新的窗口池实现。
- [x] 生命周期测试覆盖：并发创建也不超槽位；非首个窗口移除时不误删其他窗口；结果与关闭事件竞争仅结算一次；创建失败释放槽位；IPC sender 必须是本次窗口；失败后下一文件能运行。

```js
const first = await startAndComplete('suite-a');
const second = await startAndComplete('suite-b');
assert.notEqual(first.webContents.id, second.webContents.id);
assert.equal(first.destroyCount, 1);
assert.equal(ipcMain.listenerCount('suite-a'), 0);
```

`startAndComplete(id)` 是该 Node 测试文件内的驱动 helper：调用实际 `pool.runTest(id, test)`，等待 fake 窗口创建，发送来自该窗口的 `WebContentsReady` 和结果 IPC，再 await 返回结果。

- [x] 使用 Rush 包装器创建 patch 编辑目录，先检查 CLI 帮助，再编辑返回目录；不直接修改共享 node_modules 作为最终交付。

```sh
ELECTRON_PATCH_DIR="$PWD/common/temp/jest-electron-isolation-patch"
node common/scripts/install-run-rush-pnpm.js patch jest-electron@0.1.12 --edit-dir "$ELECTRON_PATCH_DIR"
```

- [x] 将窗口复用改为每次任务新建窗口。使用现有 `throat(maxSize)` 建立任务队列，创建、运行、回收均在同一个队列任务内；避免原有递归等待锁在创建失败时永久锁住。
- [x] 创建窗口前安装所有监听，再加载页面；以匹配该窗口的 `WebContentsReady` IPC 作为可发送测试的依据。`did-finish-load` 本身不足以证明 runner 消息监听已安装。
- [x] 就绪事件只启动本次等待的文件，移除“任意窗口 ready 就遍历历史列表重跑”的路径。用户手动 reload 调试页面时，至多重跑该窗口关联的一个文件，并为重跑创建新的上下文与结果 id；不能复用已结算的 IPC 请求。
- [x] 普通模式收到结果后在 `finally` 中移除任务监听、销毁窗口、释放槽位，再交付最终结果。窗口创建失败、页面加载失败、renderer 崩溃、测试中途关闭、进程 IPC 断开都必须给当前文件明确失败结果，不能留下永远 pending 的 Promise。
- [x] 设置 30 秒页面启动上限，保留 Jest 原有单条测试的 timeout；整文件看门狗使用 120 秒并允许 `JEST_ELECTRON_SUITE_TIMEOUT_MS` 显式覆盖。不能把单条测试默认的 5000 毫秒当作整个文件的运行上限。超时输出文件路径和阶段，清理窗口及监听后继续调度，不伪装成断言失败通过。调试断点需要更长时间时显式提高文件上限。
- [x] 把 window 移除与 window 销毁分开，修复现有赋值比较和重复 destroy：

```js
const idx = this.pool.findIndex(info => info.win === win);
if (idx !== -1) this.pool.splice(idx, 1);
// closed 回调只移除记录；主动清理入口负责 destroy 一次。
```

- [x] 修改 `window-all-closed` 策略：普通模式不能因文件之间短暂无窗口而自动退出，整个测试进程由现有 runner 的结束/父进程断开路径关闭。调试模式区分自动回收与用户关闭最近结果窗口，保留用户关闭调试窗口后结束会话的行为。
- [x] 调试模式仅保留最近一份完成结果窗口；下一文件创建自己的新窗口，关闭上一结果窗口；历史 fixture 不在同一页面累积执行。watch 每轮重新调度文件，不能从旧窗口列表自动重放。
- [x] parent proc 给 `runTest`/启动/initialWin 的 pending 请求登记 close、error、disconnect 处理，异常时移除监听并 reject。main 层窗口异常使用结果协议返回对应文件的失败；parent 异常进入 runner 已有 onFailure 路径。启动失败也必须释放 proc 创建锁。
- [x] 在 patch 编辑目录提交补丁，并让 Rush 生成配置和锁文件：

```sh
ELECTRON_PATCH_DIR="$PWD/common/temp/jest-electron-isolation-patch"
node common/scripts/install-run-rush-pnpm.js patch-commit "$ELECTRON_PATCH_DIR"
node common/scripts/install-run-rush.js update
```

上述命令均从仓库根目录执行；`--edit-dir` 已经由本机 PNPM 10.7.0 的 CLI 帮助确认支持。生成补丁文件位置以 Rush 实际登记值为准。

- [x] 运行 Task 1 矩阵和生命周期 Node 测试。再执行 `rush install` 并重复关键反例，确认修复来自可安装补丁，而非编辑目录或残留 node_modules。

**交付检查点：** 两类污染断言在正序、逆序与并发下通过；异常不会卡住队列；安装后补丁仍生效；调试和 watch 保持文件级隔离。

## Task 3：接入常规验证、完整验收并记录成本

**Files:** 预期失败 fixture、wrapper、`packages/vchart/package.json`、测试环境 README。

**Interfaces:** `npm run test:electron-isolation --prefix packages/vchart` 同时执行生命周期与真实 Electron 隔离矩阵，成功退出 0，任意不符合预期退出 1。预期失败场景必须显式选择，不能混入普通全量用例。

- [x] 增加受配置选择的预期失败文件，内容为真实失败断言：

```js
test('用于验证 runner 在失败后回收窗口并继续调度', () => {
  expect(1).toBe(2);
});
```

- [x] wrapper 以单并发将该失败文件排在正常 fixture 前，要求子进程退出 1、汇总包含恰好一套预期失败且两套正常 fixture 完整执行；退出 0、额外失败、挂起或缺少后续测试结果都算验收失败。
- [x] 加入进程/窗口异常驱动测试，模拟 `did-fail-load`、renderer crash、parent disconnect；检查错误归属正确、窗口只回收一次、无相关残留监听、下一请求正常结算。
- [x] 增加脚本并接入当前 `test`，保证 push 钩子实际执行隔离回归，而非只保留一个可选命令：

```json
{
  "test": "npm run test:electron-isolation && jest",
  "test:electron-isolation": "node --test scripts/test-electron/window-lifecycle.test.mjs && node scripts/test-electron/verify-isolation.mjs"
}
```

- [x] 运行原始四套失败测试及 VChart 全量单测，核对通过数量与新增用例范围：

```sh
npm test --prefix packages/vchart -- --runInBand __tests__/unit/mark/text.test.ts __tests__/unit/series/waterfall.test.ts __tests__/unit/chart/pie.test.ts __tests__/unit/component/crosshair/stacked-crosshair.test.ts
npm test --prefix packages/vchart
node common/scripts/install-run-rush.js test --only tag:package
```

- [x] 检查补丁影响的其他 Jest-Electron 消费包：`vutils-extension` 通过 pre-push 任务验证；`vchart-schema` 单独执行其 Jest 命令。执行前确认各包实际脚本和文件存在；分支上未包含 StatPlots 实现时，不引用其他分支的历史通过数作为本次验收。
- [x] 手动运行 `npm run test-watch --prefix packages/vchart -- __tests__/unit/mark/text.test.ts`，验证首次执行、保存后重跑、reload 和关闭窗口。每轮文件只执行一次，最终进程正常退出；记录调试模式最近窗口保留行为。
- [x] 对同一 Node、并发数和测试集合记录补丁前后墙钟时间、活动窗口峰值及运行后残留进程。首轮单次全量若增加超过 50%，检查重复调度和启动等待，复测确认成本；不能通过复用污染页面降低耗时。所有重复运行要有明确原因，不为取得一次通过盲目重试。
- [x] README 写明隔离边界、执行命令、预期失败检查、30 秒启动/120 秒整文件看门狗、调试行为、Rush 补丁更新步骤及实测成本。
- [x] 检查 git diff：只包含依赖补丁、必要安装状态、测试脚本及说明；不提交诊断目录、安装产物或其他分支代码。执行阶段是否提交按用户届时指令处理。

**最终验收条件：** 旧实现确定性失败的反例，在已安装补丁下全部通过；真实断言失败保持非零退出；异常不挂起；全量 core、其他消费者及 pre-push 原命令通过；watch/debug 不重复重放；性能成本有实测记录。

## 视觉测试边界

本轮修改测试调度环境，不改变产品图表 spec、图元或渲染实现，因此不新增业务视觉用例，也不将单测隔离用例登记到视觉清单。若执行时发现必须改动产品渲染路径，应先说明新证据并调整范围，随后按 AGENTS.md 运行相关视觉回归；任何实际创建的 PR 提交前仍须运行规定的全量视觉测试，并如实说明差异或阻断。

## 执行记录（2026-10-10）

三个任务已完成。正式反例先在旧环境观察到跨文件失败，并确认两个文件各自单跑通过；依赖补丁通过 Rush 生成、update/install 安装，生命周期 24 项与四场景真实 Electron 矩阵通过。当前分支核心包 90 套／521 项、pre-push 原命令、vutils-extension 1 项、vchart-schema 3 项通过。

watch/debug 手动检查采用两份隔离 fixture 的真实 `DEBUG_MODE=1 --watchAll --runInBand` 会话：首次和键盘 `a` 重跑都通过 4 项；通过 Electron 的 View → Reload 验证只重跑当前文件 3 项；关闭结果窗口后进程退出 0。这样同时检查了页面状态、服务一致性与 watch 的实际调度。

实际补丁路径为 `common/pnpm-patches/jest-electron@0.1.12.patch`，改动范围为测试环境补丁、回归测试和说明文档。详细命令、生命周期契约和性能成本见 `packages/vchart/scripts/test-electron/README.md`。4-worker 全量从旧环境 67.658 秒（dataZoom 失败）增加到 140.679 秒（全部通过），90 个文件各执行一次；默认并发核心包 44.749 秒，整个 pre-push 68.6 秒。
