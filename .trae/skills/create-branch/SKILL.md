---
name: create-branch
description: 'Creates a new development branch in the VChart project following standard naming conventions. Use this skill to start new work on a clean, synchronized branch based on a specified base branch (default: develop). You must provide a `topic` for the branch name.'
---

# 创建开发分支 (create-branch)

## 概述

本技能用于在 `VChart` 仓库中，基于指定的基础分支（默认为 `develop`）创建一个符合团队命名规范的、干净的开发分支。

## 前置条件

- **Git 环境**: 需要一个配置好 git 的环境。
- **工作树状态**: 为保证分支创建的纯净，建议在干净的工作树上执行。

## 输入参数

| 参数           | 类型    | 是否必填 | 默认值         | 描述                                           |
| -------------- | ------- | -------- | -------------- | ---------------------------------------------- |
| `topic`        | string  | 是       | (无)           | 分支主题，用于构成最终的分支名（例如 `perf-legend-opt`）。 |
| `baseBranch`   | string  | 否       | `develop`      | 创建新分支所基于的基础分支。                   |
| `branchPrefix` | string  | 否       | `chore/trae`   | 分支名的前缀。                                 |
| `useDateSuffix`| boolean | 否       | `true`         | 是否在分支名末尾追加日期和时间后缀。           |

## 输出与成功标准

- **主要输出** (`branch_name`): 成功创建并切换到的新分支的完整名称。
- **成功标准**:
    - `branch_created`: 新分支被成功创建。
    - `clean_working_tree`: 执行后工作树保持干净。

## 执行步骤

1.  **同步基础分支**:
    - Agent 会首先运行 `git fetch --all --prune` 来获取所有远程更新。
    - 接着，它会切换到 `{{baseBranch}}` 并执行 `git pull` 以确保其为最新状态。

2.  **生成并创建分支**:
    - 根据 `branchPrefix`、`topic` 和 `useDateSuffix` 参数组合生成标准格式的分支名。
    - 执行 `git checkout -b {{branch_name}}` 创建并切换到新分支。

3.  **状态检查**:
    - Agent 会运行 `git status` 检查并确认当前已在新分支上，且工作树是干净的。

## 何时使用 / 边界

- **使用时机**:
    - 当你需要为新功能、修复或任何其他编码任务，在 `VChart` 项目中创建一个新的、遵循团队规范的开发分支时。
- **边界**:
    - 此技能不负责提交任何代码，仅创建和切换分支。
    - 执行前，请确保你的工作区中没有需要保存的未提交变更，因为切换分支可能会导致问题。
