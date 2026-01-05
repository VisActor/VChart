---
name: auto-test
description: 'Automates unit testing for incremental code changes in the VChart project. Use this skill to automatically generate and run tests for your modifications against a base branch (default: develop). It identifies changes, creates/updates Jest test cases and snapshots, and provides a coverage report. This skill requires a functional Rush and Git environment.'
---

# 差异驱动的单元测试 (auto-test)

## 概述

本技能用于对 `VChart` 项目中指定基准分支与当前 `HEAD` 之间的代码差异，自动生成、更新和执行单元测试。它能够处理已提交和未提交的变更，并生成一份详细的测试报告。

## 前置条件

- **环境**: 必须在配置了 Rush 和 Git 的有效工作区中执行。
- **GitHub 凭证 (可选)**: 某些高级功能可能需要有效的 `GITHUB_TOKEN` 或已登录的 `gh` CLI。

## 输入参数

| 参数                 | 类型    | 默认值                            | 描述                                                       |
| -------------------- | ------- | --------------------------------- | ---------------------------------------------------------- |
| `sinceBranch`        | string  | `develop`                         | 用于差异计算的基准分支。                                   |
| `project`            | string  | `auto`                            | 要测试的 Rush 项目，`auto` 表示自动识别变更所属的项目。      |
| `mode`               | string  | `full`                            | 测试模式。                                                 |
| `noSnapshot`         | boolean | `false`                           | 是否跳过快照测试。                                         |
| `reportFormat`       | string  | `md`                              | 生成报告的格式 (`md` 或 `json`)。                          |
| `tempReportPath`     | string  | `.trae/output/autotest.report.local.md` | 临时报告的输出路径。                                       |
| `replaceAutogen`     | boolean | `false`                           | 是否允许替换已有的 `autogen:` 测试块。                     |
| `includeWorkingTree` | boolean | `true`                            | 是否包含工作树（未提交的）的变更。                         |

## 输出与成功标准

- **主要输出**:
    - `test_files`: 生成或更新的测试文件列表。
    - `snapshots`: 生成或更新的快照文件。
    - `coverage_report`: 覆盖率报告摘要。
    - `manual_nodes`: 提示需要人工介入的测试点。
    - `temp_markdown_report`: 本地生成的 Markdown 格式临时报告。
- **成功标准**:
    - `tests_generated_for_changed_exports`: 已为所有变更的导出项生成测试。
    - `compile_without_errors`: 生成的测试代码编译无误。
    - `coverage_increase_or_maintained`: 代码覆盖率持平或有所提升。

## 执行步骤

1.  **差异采集**: Agent 会使用 `git diff` 和 `git status` 命令，识别出从 `{{sinceBranch}}` 到当前 `HEAD` 的所有已提交和未提交的文件与代码行级变更。
2.  **影响分析**: 分析变更内容，识别出哪些导出函数、类型或逻辑分支受到了影响，并检查 `__tests__` 目录下是否存在对应的测试缺口。
3.  **测试生成**:
    - 在受影响模块的 `__tests__` 目录下创建或更新测试文件 (`*.test.ts`)。
    - 为纯函数、UI 组件、工具函数等生成不同策略的测试用例，并附带说明性注释。
    - 对不确定的 Mock 或断言，会生成带 `test.skip` 和 `MANUAL_REQUIRED` 标记的占位符。
4.  **执行与覆盖率分析**:
    - 根据 `project` 参数，运行 `rush run test` 和 `rush run test-cov` 命令。
    - 收集测试结果和覆盖率数据。
5.  **报告生成**:
    - 将所有变更、测试生成情况、运行结果、覆盖率变化及潜在风险点汇总成一份报告，并保存到 `{{tempReportPath}}`。

## 何时使用 / 边界

- **使用时机**:
    - 在完成一部分代码开发后，需要快速验证变更的正确性并补充单元测试时。
    - 在准备提交代码前，确保所有改动都被测试覆盖。
    - 作为持续集成流程的一部分，用于自动化回归测试。
- **边界**:
    - 此技能专注于单元测试，无法替代集成测试或端到端测试。
    - 对于复杂的业务逻辑或需要精细 Mock 的场景，生成的测试用例可能需要人工调整。
