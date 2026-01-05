---
name: auto-flow
description: 'Orchestrates a complete, standardized workflow for preparing a pull request in the VChart project. Use this skill to run a sequence of tasks: automated testing, changelog generation, smart commit, PR body creation, and PR submission. It provides a fixed 5-step process with manual checkpoints, ensuring quality and consistency for every contribution.'
---

# PR 准备全流程编排 (auto-flow)

## 概述

本技能是一个固定的五步编排工作流，旨在自动化 `VChart` 项目从代码变更到创建 Pull Request 的整个准备过程。它将一系列独立的子技能（测试、变更日志、提交、PR 内容生成、PR 创建）串联成一个连贯的、带有人工检查点的流程。

## 前置条件

- **环境**: 必须在配置了 Rush、Git 的有效工作区中执行。
- **依赖与凭证**: 所有被编排的子技能所需的前置条件都必须满足，特别是 `pr-create-from-body` 技能需要的 `GITHUB_TOKEN` 或 `gh` CLI。

## 输入参数

本技能的流程是固定的，不通过参数选择执行步骤。它会按顺序执行所有五个步骤。

| 参数          | 类型    | 是否必填 | 默认值       | 描述                                                                 |
| ------------- | ------- | -------- | ------------ | -------------------------------------------------------------------- |
| `baseBranch`  | string  | 否       | `develop`    | 整个流程所围绕的基准分支，用于差异计算和 PR 目标。                     |
| `topic`       | string  | 否       | (空)         | 用于优化 PR 标题的可选主题。                                         |
| `message`     | string  | 否       | (空)         | 用于 `changelog` 和 `commit` 的自定义消息。                            |
| `bumpType`    | string  | 否       | `auto`       | Rush 变更日志的版本升级类型。                                      |
| `head`        | string  | 否       | (空)         | 当前开发分支。如果为空，将自动推导。                                 |
| `labels`      | array   | 否       | `[changelog, test]` | 附加到最终 PR 的标签。                                               |

## 输出与成功标准

- **主要输出**:
    - `autotest_report`: 单元测试报告文件路径。
    - `rush_change_entries`: 生成的 Rush 变更条目列表。
    - `commit_message`: 创建的提交信息。
    - `pr_url`: 最终创建的 Pull Request 链接。
- **成功标准**:
    - `flow_step_completed`: 流程中的每一步或整个流程已成功完成。

## 执行步骤

本技能按固定顺序依次执行以下子技能，并在每一步之间设置人工检查点：

1.  **差异驱动单测**
    - **执行**: `auto-test` 技能。
    - **目的**: 为代码变更生成并运行单元测试。
    - **检查点**: Agent 会返回测试报告路径。**你需要检查报告中的测试覆盖率和结果，确认无误后指示 Agent 继续。**

2.  **生成 Rush 变更日志**
    - **执行**: `changelog-rush-smart` 技能。
    - **目的**: 根据提交历史创建 `common/changes/**` 下的变更条目。
    - **检查点**: Agent 会提示已生成变更条目。**你需要检查这些文件的内容是否准确反映了你的变更，然后指示 Agent 继续。**

3.  **智能提交**
    - **执行**: `commit-smart` 技能。
    - **目的**: 将所有变更（代码、测试、changelog 文件）创建一个符合规范的 Git 提交并推送到远程。
    - **检查点**: Agent 会返回生成的提交信息和推送结果。**你需要确认提交信息是正确的，然后指示 Agent 继续。**

4.  **生成 PR 正文**
    - **执行**: `pr-body-generate` 技能。
    - **目的**: 自动填充 PR 模板，生成包含所有上下文信息的 PR 正文。
    - **检查点**: Agent 会返回生成的 PR 正文预览和本地文件路径。**你应审阅正文内容，确保其完整和准确（可在此步之后手动修改文件），然后指示 Agent 继续。**

5.  **创建 PR**
    - **执行**: `pr-create-from-body` 技能。
    - **目的**: 使用上一步生成的正文文件，在 GitHub 上创建 Pull Request。
    - **检查点**: Agent 会返回最终的 PR 链接。**你需要访问链接确认 PR 是否按预期创建。**

## 何时使用 / 边界

- **使用时机**:
    - 当你完成一个功能或修复，准备发起一个完整的、高质量的 Pull Request 时，这是推荐的标准化流程。
    - 特别适用于发布前准备工作，确保所有检查项（测试、changelog）都已完成。
- **边界**:
    - 此技能是一个编排层，它不执行实际工作，而是调用其他技能。因此，它的成功依赖于所有子技能的正确配置和执行。
    - 流程中的任何一步失败，整个流程都会中断，并报告失败的步骤和原因。

## 使用示例

> **你**: “启动 `auto-flow` 流程，为我的新功能做发布准备。”
>
> **Agent**: *(执行 `auto-test`)* “第一步：测试已完成，报告位于 `.../autotest.report.local.md`。请检查后告诉我是否继续。”
>
> **你**: *(检查报告后)* “继续。”
>
> **Agent**: *(执行 `changelog-rush-smart`)* “第二步：变更日志已生成。请检查 `common/changes/` 目录。确认无误后，请告诉我是否继续。”
>
> **你**: “继续。”
>
> **Agent**: *(继续执行后续步骤，并在每一步后请求确认)*
