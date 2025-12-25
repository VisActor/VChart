---
job: release-prep-pipeline
intent: prepare-release
version: v1
domain: pipeline
runner: trae-solo
parameters:
  baseBranch: develop
  lang: zh
  labels:
    - changelog
    - test
  topic: ''
  message: ''
  bumpType: auto
  notCommit: true
  head: ''
  mode: browser
  interactive: true
  commitBeforeFlow: true
  commitAllowEmpty: false
  pushAfterCommit: true
  commitMessageStrategy: auto
  enforceCommit: true
  commitRetry: 1
required_parameters: []
outputs:
  - autotest_report
  - rush_change_entries
  - compare_url
success_criteria:
  - flow_completed
---

# Auto Flow（交互版：分支 → 单测 → 变更日志 → PR，逐步人工确认）

## 使用说明

- 本 Job 在关键步骤插入“暂停点”，生成输出后停止执行，等待人工确认再继续（通过再次触发本 Job 或继续下游 Job）。
- 推荐搭配 `.trae/jobs/pr-create.md` 的 `localBodyFile=true` 使用，以便本地编辑正文预览。

## 步骤

1. 分支预检查（暂停点）

- `git rev-parse --abbrev-ref HEAD` 推导 `head`
- 校验不为 `main`/`develop`，展示工作树状态与当前分支
- 暂停，等待人工确认（如需切换分支或清理工作树）

  1.1 自动提交未提交变更（可选，含前后双暂停点）

- 检查 `git status --porcelain`；如有变更：
  - 展示将要提交的作用域与自动生成的 commit message
  - 暂停，待人工确认后执行 `git add/commit/push`
  - 提交后再次展示 `git status` 校验结果并暂停确认

2. 差异驱动单测（暂停点）

- 执行 `.trae/jobs/auto-test.md`（`sinceBranch={{baseBranch}}`）
- 写入临时报告 `.trae/output/autotest.report.local.md`
- 暂停，等待人工检查报告与覆盖率后继续

3. Rush 变更日志（暂停点）

- 执行 `.trae/jobs/changelog-rush-smart.md`
- 收集并展示 `common/changes/**` 条目与摘要
- 暂停，等待人工确认（可编辑 message 后重跑本步）

4. 创建 PR（暂停点）

- 执行 `.trae/jobs/pr-create.md`，使用 `mode=browser` 强制生成 Compare URL
- 写入本地正文预览 `./.trae/output/pr.body.local.md`
- 暂停，等待人工在浏览器页面完成最终提交

5. 完成

- 返回 `autotest_report`、`rush_change_entries` 与 `compare_url`，标记 `flow_completed`
