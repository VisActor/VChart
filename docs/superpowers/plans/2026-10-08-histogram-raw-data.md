# histogram 原始样本输入重构计划

> **For agentic workers:** 在当前会话按任务顺序实施并复核，使用复选框记录进度；未经用户要求不启动子代理。用户已授权执行本计划；不自动提交或推送。

**Goal:** 用户提交一个连续变量的原始观测，库完成确定性分箱、计数和显示归一化，绘制单分布直方图。

**Architecture:** `原始 Spec → Schema 与数值边界校验 → 等宽边界与计数 → statistic 换算 → 原生 bar 与连续轴`。参考 hexbinPlot 的原始输入、编译阶段计算及严格协议；继续复用原生图表生命周期，不新增系列或实例包装器。把工作区 pairPlot 重构中已实现的域、边界和查箱几何抽为内部共用函数，分组职责不进入独立 histogram。

**Tech Stack:** Node.js 22、TypeScript 4.9.5、VChart 原生 bar/linear axis/tooltip、现有 TypeScript→Schema→Ajv 生成链、Jest、Playwright；不新增运行依赖。

## 全局约束

- 文档优先中文；计划不预设修改 VChart 核心。执行时实际复现了显式轴域更新错误，按下方执行补充修复标准路径。
- 公共输入仅为 `{ value: number }[]`，不提供 series、id、weight、count 或预计算箱边界；旧协议直接拒绝，不做输入猜测或双模式兼容。
- 保留 statistic=count/proportion/density、fieldLabels、theme、colors、title、description；单系列不显示图例。
- 本期只支持等宽分箱数量，不增加显式 edges、范围裁剪、算法枚举、KDE 叠加、横向直方图、累计分布、堆积或并列多组分布。
- 原始样本不排序、不修改、不去重；重复值各计一次。非法数值在公共边界报错，不静默删除，不在 render/hover 中补统计计算。
- 空箱必须保留；空样本与零频次区间区分。hexbinPlot 只输出非空箱的规则不照搬到连续区间直方图。
- 修改 data/binCount/statistic 后重新 compileStatPlot 并调用原生 updateSpec；resize/hover 不分箱，同样数据的主题/配色重编译不改变统计结果。不引入缓存失效体系。
- 当前工作区的 `2026-10-08-pair-plot-diagonal.md` 是另一份计划，本轮不修改它。撰写期间已观察到其原始观测重构代码出现，尚不据此宣称该重构已通过验收。
- 执行时先确认 pairPlot 的实际实现状态，按第 3 节抽取现有几何工具；其他图表公共输入不得随本计划改变。
- 新增回归按显式清单登记，完成稳定性与反例检查；独立新增用例不填写 BugServer case IDs。
- 若实际修改核心渲染/布局路径，运行相关官方视觉目录；每次提交 PR 前运行官方 develop 全量基线比较，self-compare 和 StatPlots Playwright 不替代它。

## 1. 方案选择与多系列边界

| 方案                      | 收益                                           | 代价                                         | 本轮决定             |
| ------------------------- | ---------------------------------------------- | -------------------------------------------- | -------------------- |
| 单分布原始样本 + binCount | 输入短，职责明确，和 hexbinPlot 的计算边界一致 | 暂不支持组间叠加比较                         | 推荐                 |
| 原始样本 + series         | 可以比较实验/对照等多组分布                    | 必须明确共享边界、重叠/并排/堆积和归一化分母 | 没有本轮需求，不保留 |
| 原始/预计算双输入模式     | 继续接收既有统计结果                           | 两套校验、计算及迁移路径长期并存             | 不采用               |

多组直方图有实际用途，但它是额外产品能力，不能因为旧 HistogramRow 继承 SeriesRow 就自动保留。Matplotlib 的 hist 支持多个数据集及并排/堆积等表现，见[官方文档](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.hist.html)。本次目标是便捷绘制一个变量的分布，因此移除 series。pairPlot 的组间比较属于其现有协议，不受这一决定影响。

## 2. 公共协议与统计规则

```json
{
  "type": "histogram",
  "binning": { "binCount": 20 },
  "statistic": "count",
  "data": [{ "value": 0.1 }, { "value": 0.4 }, { "value": 1.2 }]
}
```

最小配置只需要 type/data。保留对象行而不改成 number[]，是为了延续 StatPlots 固定语义字段的 Row[] 契约；一个数字只表示 value，不是计数或箱边界。

