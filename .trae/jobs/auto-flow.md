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
  commitAllowEmpty: false
  pushAfterCommit: true
  commitMessageStrategy: auto
  flowStep: 1
  autoNext: true
required_parameters: []
outputs:
  - autotest_report
  - rush_change_entries
  - commit_message
  - pushed_branch
  - pr_url
  - next_step_hint
success_criteria:
  - flow_step_completed
---

# Auto Flow Job（单步执行：单测 → 变更日志 → 提交 → PR）

## 参数检查

- 分支参数 `head` 可选：若未提供，将通过 `git rev-parse --abbrev-ref HEAD` 推导当前分支
- 建议提供 `topic` 以优化 PR 标题；未提供时将回退为当前分支名
- 原则：不覆盖子 Job 默认参数；仅透传用户显式提供的参数

## 模式说明

- 单步模式：本 Job 每次仅执行一个步骤，由 `parameters.flowStep` 指定（取值：`1|2|3|4|5`）。步骤完成后进入人工暂停，返回 `next_step_hint` 提示你在对话中输入“执行下一步”。
- 串行模式：当 `parameters.autoNext == true` 时，从当前 `flowStep` 开始按既有步骤顺序自动推进至“完成”，不再返回 `next_step_hint`，而是直接继续下一步。

## 步骤

1. 差异驱动单测（flowStep=1）

- 执行 Job：`.trae/jobs/auto-test.md`
- 传参：`sinceBranch={{baseBranch}}`
- 接收输出：`autotest_report=.trae/output/autotest.report.local.md`
- 人工检查点：打开临时报告，确认新增/更新测试与覆盖率是否合理；当 `autoNext==true` 时，在报告生成后自动继续执行下一步。

2. 生成 Rush 变更日志（flowStep=2）

- 执行 Job：`.trae/jobs/changelog-rush-smart.md`
- 传参：`sinceBranch={{baseBranch}}`、`message={{message}}`、`bumpType={{bumpType}}`、`notCommit={{notCommit}}`
- 说明：仅透传用户显式提供的参数，未提供时不传，使用子 Job 默认值
- 接收输出：`rush_change_entries`、`computed_bump_type`、`final_message`
- 人工检查点：检查 `common/changes/**` 条目与摘要是否合理；当 `autoNext==true` 时，在条目生成后自动继续执行下一步。

3. 智能提交（flowStep=3）

- 执行 Job：`.trae/jobs/commit-smart.md`
- 传参：
  - `head={{head || (git rev-parse --abbrev-ref HEAD)}}`
  - `message={{message}}`（为空时使用步骤 2 的 `final_message`）
- 说明：除 `head` 与 `message` 外，其余参数不强制设置；未提供时使用子 Job 默认值
- 接收输出：`commit_message`、`pushed_branch`
- 人工检查点：确认提交信息与推送分支是否正确；当 `autoNext==true` 时，在提交与推送完成后自动继续执行下一步。

4. 生成 PR 正文（flowStep=4）

- 执行 Job：`.trae/jobs/pr-body-generate.md`
- 传参：
  - `title='[Auto] {{topic || head}}'`
  - `head={{head}}`
  - `lang={{lang}}`
  - `labels={{labels}}`
  - `rushChangesDir=common/changes`
  - `localBodyFile=true`
- 说明：仅透传上述必要编排参数，不改变子 Job 默认；未提供的可选项不透传
- 接收输出：`generated_title`、`generated_body_preview`、`generated_body_file=.trae/output/pr.body.local.md`
- 人工检查点：打开并审阅本地正文文件；当 `autoNext==true` 时，在正文生成后自动继续执行下一步。

5. 创建 PR（flowStep=5）

- 执行 Job：`.trae/jobs/pr-create-from-body.md`
- 传参：
  - `base={{baseBranch}}`
  - `head={{head}}`
  - `title='[Auto] {{topic || head}}'`
  - `lang={{lang}}`
  - `labels={{labels}}`
  - `mode=auto`
  - `localBodyFile=true`
  - `bodyFile='./.trae/output/pr.body.local.md'`
- 说明：默认优先使用 `GITHUB_TOKEN`（REST），其次 `gh`；不展示 compare URL
- 接收输出：`pr_url`
- 人工检查点：确认 PR 链接与页面内容；当 `autoNext==true` 时，在创建成功后进入“完成”阶段。

6. 完成

- 标记 `flow_step_completed`，返回本步骤对应输出与 `next_step_hint`；当 `autoNext==true` 时，返回本次串行执行的综合输出并结束。
