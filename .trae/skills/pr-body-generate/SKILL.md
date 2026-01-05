---
name: pr-body-generate
description: 'Generates a well-formed Pull Request body for the VChart project based on its template. Use this skill to automatically populate the PR body with details like linked issues, changelog entries, self-test checklists, and a code walkthrough. The output is saved to a local file for review and modification before creating the PR.'
---

# 生成 PR 正文 (pr-body-generate)

## 概述

本技能用于根据 `VChart` 仓库中预设的 Pull Request 模板，自动生成一份内容丰富、格式规范的 PR 正文。它能够智能地聚合来自 Rush 变更日志、测试报告和 Git 提交历史的信息。

## 前置条件

- **Git 环境**: 一个配置好的 Git 环境。
- **本地变更**: 建议在本地已有代码变更和 `common/changes` 变更条目的情况下运行，以生成最完整的 PR 正文。

## 输入参数

| 参数             | 类型    | 是否必填 | 默认值                        | 描述                                                           |
| ---------------- | ------- | -------- | ----------------------------- | -------------------------------------------------------------- |
| `lang`           | string  | 否       | `zh`                          | PR 模板的语言 (`zh` 或 `en`)。                                 |
| `title`          | string  | 否       | (空)                          | 用于生成建议 PR 标题的素材。                                   |
| `head`           | string  | 否       | (空)                          | PR 的源分支名。如果为空，将自动推导当前分支。                |
| `labels`         | array   | 否       | `[]`                          | 附加到 PR 的标签，会体现在正文的元信息中。                     |
| `rushChangesDir` | string  | 否       | `common/changes`              | Rush 变更日志条目所在的目录。                                |
| `localBodyFile`  | boolean | 否       | `true`                        | 是否将生成的正文保存到本地文件。                             |
| `autotestReport` | string  | 否       | `.trae/output/autotest.report.local.md` | `auto-test` 技能生成的临时报告路径，其内容会被摘要进 PR 正文。 |

## 输出与成功标准

- **主要输出**:
    - `generated_title`: 推荐的 PR 标题。
    - `generated_body_preview`: 生成的完整 PR 正文的 Markdown 预览。
    - `generated_body_file`: 本地保存 PR 正文的文件路径（默认为 `.trae/output/pr.body.local.md`）。
- **成功标准**:
    - `body_generated`: PR 正文已成功生成并按需保存到本地文件。

## 执行步骤

1.  **选择模板**: 根据 `lang` 参数，Agent 会选择对应的 PR 模板文件（例如 `.github/PULL_REQUEST_TEMPLATE/pr_cn.md`）。
2.  **填充内容**: Agent 会自动执行以下填充操作：
    - **Changelog**: 解析 `{{rushChangesDir}}` 目录下的变更条目，并填充到正文的 Changelog 部分。
    - **自测项**: 如果 `autotestReport` 文件存在，会将其中的测试摘要信息填充到自测/走查部分。
    - **背景与方案**: 基于 `message` 参数（如果提供）和提交历史，生成简要的背景与方案描述。
    - **元信息**: 填充分支、标签等信息。
3.  **输出与保存**:
    - Agent 会生成一个建议的 PR 标题。
    - 将完整的 PR 正文以 Markdown 预览形式展示。
    - 如果 `localBodyFile` 为 `true`，会将纯净的 Markdown 正文内容保存到 `.trae/output/pr.body.local.md` 文件中，以便后续步骤使用或人工修改。

## 何时使用 / 边界

- **使用时机**:
    - 在提交代码并生成变更日志之后，创建 PR 之前，用于准备 PR 的描述内容。
    - 作为 `auto-flow` 工作流的一部分，在 `commit-smart` 步骤之后自动调用。
- **边界**:
    - 此技能只生成 PR 正文，不会创建 PR。创建 PR 是 `pr-create-from-body` 技能的职责。
    - 生成内容的丰富程度依赖于前序步骤的产出（如 `changelog` 和 `auto-test` 报告）。