```ts
export interface HistogramRow {
  value: number;
}
export interface HistogramBinningSpec {
  /** 非恒定数据的等宽箱数；省略时按样本量选择。
   * @TJS-type integer
   * @minimum 1
   * @maximum 200
   */
  binCount?: number;
}
export interface HistogramSpec extends BaseSpec {
  type: 'histogram';
  data: HistogramRow[];
  binning?: HistogramBinningSpec;
  statistic?: 'count' | 'proportion' | 'density';
  fieldLabels?: { value?: string; count?: string; proportion?: string; density?: string };
}
```

### 箱数与范围

- binning/binCount 可省略。非恒定且 N>0 时默认 `min(200, ceil(log2(N) + 1))`，即 Sturges 候选数；显式 binCount 为 1–200 的整数，不四舍五入、不钳制。
- 自动箱数和工作区正在重构的 pairPlot 对角分布一致，避免同样原始变量在两处采用无理由不同的默认规则。参考 hexbinPlot 的接口组织和计算时机，不照搬二维格网的固定 xBins=30。
- Sturges 只依赖样本量，适合免排序、低成本初始展示；长尾、多峰或大样本可显式调 binCount。它不是 NumPy 的 bins='auto'，文档不能声称自动得到最佳箱数；公式及限制见[NumPy 官方文档](https://numpy.org/doc/stable/reference/generated/numpy.histogram_bin_edges.html)。
- 非恒定数据域为 [min,max]。边界来自同一数组：首尾直接使用 min/max，中间使用 `min + (max-min)*(i/k)`；每根柱两端引用相邻边界，不各自独立计算。
- 原始值有限，跨度及所有边界必须有限且递增。默认分箱遇到浮点重复边界时合并重复边界，实际箱数可能少于候选数；显式分箱不能兑现箱数时报 INVALID_RANGE `/binning/binCount`。
- 空数据返回 bins=[]、domain=[0,1]，保留现有空状态。显式 binCount 仍由 Schema 校验，但不生成伪造零柱。
- 单点或全部同值 c：一个箱，域为 `c ± max(1,abs(c))/2`，即使显式 binCount>1 也只输出一箱；说明该扩展只建立绘制空间，不表示观测存在变异。域不可表示时报 INVALID_RANGE `/data`。
- density 还要求每箱 `1 / (binEnd-binStart)` 有限，确保任意箱占比的密度高度可表示；不满足时返回 INVALID_RANGE `/data`，建议转换数值单位。count/proportion 不继承该额外限制。

### 归属、计数与统计量

- 每箱左闭右开 [start,end)，最后一箱包含 max；内部边界上的值归右箱。二分查同一边界数组，max 明确归最后箱，不以逐点 epsilon 移动观测。
- 每条观测恰好进入一箱，sum(count)=N，counts 为非负整数；输出完整箱序列，包括 count=0 的箱。
- count 高度为 count；proportion 为 count/N，其和为 1；density 为 `(count/N)/箱宽`，面积和为 1。密度先算比例，避免 N×width 中间乘积溢出。
- 不再按 series 求总量或过滤系列，不再校验调用方的计数、排序或不等宽箱。所有归一化基于这一个分布的 N。
- 全部原始 value=0 表示 N 条相同观测，不是零总量，应输出一个 count=N 的箱。此前 count 全零输入丢失问题通过删除该输入契约与总量过滤路径消除；内部 count=0 的箱继续保留。
- 输入逆序/固定乱序产生相同边界及计数；生成数组/对象数量随箱数 B 增长，不能为每条观测构造新记录或反复 filter。

### 图形与提示

- 保留 commonChart + 原生 bar、xField=binStart、x2Field=binEnd、yField=height；stack=false，barMinWidth='0%' 关闭最小像素宽度，删除 seriesField 和条件图例，legends.visible=false。
- x 使用计算域、nice=false；y 从 0 开始。柱宽覆盖真实区间，零箱保留边界与统计信息；不靠 band 类目间距模拟连续箱宽。
- 保留 categorical 的首个颜色、现有主题边框和透明度，不改用 hexbin 的连续计数色标。
- fieldLabels.value 控制 x 轴及 tooltip 边界名称，例如“年龄下界”“年龄上界”；count 显示原始观测数，proportion/density 显示当前量。count 模式只出现一次计数项，不重复 count/height 的相同值。
- 文档说明区间闭合约定；tooltip 只消费已计算的 binStart/binEnd/count/height，不在 hover 中扫描样本。

## 3. 文件边界与 pairPlot 衔接

以下文件路径均相对 `packages/vchart-statplots/`。

| 文件                                                                                                                                  | 责任                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 修改 src/plots/histogram/types.ts、validate.ts、compile.ts                                                                            | 原始单变量协议、数值校验、分箱及原生 spec                                  |
| 新增 src/common/histogram.ts                                                                                                          | 从 pairPlot 抽取域/边界生成及查箱几何，不含 series、图表实例或公共配置注册 |
| 新增 src/plots/histogram/binning.ts                                                                                                   | 扫描 value 极值、单分布计数和结果对象                                      |
| 修改 src/plots/pair-plot/binning.ts                                                                                                   | 调用共用域、边界及查箱工具；保留其观测提取、null 策略和分组计数            |
| 生成 schema/plots/histogram.schema.json、schema/statplot.schema.json、src/generated/validate.js                                       | 通过 build:schema 生成，禁止手改                                           |
| 新增 unit/histogram-binning.test.ts、histogram.test.ts；修改 distributions.test.ts、field-labels.test.ts                              | 数学与协议、统计量、零箱、展示名回归                                       |
| 新增 fixtures/histogram.ts、browser/histogram.spec.ts；修改 first-phase.spec.ts、python-handoff.spec.ts                               | 真实柱几何、tooltip、更新、resize、Python 原始值交接                       |
| 迁移主例、minimal、invalid、density/proportion 变体；移除 grouped/histogram.json                                                      | 新协议及单系列范围；同步 examples/specs/index.json                         |
| 修改 README.md、docs/spec.md、computation-contract.md、plots/histogram.md、naming-migration.md、skill-authoring.md、plot-catalog.json | 输入、默认规则、分箱职责、迁移、选型及 skill 生成信息                      |
| 修改 examples/python/histogram.py；新增 coarse/fine/constant/zero-bin 示例                                                            | Python 仅序列化原始 value；可审阅配置及数据案例                            |
| 新增 benchmarks/histogram-results.json；修改 benchmarks/README.md                                                                     | 编译与生命周期实际测量，保留历史结果来源                                   |

测试路径完整前缀为 `__tests__/`；实际测试搜索还需覆盖 naming/schema/colors/theme/semantics 等通用消费者，不能只迁移列表中的直接引用。

共享内部接口不从 src/index.ts 或 src/types.ts 导出：

```ts
export interface HistogramExtent {
  sampleSize: number;
  min: number;
  max: number;
}
export interface HistogramEdges {
  domain: [number, number];
  edges: number[];
}
export function histogramDomain(extent: HistogramExtent): [number, number] | null;
// null 仅表示无法构建可表示边界；空输入返回 domain=[0,1], edges=[]。
export function makeHistogramEdges(extent: HistogramExtent, binCount?: number): HistogramEdges | null;
// 有效非空 edges，value 在覆盖域内；返回 [0, edges.length-2] 的唯一箱索引。
export function histogramBinIndex(value: number, edges: readonly number[]): number;

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
}
export interface HistogramResult extends HistogramEdges {
  sampleSize: number;
  bins: HistogramBin[];
}
export function collectHistogramExtent(data: readonly HistogramRow[]): HistogramExtent;
export function binHistogram(data: readonly HistogramRow[], binCount?: number): HistogramResult;
```

pairPlot 将单变量 extent 传入共用工具；数据提取、null 排除、series 计数留在 pairPlot。独立 histogram 不引用 pairPlot 实现，也不为复用引入 provider/抽象统计引擎。

校验只扫描极值、生成至多 201 个边界并检查数值范围，不进行计数；compile 只运行一次计数。为保持现有 validateStatPlot/compileStatPlot 分离，允许边界准备重复，不能把整套计数放进两条路径。

检查开始时 pairPlot/validate.ts 仍导入 validateHistogram 校验外部 bins；撰写期间工作区已改为原始观测并移除该依赖，新增 pair-plot/binning.ts 的 pairDomain、makePairEdges 及 upper-bound 查箱实现。以执行时复核后的代码为准，优先抽取这一现成实现，不另写等价算法。

把 pairDomain/makePairEdges 的几何逻辑移到 common/histogram.ts，pairPlot 内部名称可用导出别名保留，防止无意义地改动现有测试和调用方；把计数循环内的查箱逻辑换成共用 histogramBinIndex。保持 pairPlot 公共协议、分组、缺失和错误路径不变。无需新增旧 bins 校验器，也不能把 histogram 的单系列范围或 density 支持范围限制传到 pairPlot。

## 任务 1：分箱几何与单分布计数

**Files:** 新增 common/histogram.ts、plots/histogram/binning.ts、**tests**/unit/histogram-binning.test.ts、**tests**/fixtures/histogram.ts；修改 plots/pair-plot/binning.ts，复用既有 pair-binning.test.ts。

**接口：** 采用第 3 节精确签名。本任务不替换公共 HistogramRow；引擎参数可先使用 readonly {value:number}[]，在任务 2 收敛为新类型。

- [x] 写并运行失败测试，初始因缺少引擎失败。固定输入 [0,1,2,3,4]、binCount=2，edges=[0,2,4]，counts=[2,3]；2 归右箱，4 保留。
- [x] 从工作区 pairPlot 抽取 histogramDomain、makeHistogramEdges 和 histogramBinIndex，原调用方采用共用函数；实现 collectHistogramExtent 和 binHistogram。无样本排序；计数 O(N log B)，边界及输出 O(B)，额外空间 O(B)，B≤200。
- [x] 补空数据、单点、全部同值、负值、重复值、默认箱数、binCount=1/200，以及零频次区间。
- [x] 补冻结/逆序/固定乱序、有限边界、sum(count)=N、相邻箱共享同一端点的断言。
- [x] 锁定浮点反例：[1,1+Number.EPSILON] 自动合并成一箱，显式 binCount=2 不可表示；[-Number.MAX_VALUE,Number.MAX_VALUE] 跨度溢出；普通 1e12 常量可表示。

独立期望值测试代码：

```ts
import { binHistogram } from '../../src/plots/histogram/binning';
test('边界值归右箱，最大值保留，重复观测不去重', () => {
  const data = [0, 1, 2, 2, 3, 4].map(value => ({ value }));
  const result = binHistogram(data, 2);
  expect(result.edges).toEqual([0, 2, 4]);
  expect(result.bins.map(bin => bin.count)).toEqual([2, 4]);
  expect(binHistogram(data.slice().reverse(), 2)).toEqual(result);
});
test('保留区间中无观测的箱', () => {
  expect(binHistogram([{ value: 0 }, { value: 4 }], 4).bins.map(bin => bin.count)).toEqual([1, 0, 0, 1]);
});
```

**Run:** `npm test --prefix packages/vchart-statplots -- --runInBand histogram-binning.test.ts pair-binning.test.ts pair-plot.test.ts`。新功能从失败到通过，现有 pairPlot 用例持续通过，记录实际结果再进入下一任务。

## 任务 2：原子替换协议、校验、编译及旧依赖

**Files:** histogram/types.ts、validate.ts、compile.ts；Schema 生成物；新增 unit/histogram.test.ts，修改 distributions/field-labels；迁移既有 histogram JSON 及 Python 示例。

**接口：** 新 HistogramSpec → validateStatPlot 的明确 issue 路径；compileHistogram 消费 HistogramResult，输出 ICommonChartSpec。

- [x] 先写协议失败测试：{value} 接受；series/id/weight/count/binStart/binEnd、数值数组、null、字符串、非有限数值、未知字段拒绝。binCount 省略/1/200 接受，0/-1/小数/201 拒绝，路径为 /binning/binCount。
- [x] 确认 pairPlot 已不依赖公共 validateHistogram，运行其现有用例确保抽取工具后统计语义和错误路径保持有效。
- [x] 替换类型与语义校验。数值空间错误指 /data；显式箱数无法表示指 /binning/binCount。density 的单位宽度密度上限检查只在该模式执行。
- [x] 编译时分箱一次，移除 totals Map、seriesField、系列过滤与条件图例。使用共享边界及明确轴域，统计量按第 2 节换算。
- [x] tooltip count 模式不重复展示计数；density/proportion 保留原始 count，fieldLabels.value 实际进入区间边界名称。
- [x] 主例使用 data=[0,1,2,3,4]、binCount=2，先保持 count；minimal 不额外要求 binning；density/proportion 变体使用同批原始值。invalid 使用 binCount=0，更新清单预期错误。
- [x] 删除 grouped/histogram.json 及其清单项，不以伪造单组保留 grouped 标签。Python 直接输出原始 value 数组及 binCount/statistic。
- [x] 运行 build:schema、compile 和相关单测；本任务公共 Schema 改动仅为 HistogramRow/HistogramSpec/新增 HistogramBinningSpec。工作区 pairPlot 公共 Schema 的迁移属于并发的独立任务，本次抽取只改其内部几何调用。

统计量与原始零值回归：

```ts
import { compileStatPlot } from '../../src/compile';
const values = (spec: any) => (compileStatPlot(spec) as any).series[0].data.values;
test('比例与密度使用同一个样本总数，密度按实际箱宽换算', () => {
  const base = { type: 'histogram', binning: { binCount: 2 }, data: [0, 1, 2, 3, 4].map(value => ({ value })) };
  expect(values({ ...base, statistic: 'count' }).map((row: any) => row.height)).toEqual([2, 3]);
  expect(values({ ...base, statistic: 'proportion' }).map((row: any) => row.height)).toEqual([0.4, 0.6]);
  const density = values({ ...base, statistic: 'density' });
  expect(density.map((row: any) => row.height)).toEqual([0.2, 0.3]);
  expect(density.reduce((area: number, row: any) => area + row.height * (row.binEnd - row.binStart), 0)).toBeCloseTo(1);
});
test('原始零值是三条有效观测', () => {
  const result = values({ type: 'histogram', data: [{ value: 0 }, { value: 0 }, { value: 0 }] });
  expect(result).toHaveLength(1);
  expect(result[0].count).toBe(3);
});
```

**Run:** `npm run build:schema --prefix packages/vchart-statplots`；`npm run compile --prefix packages/vchart-statplots`；`npm test --prefix packages/vchart-statplots -- --runInBand histogram distributions field-labels fourth-phase`。

## 任务 3：浏览器行为、交接与可审阅示例

**Files:** 新增 browser/histogram.spec.ts；修改 first-phase.spec.ts、python-handoff.spec.ts；新增 specs/variants/histogram-coarse.json、histogram-fine.json、histogram-constant.json、histogram-zero-bin.json；修改 examples/specs/index.json、docs/plot-catalog.json 及必要的通用测试。

**接口：** 浏览器使用现有 renderStatPlot 和原生公开 series/mark/axis API；断言实际 graphics 与 tooltip、原实例 updateSpec，不只比较编译 JSON。

- [x] 主例两箱实际宽度相等，count 高度比 2:3；改写 first-phase 原先对不等宽箱 1:2 的断言，保留有效几何、resize、release 检查。
- [x] 新浏览器套件覆盖 count/proportion/density 的实际柱高与轴名，四箱中间零频次箱，以及原始全零值的一箱有效几何。零箱用数据和基线位置断言，不能要求零柱有正面积。
- [x] 真实移动指针进入柱子，验证边界、原始计数与显示量。由相同实例 updateSpec 把数据改为 [0,1,2,2,3,4]，期望 count=[2,4]，实际 hover 显示 4；随后修改 binCount=4，期望 [1,1,2,2]，检查真实柱宽与数量变化。
- [x] resize、主题与配色更新前后对比箱边界/计数保持一致；release 后 canvas 数为 0。主题与 categorical 配色的既有断言继续有效。
- [x] Python 交接测试先检查输出 {value} 而非 count，再检查前端计算及原实例更新。删除“浏览器已准备统计结果”的旧注释及不等宽箱预期。
- [x] 同批固定数据提供 coarse/fine 配置变体；constant/zero-bin 为数据案例，登记为 valid，不凭空新增配置。目录配置变体采用 binning 嵌套结构，沿用 hexbin 已支持的检查路径。
- [x] 新确定性用例至少连续五轮稳定；在独立副本分别注入去重、漏最大端点、内部边界归左、删除零箱、抑制 updateSpec/hover 等反例，证明断言能检出目标问题。恢复副本，记录失败与恢复后通过结果。
- [x] 审阅深浅主题、宽窄窗口、粗细分箱、单值和零箱截图，记录差异原因；不跳过错误，不降低阈值。

**Run:** `npm run build --prefix packages/vchart-statplots`；`npm run test:browser --prefix packages/vchart-statplots -- histogram.spec.ts first-phase.spec.ts python-handoff.spec.ts`。默认 Playwright 报告/截图保持在 `.vchart-statplots/`。

## 任务 4：契约文档、完整验证与性能

**Files:** 第 3 节列出的契约、目录、迁移及 skill 文档；新增 benchmarks/histogram-results.json，更新 benchmarks/README.md；在原 StatPlots 总计划对应 histogram 项补覆盖说明，历史验收结果保留原日期与上下文。

- [x] README/计算契约明确 histogram 与 hexbinPlot 都由本包分箱，移除“直方图分箱由调用方完成”。Python 交接重新说明原始观测如何直接输出 JSON。
- [x] spec/逐图文档写清单系列、自动箱数限制、显式整数范围、空/恒定处理、归属、零箱、密度面积及浮点支持范围。移除目录 avoidWhen 的“没有分箱结果”，改为“类别频数比较”“多组叠加分布比较”。
- [x] naming-migration 说明旧 binStart/binEnd/count/series 输入直接拒绝。聚合结果不能还原原始样本，不推荐重复展开 count 伪造观测；只有预分箱结果的调用方继续用 VChart 原生 histogram 配置。
- [x] check:examples/check:catalog 验证所有例子及反例的明确路径；确认 alias/意图目录没有新增未声明选项，检索所有旧 histogram 契约引用并逐项区分历史文档和当前生成资料。
- [x] 运行全包 Jest/Playwright、TypeScript 源码及测试类型检查、eslint、Schema 一致性、示例和目录检查；解决执行错误，如实记录未运行项。
- [x] 固定整数模运算生成 10k/100k 原始值，显式 binCount=30；测量 compile、render、含重编译的 update、resize、release。增加重复观测后 sum(count)=N+1，resize 保留统计结果，release 后 canvas=0。补 20 charts×1000 observations 多图创建/释放冒烟。
- [x] compile 暖机后 9 次记录中位数与最大值；浏览器生命周期记录环境与实际值，不设未经测量的毫秒 SLA。确认图元数量由 B 控制，resize 时间不包含样本计数。
- [x] 若触及原生 VChart，补官方视觉清单用例并执行相关目录。提交 PR 前始终运行 `node packages/vchart/scripts/visual-test.mjs`，审查 agent-summary.md/三图 HTML；本包新功能在官方基线不支持时如实说明，不用 self-compare 宣称基线通过。
- [x] `git diff --check`，检查只改授权范围；完成后给出改动、测试、视觉结果和实际限制，不自动提交/推送。

仓库根目录、Node.js 22 下最终命令：

```sh
npm run build --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
npm run compile --prefix packages/vchart-statplots
packages/vchart-statplots/node_modules/.bin/tsc -p packages/vchart-statplots/tsconfig.test.json --noEmit
npm run eslint --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
git diff --check
```

## 计划自检与本轮状态

- 协议、默认算法、空/恒定数据、错误路径、统计量、tooltip、迁移和依赖均有对应任务。
- 本计划借鉴 hexbin 的职责与边界，不复制二维保形布局、连续色标或只保留非空箱的行为。
- series 从独立 histogram 删除；pairPlot 是否分组由其自身协议负责，不借本次重构移除该能力。
- 已把工作区 pairPlot 的域、边界、查箱几何抽到 common/histogram.ts；分组与缺失规则保留，未修改另一份计划。
- 实现、协议、文档、数值及交互验收已完成；全包 Jest 383 项、Chromium 191 项通过，完整结果与官方轴目录的基线阻断见子包 docs/validation.md。

## 执行补充：标准数值轴更新

检查常数数据截图时发现：系列统计在轴 reInit 前触发更新，实际 scale 仍使用旧 min/max；轴应用新属性后没有第二次统计事件。这不是分箱问题。在线性轴 reInit 中比较解析后的显式 min/max，变化时调用标准 updateScaleDomain；范围不变不追加计算。单测覆盖边界变化、range 别名、移除边界与重复 reInit，浏览器覆盖普通域与常数域往返。

新增官方清单用例 linear-axis-update-bounds；官方 develop 单例比较通过。轴目录官方比较因基线已有 band-axis-update-spec 的主题更新断言失败而中止，不能写成目录通过。本地冻结构建的轴目录 30 项自比较通过；新用例五轮截图一致，独立副本的抑制更新和错误边界反例被检出。具体报告与其他检查见子包 docs/validation.md。
