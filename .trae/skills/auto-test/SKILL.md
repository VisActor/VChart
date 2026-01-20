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
    - `temp_markdown_report`: 本地生成的 Markdown 格式临时报告，其路径通常与 `tempReportPath` 一致（默认 `./.trae/output/autotest.report.local.md`）。**无论本次是否实际生成了新的测试用例，此报告都会写入，用于解释执行结果。**
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
    - 将所有变更、测试生成情况、运行结果、覆盖率变化及潜在风险点汇总成一份报告，并保存到 `{{tempReportPath}}`（默认 `./.trae/output/autotest.report.local.md`）。
    - 报告结构至少包含：变更摘要、新增/更新测试列表、运行结果、覆盖率摘要（整体与关键文件）、覆盖率变化，以及风险与改进建议等板块。
    - **当本次执行没有生成任何新的自动化测试时，报告中必须包含一个明确的“无新增自动化测试 (No new tests generated)”小节，说明原因（例如仅文档变更、仅样式调整或变更被过滤等）以及当前测试覆盖情况。**

## 命令示例（本地等价操作）

如果需要在不依赖技能的情况下手动完成一次最小化的测试与覆盖率检查，可以在 VChart 仓库根目录执行：

```bash
# 1. 运行单元测试
rush run -p <project> -s test

# 2. 运行覆盖率
rush run -p <project> -s test-cov

# 3. 将结果整理成临时报告（与 Skill 输出路径保持一致）
mkdir -p ./.trae/output
cat > ./.trae/output/autotest.report.local.md << 'EOF'
# Auto Test Report

## Summary
- Project: <project>
- Base: develop

## Test Result
- Test Suites: ...
- Tests: ...

## Coverage Summary
- Lines: ...
- Statements: ...
- Functions: ...
- Branches: ...

## Notes
- No new tests generated
EOF
```

> 实际技能会根据差异自动生成/更新测试文件，并将完整报告写入 `tempReportPath`（默认 `./.trae/output/autotest.report.local.md`），包括“无新增自动化测试 (No new tests generated)” 小节。

## 覆盖率提升建议

在阅读 auto-test 报告中的覆盖率摘要时，如果发现新增或关键文件的覆盖率偏低，可以优先考虑补充如下类型的用例：

- **边界场景**：空数据、单元素、大量数据、极端配置等；
- **错误与异常路径**：非法参数、抛错分支、网络/IO 失败等；
- **组合与分支**：不同配置组合、开关量 on/off、不同枚举值；
- **回滚与降级逻辑**：fallback 分支、默认值逻辑；
- **与外部依赖的交互**：mock 出第三方服务异常、超时或返回空结果。

你可以在补充这些用例后再次执行 `auto-test`，观察报告中覆盖率摘要与“风险与建议”板块是否有所改善。

## 何时使用 / 边界

- **使用时机**:
    - 在完成一部分代码开发后，需要快速验证变更的正确性并补充单元测试时。
    - 在准备提交代码前，确保所有改动都被测试覆盖。
    - 作为持续集成流程的一部分，用于自动化回归测试。
- **边界**:
    - 此技能专注于单元测试，无法替代集成测试或端到端测试。
    - 对于复杂的业务逻辑或需要精细 Mock 的场景，生成的测试用例可能需要人工调整。
