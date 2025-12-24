---
job: unit-test-autogen
intent: generate-unit-tests-from-diff
version: v1
domain: testing
runner: trae-solo
parameters:
  sinceBranch: develop
  project: auto
  mode: full
  noSnapshot: false
  onlyNew: false
  reportFormat: md
  applyManualOverrides: true
  replaceAutogen: true
  dryRun: false
  preview: false
  stopOnError: true
  focusChangedOnly: false
  snapshotStrategy: combined
  tempReportPath: .trae/jobs/autotest.report.local.md
  mockDefaults:
    time: fixed(2020-01-01T00:00:00Z)
    random: seed(42)
constraints:
  framework: jest-ts-jest
  layout: __tests__/*.test.ts
  comments: function-level-jsdoc
outputs:
  - test_files
  - snapshots
  - coverage_report
  - manual_nodes
  - temp_markdown_report
success_criteria:
  - tests_generated_for_changed_exports
  - compile_without_errors
  - coverage_increase_or_maintained
manual_overrides: []
---

# Autotest Job（差异驱动单元测试自动生成）

## 步骤

1. 差异采集

- 运行 `git fetch --all --prune`
- 运行 `git diff --name-status --diff-filter=AMR {{sinceBranch}}...HEAD`
- 对每个变更文件，运行 `git diff --unified=0 {{sinceBranch}}...HEAD <file>` 获取行级差异

2. 影响分析

- 识别导出符号、类型签名与逻辑分支；在包内搜索已有 `__tests__` 及缺口

3. 测试生成

- 在 `__tests__` 下创建或更新 `.test.ts` 文件；为每个 `describe/it` 添加函数级注释（JSDoc，说明目的、前置/输入、断言点）
- 策略：
  - 纯函数/工具：正常/边界/异常分支
  - 主题 JSON：`toMatchSnapshot()` + 关键字段断言（颜色、字体、间距）
  - 转换器：代表性输入，断言输出结构与关键键值；必要时增量快照
- Mock/Spy：固定时间与随机数；隔离外部依赖（网络/FS）
- 自动化区块命名规则：
  - `describe('autogen:<pkg>/<module>:<export>:<hash>')`
  - `it('autogen:<case>:<hash>')`

4. 放置与命名

- `src/foo.ts` → `__tests__/foo.test.ts`；若已有则增量插入新的自动化区块
- 导入路径优先使用公开 API（例如 `src/index.ts`）

5. 执行与覆盖率

- 若指定 `project`：`rush run -p {{project}} -s test` 与 `test-cov`
- 未指定则按变更包批量执行上述命令

6. 诊断与报告

- TypeScript 诊断：收集编译错误并在报告中标注阻断项
- 报告输出（`{{reportFormat}}`）：列出变更文件 → 新增/更新测试 → 通过/失败 → 覆盖率增量 → 人工节点清单
- 临时报告写入：将本次执行结果以 Markdown 形式写入 `{{tempReportPath}}`

  - 必含内容：
    - 变更摘要（文件列表与关键行级片段定位）
    - 新增/更新测试用例与断言点说明
    - 运行结果（套件/用例通过统计、覆盖率摘要、TS 诊断）
    - 重点一致性问题与潜在错误点（类型/注释一致性、契约风险、默认值依赖、测试桩稳定性）
    - 建议与后续动作（文档补充、契约确认、健壮性增强）
  - 示例结构：

    ```md
    # Autotest 临时报告

    ## 变更摘要

    ## 行级差异（关键片段）

    ## 新增/更新的测试

    ## 运行结果

    ## 一致性与潜在风险（重点）

    ## 建议与后续动作
    ```

7. 人工节点与二次执行

- 初次生成时对不明确 Mock/快照的用例插入占位并标记：`it('autogen:MANUAL_REQUIRED:<reason>')` 与 `test.skip(...)`
- 二次执行流程：
  - 在本文件 `manual_overrides` 段中添加结构化覆写策略（见下例）或直接编辑测试文件中的占位并移除 `skip`
  - 默认不覆盖人工命名块（不含 `autogen:` 前缀）；仅增量生成缺失的自动化区块
  - 若 `replaceAutogen=true`，允许替换已有 `autogen:` 区块

## manual_overrides 示例

```yaml
manual_overrides:
  - target: packages/vchart-theme/src/foo.ts#exportedFn
    mocks:
      date: fixed(2020-01-01T00:00:00Z)
      random: seed(42)
      external: "jest.mock('@pkg/bar', () => ({ /* ... */ }))"
    inputs:
      - { args: [1, 2], desc: '正常路径' }
      - { args: [null], desc: '异常路径' }
    asserts:
      - { expect: 'toEqual', value: { ok: true } }
```

## 执行（Solo 模式）

- 最简用法（使用默认参数）：在聊天中发起“执行 Autotest Job（.trae/jobs/autotest.md）”。
- 可选覆盖参数示例：`project=@visactor/vchart-theme`、`reportFormat=json`、`replaceAutogen=true`。
- 我将按上述步骤顺序执行，并返回报告与人工节点处理结果。
- 临时报告路径可通过 `tempReportPath` 覆盖，默认：`.trae/jobs/autotest.report.local.md`。
