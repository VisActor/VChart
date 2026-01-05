---
name: pr-create-from-body
description: 'Creates a GitHub Pull Request for the VChart project using a local markdown file as its body. Use this skill as the final step in the PR-creation process, after the PR body has been generated and reviewed. It requires either a `GITHUB_TOKEN` or a logged-in `gh` CLI environment to operate.'
---

# 从本地文件创建 PR (pr-create-from-body)

## 概述

本技能用于读取一个本地 Markdown 文件作为 Pull Request 的正文，并在 GitHub 上创建该 PR。它是 `pr-body-generate` 技能的后续步骤，负责将准备好的内容发布出去。

## 前置条件

- **GitHub 凭证**: 必须在环境中配置 `GITHUB_TOKEN`，或者已安装并登录了 `gh` CLI。
- **PR 正文文件**: 必须存在一个包含 PR 正文的本地 Markdown 文件。通常由 `pr-body-generate` 技能生成。
- **分支已推送**: 源分支必须已经推送到远程仓库。

## 输入参数

| 参数        | 类型    | 是否必填 | 默认值                             | 描述                                                           |
| ----------- | ------- | -------- | ---------------------------------- | -------------------------------------------------------------- |
| `title`     | string  | 是       | (无)                               | Pull Request 的标题。                                          |
| `base`      | string  | 否       | `develop`                          | PR 的目标分支。                                                |
| `head`      | string  | 否       | (空)                               | PR 的源分支。如果为空，将自动推导当前分支。                  |
| `bodyFile`  | string  | 否       | `./.trae/output/pr.body.local.md`  | 包含 PR 正文的本地 Markdown 文件的路径。                     |
| `mode`      | string  | 否       | `auto`                             | 创建 PR 的方式 (`auto`, `gh`, `rest`)。`auto` 会优先使用 `gh`，其次是 `rest` (基于 `GITHUB_TOKEN`)。 |
| `draft`     | boolean | 否       | `false`                            | 是否将 PR 创建为草稿（Draft）状态。                            |
| `labels`    | array   | 否       | `[]`                               | 要附加到 PR 的标签列表。                                       |

## 输出与成功标准

- **主要输出** (`pr_url`): 成功创建的 Pull Request 的 URL。
- **成功标准** (`pr_created`): Pull Request 已在 GitHub 上成功创建。

## 执行步骤

1.  **参数与环境检查**:
    - Agent 会检查 `title` 是否已提供。
    - 确认 `head` 分支，如果未提供则自动检测当前分支。
    - 检查 `bodyFile` 指定的文件是否存在且内容不为空。
    - 根据 `mode` 参数检查 `GITHUB_TOKEN` 或 `gh` CLI 是否可用。

2.  **（可选）提交变更**: 如果 `commitBeforeCreate` 设置为 `true` 且有未提交的变更，Agent 会先执行一次智能提交（类似于 `commit-smart` 技能）。

3.  **创建 PR**:
    - **gh 模式**: Agent 会使用 `gh pr create` 命令，并通过 `--body-file` 参数直接传入正文文件。
    - **rest 模式**: Agent 会读取 `bodyFile` 的内容，然后通过调用 GitHub REST API (`POST /repos/{owner}/{repo}/pulls`) 来创建 PR。
    - **auto 模式**: 自动选择可用的最佳方式。

4.  **输出结果**: 如果 PR 创建成功，Agent 会返回该 PR 的 URL。如果失败，则会返回详细的错误信息。

## 何时使用 / 边界

- **使用时机**:
    - 在使用 `pr-body-generate` 生成并（可选地）人工审查了 PR 正文之后，作为发布的最后一步。
    - 当你有一个准备好的 Markdown 文件，并希望用它作为 PR 的描述来快速创建 PR 时。
- **边界**:
    - 此技能强依赖于一个已存在的、内容完备的本地正文文件。
    - 它不会修改 PR 正文内容，只是“按原样”上传。
    - 创建 PR 前，请确保你的 `head` 分支已经包含了所有需要合并的提交，并已推送到远程仓库。
