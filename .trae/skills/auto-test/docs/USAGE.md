# 使用说明：auto-test

本技能根据代码增量自动生成单元测试，确保变更得到充分验证。

## 何时使用

- **编码后**: 开发了新功能或修复了缺陷后，运行此技能可快速为你的变更生成测试用例。
- **提交前**: 在 `git commit` 之前，使用此技能确保所有改动都已被测试覆盖，满足合入标准。
- **CI/CD**: 可作为自动化流水线的一环，对每次提交进行回归测试。

## 示例对话

**场景一：对所有变更运行测试**

> **你**: “帮我运行 `auto-test`，检查下我最近的改动。”
>
> **Agent**: (执行技能) “测试已完成，报告位于 `./.trae/output/autotest.report.local.md`。新增测试 `X` 个，覆盖率提升 `Y%`。请查阅报告确认。”

**场景二：仅测试特定包**

> **你**: “为 `@visactor/vchart` 项目执行 `auto-test`。”
>
> **Agent**: (将测试范围限定在指定包内执行) “已完成对 `@visactor/vchart` 的测试。报告已生成。”

## 关键参数

- `sinceBranch`: 定义进行比较的基准分支，默认为 `develop`。
- `project`: 指定要测试的 Rush 项目。`auto` 会自动识别变更影响的包；你也可以明确指定，如 `'@visactor/vchart'`。
- `reportFormat`: 输出报告的格式，支持 `md` (默认) 和 `json`。
- `tempReportPath`: 测试报告的本地输出路径，默认为 `./.trae/output/autotest.report.local.md`。

## 注意事项

- **此技能专注于单元测试，不能完全替代集成测试或端到端测试。**
- 自动生成的测试可能需要人工干预，特别是在涉及复杂模拟(Mock)或特定业务逻辑的场景中。
- 执行前请确保 `rush` 依赖已正确安装。
- 每次执行都会在 `tempReportPath`（默认 `./.trae/output/autotest.report.local.md`）写入一份临时报告；**即使没有生成新的测试用例，也会包含“无新增自动化测试 (No new tests generated)”说明小节，解释原因与执行结果。**

## 故障排查

- **依赖缺失**: 在根目录执行 `rush install`；必要时运行 `pnpm -v` 确认 pnpm 可用
- **测试执行失败**: 针对项目执行 `rush run -p <project> -s test`；查看错误日志并在 `__tests__` 中补充/修复用例
- **覆盖率报告为空**: 确认测试命令包含覆盖率脚本（如 `test-cov`）；手动执行 `rush run -p <project> -s test-cov`
- **报告未写出**: 检查输出目录存在 `mkdir -p ./.trae/output`；确认 `tempReportPath` 配置正确

## 命令示例（本地运行）

```bash
# 在 VChart 仓库根目录，针对某个 Rush 项目运行测试与覆盖率
rush run -p <project> -s test
rush run -p <project> -s test-cov
```

> 如需与技能保持一致，可以在测试完成后，把关键信息手动整理到 `./.trae/output/autotest.report.local.md` 中；技能会自动在相同路径生成报告。

## 覆盖率提升建议

- 优先补充边界场景（空数据、极大/极小值等）；
- 补足错误/异常路径（无效参数、抛错分支）；
- 覆盖重要配置组合和分支选择；
- 针对关键函数或模块查看报告中的覆盖率摘要，优先拉高这些热点文件的覆盖率。
