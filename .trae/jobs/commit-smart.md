---
job: commit-smart
intent: git-commit-push
version: v1
domain: git
runner: trae-solo
parameters:
  head: ''
  commitAllowEmpty: false
  pushAfterCommit: true
  commitMessageStrategy: auto
  message: ''
required_parameters: []
outputs:
  - commit_message
  - pushed_branch
success_criteria:
  - commit_created_or_skipped
---

# Commit Job（智能提交与推送）

## 步骤

1. 推导分支

- 若 `parameters.head` 为空：`git rev-parse --abbrev-ref HEAD`

2. 工作树检查

- `git status --porcelain`；若无变更且 `commitAllowEmpty==false`，返回 `commit_created_or_skipped`（跳过）

3. 生成提交信息（策略 `auto`）

- 类型：按路径前缀判定（含 `docs/` → `docs`；含 `__tests__/`/`*.test.*` → `test`；否则 `chore|fix|feat` 依据 `common/changes/**` 的 `type`，缺省 `chore`）
- 作用域：`packages/<name>` 或顶层目录
- 主题：若 `message` 非空用其首行，否则：
  - 有 `common/changes/**`：取最新条目的 `comment`
  - 否则：`sync changes before PR (N files)`

4. 执行提交与推送

- `git add --all`
- `git commit {{#commitAllowEmpty}}--allow-empty{{/commitAllowEmpty}} -m "<auto message>"`
- 若 `pushAfterCommit==true`：`git push -u origin {{head}}`

5. 输出

- `commit_message` 与 `pushed_branch`

## 人工检查点

- 返回提交信息与结果，待确认后继续 PR 步骤。

