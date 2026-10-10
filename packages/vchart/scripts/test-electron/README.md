# Electron 单测隔离

VChart 的 Electron 单测按**测试文件**隔离：一个文件内共用页面，不同文件新建 BrowserWindow。Electron 主进程和 Jest 并发调度继续共用，窗口创建、执行、回收一起占用并发槽位。

原因是 `jest-electron@0.1.12` 原本复用窗口：Jest 重建模块，但 `globalThis`、DOM 和旧服务继续存在。VRender 的全局 application 与新模块的注册表、节点 ID 生成器可能混用，出现图元 creator 缺失或 Stage 主图层为空。清理特定 VRender Symbol 或将测试串行化都不能提供完整页面隔离。

## 执行

使用 Node.js 22，从仓库根目录执行：

```sh
npm run test:electron-isolation --prefix packages/vchart
npm test --prefix packages/vchart
node common/scripts/install-run-rush.js test --only tag:package
```

`test:electron-isolation` 先运行实际依赖代码的 Node 生命周期测试，再执行真实 Electron 的正序、逆序、双窗口并发、失败后继续运行四个场景。最后一个场景包含故意失败的 fixture，必须观察到 Jest 非零退出、仅该文件失败、两个正常文件均完成，整个验证脚本才通过。

fixture 放在 `fixtures/*.case.js`，由专用配置收集，不混入普通单测。验证脚本从任意目录调用均可，Jest 的 cwd 固定为 `packages/vchart`；每个子命令最长 120 秒，挂起时终止整个子进程组并报错。临时 JSON 结果在验证结束后清理。

窗口池和主进程检查使用 `node:test`、`vm` 和受控平台 mock，加载实际安装的补丁代码，覆盖窗口就绪与结果的 sender/id 匹配、并发上限、创建/加载失败、崩溃、关闭、超时、事件竞争、父进程断开和请求登记清理。

## 运行与调试行为

- 页面必须发出该窗口的 `WebContentsReady` 后才开始测试，页面启动上限 30 秒。
- 单条测试保持 Jest 的 timeout；整文件默认上限 120 秒，可用 `JEST_ELECTRON_SUITE_TIMEOUT_MS` 设置正数毫秒值。较长用例及调试断点应显式提高该上限。
- 普通模式收到结果后销毁窗口。文件之间暂时没有窗口不会退出主进程；正常结束由 Jest runner 关闭 Electron，父进程断开也会退出。
- 加载失败、renderer 崩溃、关闭或文件超时拒绝对应请求，清理监听和窗口，后续文件继续调度。测试断言失败保留真实失败结果。
- debug 串行执行，保留最近一份结果窗口。下一文件新建窗口，关闭旧结果窗口。手动 reload 只在新窗口中重跑当前文件，不重放历史文件；这次本地重跑结果显示在调试页面，不另行记入已经结束的 Jest 汇总。
- watch 每轮通过 `initialWin` 清理最近结果，再执行新任务。用户关闭已完成的调试结果窗口时结束调试会话；Ctrl+C 由父进程退出路径清理。

## 依赖补丁维护

补丁源文件为 `common/pnpm-patches/jest-electron@0.1.12.patch`。Rush 在 `common/config/rush/pnpm-config.json` 登记的 `patches/…` 路径会映射到生成的安装工作区，无须另复制补丁到 config 目录。

补丁涉及上游包的三个文件：

```text
lib/electron/main/window-pool.js
lib/electron/main/index.js
lib/electron/proc/index.js
```

修改补丁时从根目录执行：

```sh
ELECTRON_PATCH_DIR="$PWD/common/temp/jest-electron-isolation-patch"
node common/scripts/install-run-rush-pnpm.js patch jest-electron@0.1.12 --edit-dir "$ELECTRON_PATCH_DIR"
# 在编辑目录中修改依赖，再生成并安装补丁。
node common/scripts/install-run-rush-pnpm.js patch-commit "$ELECTRON_PATCH_DIR"
node common/scripts/install-run-rush.js update
node common/scripts/install-run-rush.js install
npm run test:electron-isolation --prefix packages/vchart
```

PNPM 出现多个 peer 变体时选择 `0.1.12`，保持精确版本补丁，不扩展到任意版本。升级 jest-electron 时必须重新审查补丁与生命周期协议，确认安装后的依赖真实包含改动。

提交补丁、必要的 Rush 配置和锁文件，以及本目录的验证脚本。`common/temp` 日志、编辑目录和 `.vchart-statplots` 诊断目录不随代码提交。

## 2026-10-10 验证记录

环境为 macOS、Node.js 22.23.3，当前分支 `chore/test-electron`。

| 检查                             | 结果                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 旧环境正序隔离反例               | 第二个文件稳定失败：全局状态残留、rect creator 缺失、Layer 构造器不一致                                         |
| 旧环境两份文件各自单跑           | 各自通过，证明有效用法下的跨文件污染                                                                            |
| 安装补丁后隔离矩阵               | 正序、逆序、双窗口并发、预期失败后继续执行均通过                                                                |
| 生命周期回归                     | 24 项通过                                                                                                       |
| 核心包全量                       | 90 套／521 项通过，包括原始四套报错测试及 dataZoom                                                              |
| pre-push 原命令                  | 通过；`vutils-extension` 1 套／1 项通过                                                                         |
| 另一个补丁消费者 `vchart-schema` | 2 套／3 项通过                                                                                                  |
| 真实 DEBUG_MODE watchAll         | 首次及键盘 `a` 重跑均为 2 套／4 项通过；页面 reload 仅显示当前文件 3 项通过、0 项失败；关闭结果窗口后会话退出 0 |

性能对比使用相同 4-worker 配置：旧环境全量为 67.658 秒，但 dataZoom 出现 `defaultLayer = null`；隔离后为 140.679 秒，全部通过。新日志中 90 个文件各执行一次，已排除历史重放；观察到 4 个活动测试 renderer，与并发上限一致。每份新页面需要重新加载 Jest 和依赖，这会增加冷启动成本，不能将失败的旧基线视作正确性能目标。

默认并发下核心全量为 44.749 秒，包含隔离验证及其他包任务的整个 pre-push 为 68.6 秒。并发数不同，不能用这两个数直接计算上述 4-worker 方案的性能提升。4-worker 的约 108% 耗时增加是本轮已知成本；后续若优化加载开销，必须继续满足每文件独立上下文和上述反例。

测试基础设施没有修改产品渲染实现，不需要新增业务视觉用例；创建 PR 前仍遵循 AGENTS.md 的全量视觉测试要求。
