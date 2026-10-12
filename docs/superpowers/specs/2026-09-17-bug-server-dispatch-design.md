# Bug Server 手动触发设计

## 目标与方案

参考 VRender 的 `codex/bugserver-workflow-dispatch`，让维护者通过 PR 编号和已审查的完整 head SHA 验证外部 PR，无需创建临时分支或 PR。

同步参考分支 `ae7fc0926` 的最终方案：PR 事件提前构建产物，默认分支手动入口只校验和提交。此前的手动构建即使拆分 runner、不给 token、不配置缓存步骤，仍处于默认分支缓存可写的运行上下文。将构建移到 `pull_request` 事件，从事件作用域消除该风险，不采用参考仓库已放弃的 `cache-mode` 中间方案。

## 数据流

1. `bug-server-pr-bundle.yml` 仅在来自外部 fork 的 `pull_request` 中执行构建，检出准确 head SHA，沿用 VChart 的 macOS、Node.js 18 和 Rush 构建顺序。关闭持久 checkout 凭据、不传入 Bug Server token，缓存写入属于 PR 作用域。上传 `bug-server-pr-<编号>-<SHA>`，保留 7 天。
2. 仅从仓库默认分支运行 `workflow_dispatch`，从固定的 `github.workflow_sha` 加载校验脚本。校验 PR 编号、40 位十六进制 SHA、PR 所属仓库和当前 head。
3. 通过 workflow ID/路径、PR 事件、成功状态、base/head 仓库 ID、源分支及 run SHA 绑定来源构建。fork 的运行记录可能没有 PR 列表；如列表存在则必须包含目标 PR。
4. 选择最新匹配运行中唯一、未过期的命名产物，复核 artifact API 的 run ID、仓库 ID、SHA。不回退到较旧运行；失败时要求先成功运行 PR bundle workflow。
5. 提交 runner 从 workflow SHA 加载可信脚本，按 artifact ID 下载 ZIP，只接受一个普通 `index.js` 文件，最大 64 MiB。只读取文件字节到固定目标，禁止路径解压、覆盖已有文件或执行产物。
6. 固定版本客户端依赖独立安装且禁用 lifecycle scripts。仅触发 API 的 step 接收 `BUG_SERVER_TOKEN`，传入被测 SHA、PR ref、源分支，保留图片测试和性能测试行为。
7. 两个 workflow 默认 `contents: read`；查询/下载 job 需要 `actions: read`，目标校验另需 `pull-requests: read`。summary 记录 PR、SHA 和来源构建，日志保留用例结果。`main` push 和仓库内 PR 继续自动构建与测试。

## 按 PR 来源分流

PR 目标分支仍为 `main`、`develop`、`dev/**`。比较 `github.event.pull_request.head.repo.full_name` 与 `github.repository`：相等时只执行 **Bug Server CI** 的 `build` job，不相等时只执行 **Bug Server PR Bundle** 的 `build-pr-bundle` job。每个 PR 事件只实际构建一次。

GitHub 的 PR 事件过滤器不能按来源仓库过滤，因此使用 job 级 `if`；另一个 workflow 仍可生成运行记录，但其构建 job 会跳过，不分配 runner。`main` push 继续执行 CI 构建，`workflow_dispatch` 仅执行既有校验和提交 job。仓库内 PR 重跑 CI 即可；fork PR 先构建 bundle，再由维护者手动提交测试。

验证覆盖仓库内 PR、fork PR、`main` push 和手动触发四种事件，检查构建互斥及手动 job 的条件；运行 actionlint 和现有来源、ZIP 校验测试。构建命令不变，无需重复完整构建。

## 维护者操作

先等该 SHA 的 **Bug Server PR Bundle** 成功，再运行手动入口。产物缺失或过期需重跑 bundle 工作流。旧 PR 需更新或重新打开以触发新 PR 事件，外部 fork 的 Actions 运行可能需维护者批准。

## VChart 适配与验证

- 构建依次执行 vutils-extension、vchart、vchart-extension 的 `build:es`，最后构建 bugserver-trigger；不额外执行全量 schema/types/ES5 构建。
- 修复 bugserver-trigger 入口中缺少 `from` 的 import，确保入口可构建。
- 用 Node 测试覆盖目标解析及产物来源，Python 测试覆盖普通字节、路径穿越、额外/重复文件、链接/特殊文件、大小限制与目标覆盖；actionlint 校验两个 workflow。
- VChart 构建命令已在首轮验证，此次不改构建命令。以 mock artifact/API 验证下载、可信 ZIP 读取、客户端上传、提交元数据和失败路径。
- 真实手动运行需入口合入默认分支后执行，本次本地验证不调用真实 Bug Server。
