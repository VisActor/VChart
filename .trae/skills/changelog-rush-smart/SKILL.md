---
name: changelog-rush-smart
description: 'Generates standardized changelog entries for a Rush-based monorepo like VChart. Use this skill to create changelog files based on Git commits since a base branch (default: develop). It intelligently determines the version bump type, aggregates commit messages, and can enrich them with linked GitHub issue titles if a GITHUB_TOKEN is provided.'
---

# 智能 Rush 变更日志 (changelog-rush-smart)

## 概述

本技能依据自 `develop` 分支以来的 Git 提交历史，为 `VChart` 项目自动生成符合 Rush 规范的变更日志条目。它能智能地推断版本变更类型（major/minor/patch），并聚合提交信息来创建消息内容。

## 前置条件

- **Rush 环境**: 项目依赖 `rush` 已正确安装。
- **GitHub Token (可选)**: 若想自动拉取并聚合关联 Issue 的标题，需在环境中配置 `GITHUB_TOKEN`。

## 输入参数

| 参数          | 类型   | 是否必填 | 默认值    | 描述                                                       |
| ------------- | ------ | -------- | --------- | ---------------------------------------------------------- |
| `sinceBranch` | string | 否       | `develop` | 用于差异计算的基准分支。                                   |
| `bumpType`    | string | 否       | `auto`    | 版本变更类型 (`auto`, `major`, `minor`, `patch`)。`auto` 会根据提交信息自动推断。 |
| `message`     | string | 否       | (空)      | 手动指定的变更摘要。如果为空，将根据提交记录自动生成。     |
| `notCommit`   | boolean| 否       | `true`    | 是否在生成变更条目后自动执行 `git commit`。                  |
| `githubToken` | string | 否       | (空)      | 用于访问 GitHub API 以获取 Issue 标题的个人访问令牌。      |

## 输出与成功标准

- **主要输出**:
    - `rush_change_entries`: 生成的 Rush 变更条目文件路径列表（位于 `common/changes/**`）。
    - `computed_bump_type`: 最终采纳的版本变更类型。
    - `final_message`: 用于生成变更条目的最终消息文本。
- **成功标准**:
    - `rush_changes_generated`: 变更条目已成功生成。
    - `commitlint_passed`: 生成的消息摘要符合 `commitlint` 规范。

## 执行步骤

1.  **采集差异与提交**: Agent 会收集从 `{{sinceBranch}}` 到 `HEAD` 的文件变更和提交记录。
2.  **判定版本变更类型 (`bumpType`)**:
    - Agent 会分析提交信息中的关键字（如 `BREAKING CHANGE`, `feat`, `fix` 等）来自动判断版本变更级别。
    - 如果用户显式提供了 `bumpType` 参数，则优先使用用户指定的值。
3.  **构建变更消息**:
    - 如果 `message` 参数为空，Agent 会智能地从提交历史中提取关键信息，并（在有 `githubToken` 的情况下）拉取关联 Issue 的标题，共同构成一条内容丰富的变更消息。
4.  **生成 Rush 变更条目**:
    - Agent 会执行 `rush change` 命令，使用上一步确定的 `bumpType` 和消息，为每个受影响的包生成对应的变更文件。
5.  **（可选）提交变更**: 如果 `notCommit` 未设置为 `true`，Agent 会将新生成的变更文件添加到 Git 暂存区并创建一个提交。

## 命令示例（本地等价操作）

在 VChart 仓库根目录，你可以用 `rush change --bulk` 近似完成此技能的核心步骤：

```bash
# 基于 develop...HEAD 的变更，为所有受影响的包批量生成变更条目
rush change --bulk
```

在运行前，建议先检查 `common/changes/**` 中是否已经存在覆盖当前提交集的条目；若已有合适的记录，可以跳过本次执行，避免重复生成。

## 何时使用 / 边界

- **使用时机**:
    - 在完成一个或多个功能的开发、即将发起 Pull Request 之前，用于生成标准的 `changelog` 条目。
    - 当你需要遵循 `VChart` 项目的版本发布流程，为你的变更创建记录时。
- **边界**:
    - 此技能只负责生成 `common/changes/**` 下的变更文件，它本身不执行版本发布 (`rush publish`)。
    - 自动生成的消息质量依赖于良好、规范的 Git 提交历史。
    - 如果 `common/changes/**` 中已经存在覆盖当前提交集的条目，可以只复核既有文件，无需强行生成新的变更记录，以避免重复。
