---
job: generate-rush-changes-smart
intent: rush-change-smart
version: v1
domain: release
runner: trae-solo
parameters:
  sinceBranch: develop
  message: ''
  bumpType: auto
  notCommit: true
  githubToken: ''
  interactive: true
required_parameters: []
outputs:
  - rush_change_entries
  - computed_bump_type
  - final_message
success_criteria:
  - rush_changes_generated
  - commitlint_passed
manual_overrides: []
---

# Changelog Job（智能 Rush 变更日志生成）

## 参数检查

- 无必填参数，均有默认值
- 如需“关联 Issue 标题”自动聚合，请提供 `githubToken`

## 步骤（交互说明）

1. 采集差异与提交

- 运行 `git diff --name-only {{sinceBranch}}...HEAD`，按文件路径映射到变更包
- 运行 `git log --pretty=%H:::%s {{sinceBranch}}...HEAD`，收集提交主题

2. 自动判定 bumpType（可被参数覆盖）

- 规则：
  - 含 `BREAKING CHANGE` 或 `!` → `major`
  - 含 `feat` → `minor`
  - 其余（`fix|perf|refactor|docs|chore|test`）→ `patch`
- 若 `parameters.bumpType != auto`，则使用显式值
- 将结果写入输出：`computed_bump_type`

3. 构建富消息（可被参数覆盖）

- 若 `parameters.message` 为空：
  - 提取关键提交的主题（优先 `feat`/`fix`）形成“提交概览”
  - 从提交中解析 `#<id>`，调用 GitHub API 读取 Issue 标题（需 `githubToken`），形成“关联 Issue”
  - 构建最终消息：首行摘要 + 提交概览 + 关联 Issue + 影响包
- 将最终消息写入输出：`final_message`

4. 提交信息校验

- 使用 `common/autoinstallers/lint/commitlint.config.js` 与本地 `commitlint` 执行校验
- 命令：`echo "{{final_message}}" | commitlint --config common/autoinstallers/lint/commitlint.config.js`

5. 生成 Rush 变更条目

- 执行 `rush change --bulk --bump-type '{{computed_bump_type}}' --message '{{final_message}}'`
- 输出文件位于 `common/changes/**`，收集为 `rush_change_entries`
- 当 `interactive==true`：生成条目后暂停，展示条目路径、包名、bumpType 与摘要，待人工确认后再继续

6. 可选提交

- 若 `notCommit != true`：
  - 运行 `git add --all`
  - 运行 `git commit -m 'docs: update changlog of rush'`

7. 人工检查点

- 展示 `rush_change_entries`：路径、包名、bumpType、摘要
- 如摘要需细化，编辑 `parameters.message` 或在二次执行中通过 `manual_overrides` 指定

## manual_overrides 示例

```yaml
manual_overrides:
  - bumpType: minor
    message: 'feat(core): 新增交互缩放配置，修复事件抛出问题 (#123)'
```
