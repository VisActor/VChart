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
  mode: auto
required_parameters: []
outputs:
  - autotest_report
  - rush_change_entries
  - pr_url
success_criteria:
  - flow_completed
---

# Auto Flow Job（分支→单测→变更日志→PR 串行编排）

## 参数检查

- 分支参数 `head` 可选：若未提供，将通过 `git rev-parse --abbrev-ref HEAD` 推导当前分支
- 建议提供 `topic` 以优化 PR 标题；未提供时将回退为当前分支名

## 步骤

1. 分支预检查

- 运行 `git rev-parse --abbrev-ref HEAD` 获取当前分支作为 `head`
- 确认当前分支不是 `main`/`develop`，且工作树状态符合提交规范
- 人工检查点：如不在开发分支，请先自行创建并切换到正确分支

2. 运行差异驱动单测

- 执行 Job：`.trae/jobs/autotest.md`
- 传参：`sinceBranch={{baseBranch}}`（其余沿用默认）
- 接收输出：`autotest_report=.trae/jobs/autotest.report.local.md`
- 人工检查点：打开临时报告，确认新增/更新测试与覆盖率

3. 生成 Rush 变更日志

- 执行 Job：`.trae/jobs/changelog-rush-smart.md`
- 传参：`sinceBranch={{baseBranch}}`、`message={{message}}`、`bumpType={{bumpType}}`、`notCommit={{notCommit}}`
- 接收输出：`rush_change_entries`
- 人工检查点：检查 `common/changes/**` 条目与摘要

4. 创建 PR

- 执行 Job：`.trae/jobs/pr-create.md`
- 传参：
  - `base={{baseBranch}}`
  - `head={{head}}`
  - `title='[Auto] {{topic || head}}'`
  - `lang={{lang}}`
  - `labels={{labels}}`
  - `message={{message}}`（用于正文摘要）
  - `bumpType={{bumpType}}`
  - `mode={{mode}}`（auto 优先 gh → token → 浏览器 URL）
- 接收输出：`pr_url`
- 人工检查点：最终确认并提交

5. 完成

- 标记 `flow_completed`，返回 `autotest_report`、`rush_change_entries` 与 `pr_url`
