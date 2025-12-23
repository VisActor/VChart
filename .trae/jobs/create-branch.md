---
job: create-dev-branch
intent: gitflow-create-branch
version: v1
domain: git
runner: trae-solo
parameters:
  baseBranch: develop
  branchPrefix: chore/trae
  topic: ''
  useDateSuffix: true
required_parameters:
  - topic
outputs:
  - branch_name
success_criteria:
  - branch_created
  - clean_working_tree
---

# Create Branch Job（创建开发分支）

## 参数检查

- 必填参数：`topic`
- 若未提供：请在执行入口中补充 `topic`（示例：`topic: perf-legend-opt`），再继续后续步骤。

## 步骤

1. 同步基础分支

- 运行 `git fetch --all --prune`
- 运行 `git checkout {{baseBranch}} && git pull origin {{baseBranch}}`

2. 生成分支名

- 命名规则：`{{branchPrefix}}-{{topic}}-{{YYYYMMDD-HHMM}}`
- 将生成的分支名写入输出：`branch_name`

3. 创建分支

- 运行 `git checkout -b {{branch_name}}`

4. 人工检查点

- 运行 `git status` 并确认：
  - 当前分支为 `{{branch_name}}`
  - 工作树干净或仅包含预期改动

## 结果

- 成功则输出 `branch_name`，并保证后续任务在该分支上执行。
