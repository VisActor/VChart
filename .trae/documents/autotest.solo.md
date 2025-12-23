# Autotest（差异驱动单元测试生成）Solo 使用说明

- 入口文件：`./.trae/jobs/autotest.md`
- 作用：根据 `develop...HEAD` 的代码差异，自动生成/更新测试用例与快照，并运行覆盖率与报告

## 参数
- `sinceBranch`：默认 `develop`
- `project`：默认 `auto`（自动识别变更包）；可指定如 `@visactor/vchart`
- `mode`：`full`（默认）
- `noSnapshot`：是否跳过快照，默认 `false`
- `onlyNew`：仅生成新的自动化区块，默认 `false`
- `reportFormat`：`md|json`，默认 `md`
- `applyManualOverrides`：应用人工覆写，默认 `true`
- `replaceAutogen`：允许替换已有 `autogen:` 块，默认 `false`
- `dryRun`：仅预览不写文件，默认 `false`
- `preview`：是否预览模式，默认 `false`
- `stopOnError`：遇错停止，默认 `true`
- `focusChangedOnly`：仅聚焦变更，默认 `true`
- `snapshotStrategy`：`combined`（默认）
- `tempReportPath`：默认 `./.trae/jobs/autotest.report.local.md`
- `mockDefaults`：默认 `time=fixed(2020-01-01T00:00:00Z)`、`random=seed(42)`

## 使用（Solo）
- 最简：在聊天中发起“执行 Autotest Job（.trae/jobs/autotest.md）”
- 指定包：`project: '@visactor/vchart'`
- 指定输出格式：`reportFormat: 'json'`

## 输出
- `test_files`：新增/更新的 `.test.ts`
- `snapshots`：快照文件
- `coverage_report`：覆盖率摘要
- `manual_nodes`：需人工处理的用例占位
- `temp_markdown_report`：临时报告（默认写入 `./.trae/jobs/autotest.report.local.md`）

## 成功标准
- `tests_generated_for_changed_exports`
- `compile_without_errors`
- `coverage_increase_or_maintained`

## 人工覆写示例
```yaml
manual_overrides:
  - target: packages/vchart/src/util/color.ts#parseColor
    mocks:
      date: fixed(2020-01-01T00:00:00Z)
      random: seed(42)
    inputs:
      - { args: ['#ff0000'], desc: '基本路径' }
      - { args: ['invalid'], desc: '异常路径' }
    asserts:
      - { expect: 'toEqual', value: { r: 255, g: 0, b: 0 } }
```

## 运行与诊断
- 我会自动执行 `rush run -p <project> -s test` 与 `test-cov`
- TypeScript 诊断与覆盖率结果会写入临时报告以便复核

## 注意事项
- 若差异范围为空，建议指定 `project` 以运行目标包测试
- 对低覆盖模块，建议补充手动测试并复跑 Autotest 以提升覆盖率
