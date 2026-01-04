# Skills 示例调用

## git.commit-push-smart

- 调用：`skill: git.commit-push-smart { pushAfterCommit: true, commitMessageStrategy: 'auto' }`
- 预期输出：commit_message、pushed_branch

## github.create-pr-from-file

- 调用：`skill: github.create-pr-from-file { title: 'feat: add legend', mode: 'auto' }`
- 预期输出：pr_url

## vcs.diff-collect

- 调用：`skill: vcs.diff-collect { sinceBranch: 'develop', includeWorkingTree: true }`
- 预期输出：diff_json => `./.trae/output/diff.json`

## test.autogen-from-diff

- 调用：`skill: test.autogen-from-diff { project: '@visactor/vchart', onlyNew: false }`
- 预期输出：test_files、snapshots、coverage_report、manual_nodes、temp_markdown_report

## release.changelog-rush-smart

- 调用：`skill: release.changelog-rush-smart { sinceBranch: 'develop', bumpType: 'auto' }`
- 预期输出：rush_change_entries、computed_bump_type、final_message

## git.create-branch

- 调用：`skill: git.create-branch { baseBranch: 'develop', branchPrefix: 'feat/chart', topic: 'v2-legend', useDateSuffix: true }`
- 预期输出：branch_name

## pipeline.release-prep

- 调用（单步）：`skill: pipeline.release-prep { flowStep: 1 }`
- 调用（串行）：`skill: pipeline.release-prep { autoNext: true }`
- 预期输出：autotest_report、rush_change_entries、commit_message、pushed_branch、pr_url

## 验证入口

- 统一入口脚本：`./.trae/scripts/validate-skill.sh <skill-id> [args]`
- 示例：
  - `./.trae/scripts/validate-skill.sh github.create-pr-from-file ./.trae/output/pr.body.local.md`
  - `./.trae/scripts/validate-skill.sh vcs.diff-collect develop`

## 单步执行说明（pipeline.release-prep）

- 步骤一（Autotest）：
  - 调用：`skill: pipeline.release-prep { flowStep: 1 }`
  - 输出：`autotest_report`，并返回 `next_step_hint` 提示下一步为 `flowStep=2`
- 步骤二（Changelog）：
  - 调用：`skill: pipeline.release-prep { flowStep: 2, message: 'feat: xxx', bumpType: 'auto' }`
  - 输出：`rush_change_entries`、`computed_bump_type`、`final_message`，`next_step_hint=flowStep=3`
- 步骤三（Commit）：
  - 调用：`skill: pipeline.release-prep { flowStep: 3, commitMessageStrategy: 'auto', pushAfterCommit: true }`
  - 输出：`commit_message`、`pushed_branch`，`next_step_hint=flowStep=4`
- 步骤四（PR 正文生成）：
  - 调用：`skill: pipeline.release-prep { flowStep: 4, title: '[Auto] xxx', lang: 'zh', labels: ['changelog','test'] }`
  - 输出：`generated_body_file=.trae/output/pr.body.local.md`，`next_step_hint=flowStep=5`
- 步骤五（创建 PR）：
  - 调用：`skill: pipeline.release-prep { flowStep: 5 }`
  - 输出：`pr_url`
- 说明：单步模式仅执行指定步骤；完成后按 `next_step_hint` 继续调用下一步。若希望自动推进，使用 `autoNext: true`。
