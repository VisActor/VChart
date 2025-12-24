# 通过说明文件驱动执行

## 目的

- 不依赖“工作流模版”概念，仅在仓库中放置一个说明文件，描述任务与参数；我将按说明执行并回传报告。

## 放置位置

- 目录：`.trae/jobs/`
- 文件：建议使用 `*.request.md` 或 `*.request.json`，便于版本化与审阅。

## 通用字段

- `Task`：任务标识，例如 `Auto Test (diff-with-develop)`。
- `Parameters`：运行参数，例如 `sinceBranch`、`project`、`mode`、`noSnapshot`、`onlyNew`、`reportFormat`、`tempReportPath`。
- `ExecutionHints`（可选）：执行提示，如是否跳过快照、是否仅分析、不写补丁、选择包。
- `StepsOverride`（可选）：覆盖默认执行步骤的命令或动作（如自定义 diff 命令）。

## 示例（Markdown 请求）

```
# Task
Auto Test (diff-with-develop)

# Parameters
sinceBranch: develop
project: ''
mode: full
noSnapshot: false
onlyNew: false
reportFormat: md

# ExecutionHints
- skipWrite: false
- stopOnError: true

# StepsOverride
- git fetch --all --prune
- git diff --name-status --diff-filter=AMR develop...HEAD
- rush run -s test
- rush run -s test-cov
```

## 使用方式

- 推荐入口文件：`.trae/jobs/auto-test.md`（已提供，含参数、步骤、人工覆写与成功标准）
- 最简用法（默认参数）：在聊天中发起“执行 Auto Test Job（.trae/jobs/auto-test.md）”。
- 可选覆盖参数：`project=@visactor/vchart-theme`、`reportFormat=json`、`replaceAutogen=true` 等。
- 我将按 `.trae/jobs/auto-test.md` 的步骤顺序执行：采集差异、分析缺口、生成/更新测试（含函数级注释）、运行覆盖率、生成报告、插入人工节点。

## 结果与报告

- 报告以 `reportFormat` 指定（`md` 或 `json`）。
- 默认临时报告写入 `./.trae/output/autotest.report.local.md`（可通过 `tempReportPath` 覆盖）。
- 我会附带执行日志摘要、受影响包、生成/跳过的测试、覆盖率与人工节点清单。

## 旧方案清理

- 旧的“工作流模版”文件与文档已移除：
  - `.trae/workflows/autotest.diff-with-develop.json`
  - `docs/autotest-workflow.md`
- 现仅保留 Job 文件方案（`.trae/jobs/auto-test.md`）。

## 默认参数（参考）

- `sinceBranch=develop`
- `project=auto`（自动按 diff 识别变更包）
- `mode=full`
- `noSnapshot=false`
- `onlyNew=false`
- `reportFormat=md`
- `applyManualOverrides=true`
- `replaceAutogen=false`
- `dryRun=false`
- `preview=false`
- `stopOnError=true`
- `focusChangedOnly=false`
- `snapshotStrategy=combined`
- `tempReportPath=./.trae/output/autotest.report.local.md`
- `mockDefaults: time=fixed(2020-01-01T00:00:00Z), random=seed(42)`
