---
name: commit-smart
description: 'Creates a well-formed, intelligent Git commit for all pending changes in the VChart project. Use this skill to bundle your work into a single, clean commit that follows Conventional Commits standards. It automatically determines the commit type and scope, generates a message, and then performs the `git commit` and `git push`. Ideal for finalizing changes before creating a pull request.'
---

# 智能提交 (commit-smart)

## 概述

本技能用于将当前工作树中所有未提交的变更（staged 和 unstaged）进行一次智能化的 Git 提交，并可选地推送到远程仓库。它会自动根据文件路径和 `common/changes` 目录下的内容生成符合 Conventional Commits 规范的提交信息。

## 前置条件

- **Git 环境**: 一个配置好的 Git 环境，且当前位于一个 Git 仓库目录中。
- **远程分支**: 远程仓库需要存在与本地对应的分支，以便推送。

## 输入参数

| 参数                    | 类型    | 是否必填 | 默认值 | 描述                                                                 |
| ----------------------- | ------- | -------- | ------ | -------------------------------------------------------------------- |
| `head`                  | string  | 否       | (空)   | 要推送的分支名。如果为空，将自动推导当前所在分支。                   |
| `message`               | string  | 否       | (空)   | 手动指定的提交信息。如果提供，将以此为基础生成最终提交。             |
| `commitMessageStrategy` | string  | 否       | `auto` | 提交信息的生成策略，目前仅支持 `auto`。                              |
| `pushAfterCommit`       | boolean | 否       | `true` | 是否在提交后自动执行 `git push`。                                    |
| `commitAllowEmpty`      | boolean | 否       | `false`| 是否允许在没有文件变更时创建一个空提交。                           |

## 输出与成功标准

- **主要输出**:
    - `commit_message`: 最终生成的完整提交信息。
    - `pushed_branch`: 成功推送到的远程分支名。
- **成功标准**:
    - `commit_created_or_skipped`: 提交被成功创建；或者因为没有变更而安全地跳过。

## 执行步骤

1.  **分支与状态检查**:
    - Agent 首先会确定目标分支，如果 `head` 参数未提供，则自动获取当前分支名。
    - 接着，它会检查工作树的状态，如果没有任何变更且 `commitAllowEmpty` 为 `false`，则会跳过后续步骤。

2.  **生成提交信息**:
    - **类型(Type)**: Agent 会根据变更文件的路径（例如 `docs/` -> `docs`, `__tests__/` -> `test`）和 `common/changes/` 下的变更类型来推断。
    - **作用域(Scope)**: 根据文件所在的包（如 `packages/<name>`）或顶层目录来确定。
    - **主题(Subject)**: 优先使用 `message` 参数的首行；如果 `message` 为空，则会尝试从 `common/changes/` 的最新条目中提取 `comment` 作为主题；如果两者都无，则生成一个通用主题，如 `sync changes before PR (N files)`。

3.  **执行提交与推送**:
    - Agent 会运行 `git add --all` 将所有变更添加到暂存区。
    - 然后使用生成的提交信息执行 `git commit`。
    - 如果 `pushAfterCommit` 为 `true`，它会接着执行 `git push -u origin {{head}}` 将提交推送到远程仓库。

## 安全命令示例（避免提交环境文档）

为了避免将 `.trae/skills` 等环境/文档目录意外提交到远程，可以在使用本技能前或之后配合以下命令：

```bash
# 查看当前暂存内容
git status

# 如果发现 .trae/skills 被错误地加入暂存区，可以将其移除：
git restore --staged .trae/skills

# 如需手动提交时缩小范围，可使用路径前缀而不是 add --all：
git add packages/vchart src tests
```

> 提示：`commit-smart` 在内部会使用 `git add --all` 聚合变更，执行前请先用 `git status` 确认没有不希望提交的目录（如 `.trae/skills`），必要时可先执行 `git restore --staged .trae/skills` 清理暂存区。

## 何时使用 / 边界

- **使用时机**:
    - 在执行了 `auto-test` 和 `changelog-rush-smart` 之后，需要将所有自动生成的文件和你的代码变更一起提交时。
    - 在准备发起 Pull Request 之前的最后一步，用于创建一个干净、规范的提交。
- **边界**:
    - 此技能会提交工作区中 **所有** 的变更，请在执行前确认没有不想被提交的文件。
    - 它不会处理 Git 冲突，执行前请确保分支是干净的。
