# StatPlots countPlot 原始分类观测重构计划

**Goal:** 每条输入代表一个分类观测，内部计数，并明确比例分母。

**Architecture:** count/aggregation.ts 在编译时按 category / series 聚合；compile 复用原生 bar。校验不预计算计数。

**Tech Stack:** TypeScript、Map、VChart bar、生成式 Schema、Jest、Playwright；Node.js 22。

全局约束与最终验收采用 [总计划](2026-10-09-statplots-raw-input-roadmap.md)。本子项目可独立交付。

## 1. 公共契约

```ts
interface CountPlotRow { category: string; series?: string }
// CountPlotSpec 保留 BaseSpec 与 fieldLabels。
interface CountPlotSpec {
  type: 'countPlot';
  data: CountPlotRow[];
  statistic?: 'count' | 'proportion'; // 默认 count
  normalizationScope?: 'all' | 'series'; // 默认 all；仅 proportion 可配置
}
```

- category 沿用原有字符串取值契约，不增加未要求的排序 API。类别、系列按首次出现排序。
- 允许重复 category / series；删除输入 count，拒绝旧预汇总对象及未知字段。
- 有分组时，编译生成全表类别与系列的笛卡尔积，未出现的组合 count=0，便于统一显示比较。无分组只生成实际出现类别。
- all：count / 全表 N；series：count / 当前系列 N。图例过滤后保持原统计分母。
- statistic=count 时显式传 normalizationScope 返回 UNSUPPORTED_COMBINATION，避免无效配置。
- tooltip 保留 count；proportion 模式同时展示比例，标签明确为全表比例或系列内比例。生成的零计数不是原始观测。
- 空 data 返回空图，不生成虚构类别或除零比例。

采用全表比例默认值是有意的行为变更，与 [Seaborn countplot](https://seaborn.pydata.org/generated/seaborn.countplot.html) 的 proportion 含义一致；需要旧含义时显式选择 series。

## 2. 文件和接口

路径相对 packages/vchart-statplots：

- 新增 src/plots/count/aggregation.ts：`aggregateCounts(spec: CountPlotSpec): CountResultRow[]`。
- 私有 `CountResultRow = { category: string; series?: string; count: number; proportion: number }`；计算输出固定包含两种数值，compile 按 statistic 选用。
- 修改 src/plots/count/types.ts、validate.ts、compile.ts；复用 checkSeries，不再 checkUnique / checkCount 原始行。
- 新增 __tests__/unit/count.test.ts 与 __tests__/browser/count.spec.ts。
- 迁移总计划同步清单中 countPlot 的所有 Schema、示例、测试、文档及性能数据。

## 3. 执行步骤

- [ ] 新增失败的数学用例：输入 X:[A,A,A,B]、Y:[A,B]，期望 count 为 [3,1,1,1]；all 比例为 [3/6,1/6,1/6,1/6]，series 为 [3/4,1/4,1/2,1/2]。
- [ ] 新增 X 仅有 A、Y 仅有 B 的反例，期望输出四个组合，缺失组合恰为 0；重复样本必须参与计数。
- [ ] 在变更源码前运行 `npm test --prefix packages/vchart-statplots -- --runInBand count.test.ts`，确认原实现因原始输入不含 count 而失败。
- [ ] 修改输入和校验，重新生成 Schema；新增聚合，compile 只消费私有结果。计数采用分层 Map，不用字符串拼接组合键。

核心计算必须等价于：

```ts
const denominator = spec.normalizationScope === 'series'
  ? seriesTotals.get(series)!
  : spec.data.length;
const proportion = count / denominator;
```

- [ ] 覆盖数组和行对象冻结、空数据、未知 count、混合 series、比例配置与计数模式冲突；整体和各系列比例分别求和为 1。
- [ ] 迁移示例；新增 unequal-group-sizes 和 missing-category 变体并登记。用实际分类观测编写示例，不批量展开旧 count。
- [ ] 浏览器断言柱高、轴标题、hover 的 count/proportion、零组合；点击图例检查图元过滤但比例不重算。修改一条分类后同实例柱高改变；resize 值不变。
- [ ] 运行定向测试、五轮重复浏览器测试和总计划的完整验收；性能复杂度为 O(N + C×S)，单系列为 O(N+C)。记录高基数类别输出规模。
- [ ] 审阅差异，形成独立可提交变更；提交仅在用户要求提交时执行。

完成标准：最小 spec 仅需 type / 原始 data，计数正确，比例范围显式，生成数据和真实柱高一致，旧契约迁移说明完整。
