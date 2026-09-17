# Bug Server 手动触发实现计划

> 参考 VRender `ae7fc0926` 的最终产物流程。使用方式见 `tools/bugserver-trigger/README.md`，权限边界见对应设计文档。

**目标：** 维护者输入 PR 编号和已审查的完整 head SHA，即可手动提交该 PR 的构建产物到 Bug Server。PR 构建仅在 `pull_request` 上下文执行。

**架构：** 独立 `pull_request` workflow 构建固定 head SHA 并上传产物；手动入口校验成功运行及产物来源，通过可信脚本读取单一 bundle 后交给原有客户端上传。

**技术栈：** GitHub Actions、Node.js 内置测试、Python 标准库、既有 Rush 构建和 TypeScript 客户端。

## 约束

- 保留 VChart 的 macOS / Node.js 18 四步构建、图片测试和性能测试行为。
- 两个 workflow 默认 `contents: read`，仅查询/下载 job 增加所需的只读权限。
- 默认分支手动 job 不检出或执行 PR 代码；PR 构建 runner 不持有 Bug Server token。
- 产物名绑定 PR 编号与 SHA，保留 7 天；ZIP 只接受单一普通 `index.js`，最大 64 MiB，不按归档路径解压。

## 任务 1：来源与 ZIP 校验

文件：`.github/scripts/bug-server-dispatch.cjs`、对应 Node 测试、`extract_bug_server_bundle.py`、`test_extract_bug_server_bundle.py`。

- [x] 移植参考测试并将仓库与 PR fixture 改为 VChart；先运行确认新增路径失败。
- [x] 同步 resolver：绑定 workflow、PR 事件、状态、仓库 ID、源分支、SHA，返回 `runId`、`runUrl`、`artifactId`。
- [x] 同步 ZIP 读取器，拒绝额外文件、路径穿越、重复名称、链接、特殊文件、超大文件和覆盖已有文件。
- [x] 运行 Node 和 Python 测试。

## 任务 2：调整 workflow

文件：`.github/workflows/bug-server.yml`、`.github/workflows/bug-server-pr-bundle.yml`。

- [x] 在独立 PR workflow 中沿用 VChart 四步构建，固定检出 `github.event.pull_request.head.sha`，上传命名产物。
- [x] 手动入口仅查询和提交产物：输出 artifact ID，按 ID 下载，再通过可信脚本读取 ZIP。
- [x] 设置 workflow 默认只读权限，自动 CI 增加 Python 测试，保留 VChart 提交客户端依赖与 180 分钟超时。
- [x] 修复 bugserver-trigger 入口 import 缺少 `from` 的语法错误。
- [x] 为 bugserver-trigger 补齐共享 ESLint 配置，让提交钩子按 TypeScript 解析入口文件。
- [x] 对两个 workflow 执行 actionlint，核对构建步骤及 token 边界。

## 任务 3：集成检查与文档

- [x] 更新中文使用说明和设计，注明先等待 PR bundle 成功、旧 PR 触发方式、产物过期处理及来源构建链接。
- [x] 从最终 workflow 提取下载、ZIP 读取、提交命令，在隔离目录模拟 artifact 到客户端的完整数据流，确认产物仅作为字节上传。
- [x] 检查格式及最终 diff，记录本地验证和线上未验证项。

## 验证结果

- Node 来源校验测试 36 项、Python ZIP 测试 6 项全部通过。
- 本地 macOS / Node.js 24.19.0 使用现有依赖完成四步构建，生成约 5.1 MB 的 bundle，`node --check` 通过。CI 构建沿用 Node.js 18；本地未重新安装全部 Rush 依赖。构建保留已有 sourcemap、ES module this 和循环依赖告警。
- actionlint 1.7.12 校验两个 workflow 通过；Prettier 和 `git diff --check` 通过。
- 对比基线，自动触发条件、自动构建和 PR bundle 的四步 VChart 构建命令一致。两个 workflow 默认只读，PR 构建仅由 `pull_request` 触发、无 Bug Server secret；两个手动 job 固定检出 workflow SHA，无 PR 构建步骤。
- 直接执行最终 workflow 的下载 JavaScript 和 ZIP 读取 shell：验证选定 artifact ID、正常字节保真；包含额外路径/客户端覆盖内容的 ZIP 被拒绝，可信客户端未被改写。
- 读取所得的抛错 JavaScript bundle 交给隔离客户端 mock，成功、图片失败、SCM 失败、token 缺失四种场景通过；PR 元数据与 API 顺序保持正确，bundle 未执行。
- resolver 和 ZIP 读取器与 VRender 最新实现相同；仅 workflow 的 runner、构建步骤、依赖版本、超时及中文说明保留 VChart 适配。
- 本次未推送或运行 VChart 线上 Actions/CodeQL，也未调用真实 Bug Server。VRender 的线上验证记录不能替代 VChart 自身的线上验收。
