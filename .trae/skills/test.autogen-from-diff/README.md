## 概述

- 技能：test.autogen-from-diff（根据差异自动生成/增量更新单测）
- 作用：识别导出符号与分支，生成 **tests**/\*.test.ts（含函数级 JSDoc 注释），执行覆盖率与报告

## 参数

- project（string，默认 auto）：自动识别变更包或指定包名
- mode（enum: full，默认 full）
- noSnapshot/onlyNew/applyManualOverrides/replaceAutogen/dryRun/preview/stopOnError/focusChangedOnly/snapshotStrategy/tempReportPath

## 输出

- test_files、snapshots、coverage_report、manual_nodes、temp_markdown_report（默认写入 ./.trae/output/autotest.report.local.md）

## 成功标准

- tests_generated_for_changed_exports、compile_without_errors、coverage_increase_or_maintained

## 失败案例与指引

- 编译/类型错误：修复 TS 诊断后重试；报告中会标注阻断项
- rush/jest 不可用：改用 npm/yarn 脚本或安装 rush；参数 preview/dryRun 可用于生成但不执行
- 快照不稳定：使用固定时间与随机数的 mock；必要时增量快照策略

## 示例调用

- skill: test.autogen-from-diff { project: '@visactor/vchart', onlyNew: false }

## 失败返回示例

- TypeScript 编译错误：
  - 返回：`TSxxxx: ...`
- rush 不可用：
  - 返回：`rush: command not found`
- 覆盖率任务失败：
  - 返回：jest 失败摘要与非零退出

## 修复步骤

- 修复 TS 诊断与依赖，再重试；必要时启用 `dryRun: true` 仅生成测试不执行
- 安装或改用 npm/yarn 脚本运行测试；确保 `package.json` 有对应脚本
- 快照问题：固定时间/随机数 mock，必要时调整 `snapshotStrategy`
