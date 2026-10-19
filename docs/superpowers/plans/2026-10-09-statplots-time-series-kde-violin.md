# StatPlots 时间序列与 KDE/violin 统计配置优化计划

> **执行方式：** 当前会话分阶段实施和验证，不自动委派代理。实现与正式依赖联调已完成；按用户 2026-10-10 的指令整理本地提交。

**Goal:** 时间序列直接处理重复时间观测及统计区间；KDE/violin 的自动带宽和默认归一化对齐 Seaborn，同时提供显式配置恢复此前默认效果。

**Architecture:** VUtils 提供可选标准差口径和带宽调整；StatPlots 在共享 KDE 适配层选定统计配置。时间序列和点区间图复用样本估计模块；分组、时间排序、归一化和私有绘图数据均在编译阶段完成。

**Tech Stack:** TypeScript 4.9.5、VUtils、VChart、JSON Schema/AJV、Jest、Playwright；Node.js 22。

**状态：** 实现与 npm VUtil 1.0.27 正式依赖验收已完成。用户已明确选择“默认对齐 Seaborn，保留显式旧配置”。时间序列已采用与现有点区间图一致的显式输入模式。

## 全局约束

- 使用 Node.js 22；正式依赖起点为 VUtils 1.0.26。新 API 必须先在上游实现，不在 StatPlots 再写一套标准差、核函数或 bootstrap。
- VUtils 保留已有默认总体标准差口径；StatPlots 显式选用样本标准差。避免此次图表优化改变其他 VUtils 调用方的统计定义。
- 不修改原始输入；重复观测保留样本权重；系列分类顺序仍按首次出现确定。
- 所有统计只在 compile/update 时计算；render、resize、hover、图例显隐不能重新估计或扫描原始样本。
- 中文说明、迁移文档和反例同步完成；仅提交 TypeScript 测试与固定参考 JSON，不新增 Python 源码。
- 范围为 timeSeriesPlot、kdePlot、violinPlot 及必要共享模块。此次不增加 seasonalPlot、其他图表功能、模型训练、权重、聚类 bootstrap、时间重采样、单位轨迹字段、violin 内部箱线或 split。

## 1. 决策与 Python 对照

| 方案 | 取舍 | 决定 |
| --- | --- | --- |
| 保留所有现有默认，仅增加配置 | 默认结果依然与用户熟悉的 Seaborn 不同 | 不采用，用户已选择改变默认 |
| StatPlots 在调用前自行纠正带宽，分别实现时间序列区间 | 上游问题被局部公式掩盖，区间算法出现重复路径 | 不采用 |
| VUtils 增加明确口径，StatPlots 统一调用并迁移默认 | 根因在算法层修复，图表保持分组与展示职责 | 采用 |

对照以下具体接口，不承诺复刻全部 Python 参数或随机数序列：

- [seaborn.lineplot](https://seaborn.pydata.org/generated/seaborn.lineplot.html)：默认排序，重复 x 聚合均值，绘制 95% bootstrap CI；estimator=None 可显示逐条观测。
- [seaborn.kdeplot](https://seaborn.pydata.org/generated/seaborn.kdeplot.html)：Scott、bw_adjust=1、common_norm=True、cut=3。
- [seaborn.violinplot](https://seaborn.pydata.org/generated/seaborn.violinplot.html)：Scott、bw_adjust=1、density_norm=area、common_norm=False、cut=2。
- [SciPy KDE](https://github.com/scipy/scipy/blob/main/scipy/stats/_kde.py)：自动带宽使用样本协方差。
- [Seaborn 0.13.2 violin 实现](https://github.com/mwaskom/seaborn/blob/v0.13.2/seaborn/categorical.py)：area 使用归一化范围内的最大密度；count 使用每组峰值及最大样本数；common_norm=False 的比较范围是同一 hue 跨 category，不是每个 category 独立。

## 2. 时间序列契约

### 输入模式

```ts
interface TimeSeriesObservation extends SeriesRow {
  time: string;
  value: number | null;
}
interface TimeSeriesEstimate extends TimeSeriesObservation {
  lower?: number;
  upper?: number;
}
type TimeSeriesPlotSpec = TimeSeriesBase & (
  | ({ input: 'observations'; data: TimeSeriesObservation[] } & (
      | { estimator?: 'mean' | 'median'; errorBar?: SampleErrorBar }
      | { estimator: false; errorBar?: false }
    ))
  | { input: 'estimates'; data: TimeSeriesEstimate[]; interval?: Interval }
);
```

TimeSeriesBase 保留现有 type、主题、颜色、标题及 fieldLabels；TimeSeriesPlotSpec 作为对外导出名保持不变。TimeSeriesPlotRow 保留为外部估计行的类型别名，并注明其用途，不自动猜测输入模式。

SampleErrorBar 沿用 PointIntervalErrorBar 的六种用途；PointIntervalErrorBar 保留对外类型别名：

```ts
type SampleErrorBar =
  | false
  | { kind: 'confidence'; level?: number; resamples?: number; seed?: number }
  | { kind: 'percentile'; level?: number }
  | { kind: 'standardError'; multiplier?: number }
  | { kind: 'standardDeviation'; multiplier?: number }
  | { kind: 'range' };
```

confidence/percentile 的 level 默认 0.95、严格在 (0,1)；confidence 的 resamples 为 100–10000 的整数、seed 为 uint32；multiplier 默认 1、有限且大于 0。判别联合禁止不适用于所选区间方法的参数，沿用点区间图的既有边界。

### 原始观测

- input=observations 必填；默认 estimator=mean、95% percentile bootstrap、1000 次、seed=0。
- time 保持有效的带时区 ISO 8601 字符串，显示为 UTC。不同偏移但表示同一瞬间的时间合并；分组键为 series + 解析后的毫秒时间戳。
- 输入允许乱序；每系列按实际时间稳定排序。重复时间的数值逐条参与估计，不去重、不平均后再 bootstrap。
- 每个时间组忽略明确的 value=null；只含 null 的已声明时间生成缺失点，曲线和区间同时断开。缺失时间不自动插值或生成时间网格。
- mean/median 和区间语义与 pointIntervalPlot 一致；有效 N=1 时 CI/SE/SD 不生成区间，保留估计点和“样本不足”的说明；N>=2 的常数组允许零宽区间。range/percentile 在 N=1 可退化为该值。
- estimator=false 表示逐条连接，等价于不聚合的使用目的：排序后同时间观测保持输入次序，null 保留断点；只允许 errorBar 省略或 false，此模式默认不计算区间。
- observations 不接受 lower/upper/interval；standardError 配合 median 继续拒绝。

### 外部估计

- input=estimates 展示现有 value/lower/upper；interval 继续为已有 Interval，不改外部估计的统计含义。
- 允许乱序并内部排序；同一系列同一实际时间只能有一行，避免任意选择外部结果。
- 禁止 estimator/errorBar；区间成对出现并有 interval 说明，lower<=upper；value=null 不能携带端点。已有 checkBounds 契约保持。

私有结果统一保留 __time、UTC time、value、lower/upper、series；原始估计模式增加 sampleCount、estimator、区间说明。逐条模式不伪造 sampleCount 的聚合含义；外部模式不伪造原始样本数。图例同时控制线和带，缺失区间不补 0。

## 3. 带宽与采样配置

```ts
interface KdeEstimationSpec {
  kernel?: 'gaussian' | 'epanechnikov';
  bandwidth?: number | 'scott' | 'silverman';
  standardDeviation?: 'sample' | 'population';
  bandwidthAdjust?: number;
}
interface KdeSamplingSpec {
  points?: number;
  cut?: number;
}
```

- KDE/violin 自动带宽默认 Scott + sample；population 为显式旧口径。
- 保留 bandwidth:number 表示原数据单位的固定带宽。它与 Python bw_method:number 的无量纲系数不同，迁移说明必须写清，不悄悄改变已有数值配置含义。
- 实际带宽 h = 选定的基础带宽 × bandwidthAdjust；adjust 默认 1、有限且大于 0，对自动与固定带宽均生效。VUtils 返回实际 h，采样、密度、Tooltip 均使用它，不再乘第二次。
- 显式固定 bandwidth 与 standardDeviation 同时配置在 StatPlots 拒绝，因为后者不参与计算；默认口径不导致固定带宽配置失败。
- sampling.points 保留默认 256、整数 2–2048。sampling.cut 有限且非负，只改变显示范围，不改变模型和概率密度。
- Gaussian 的默认 cut：kdePlot=3、violinPlot=2；Epanechnikov 的默认 cut 保留 1。显式 cut 覆盖默认。
- 曲线范围为各组 [min-cut*h, max+cut*h]。cut=0 可用于非恒定数据；常数/单样本若范围因此为零，明确拒绝，不能伪造正面积轮廓。
- 单样本或常数组自动带宽仍报告需要固定正带宽。Seaborn 的自动跳过奇异组并非本包现有契约，本次不改成静默跳过。
- 不加入 clip、权重、对数坐标估计或任意带宽回调。

### VUtils 的必要变更

KDEOptions 新增 standardDeviation?:'sample'|'population' 和 bandwidthAdjust?:number。省略口径仍为 population，省略 adjust 为 1；scott/silverman 导出函数继续只接收 n/std/dim，不改变含义。

自动标准差应在上游先使用已有 mean 计算中心，再对差值缩放后使用已有 variance 求样本方差；population 用 (n-1)/n 转换。不要使用 E[x²]-E[x]²，也不要直接对极大数平方。N<2 或常数组保留零自动带宽及既有零密度 evaluator 契约；明确新增参数非法时在工厂边界抛 RangeError。

固定带宽路径无需扫描样本求标准差。evaluate 的核计算保持已有紧凑路径，不在每个采样点补范围/配置校验。

## 4. KDE 与 violin 的不同归一化语义

### KDE

新增 normalizationScope?:'all'|'series'，默认 all，与现有 countPlot 的范围命名保持一致。

- 先按系列拟合独立概率密度 f_g；all 显示 f_g*n_g/N，series 显示 f_g。
- 不把组间归一化变成所有样本共用一个 KDE，也不让它改变带宽。
- “面积总和为 1”指完整核密度的理论积分。有限 cut 范围保留核尾部截断损失，不对可见面积再次归一化。
- Tooltip 显示实际带宽、组样本数、归一化范围和显示密度，避免把 all 模式的纵轴含义标成系列内密度。

### Violin

扩展 densityNormalization 为 area|count|width，默认 area；新增 normalizationScope?:'all'|'series'，默认 series。

- group 仍为 category+series，每组 KDE 的 density 保持自己的概率密度。
- series 范围对应 Seaborn common_norm=False：同一系列跨 category 比较；没有 series 时所有 category 属于同一范围。
- all 范围对应 common_norm=True：所有实际存在的 category+series 共同比较。
- width：每个轮廓最大宽度相同；范围不改变结果，文档明确这一点。
- area：用范围内最大峰值作共同分母；完整密度面积一致，可见面积受 cut 和网格精度影响。
- count：峰值宽度按该组样本数/范围内最大样本数缩放。

设 d 为该位置的组内密度，p 为组内网格峰值，P 为范围内最大峰值，n 为组样本数，M 为范围内最大样本数。私有半宽比例为：

```ts
const normalizedWidth =
  mode === 'width' ? density / peak :
  mode === 'count' ? (density / peak) * (sampleCount / scopeMaxCount) :
  density / scopeMaxPeak;
```

原 area 模式的“按截断梯形积分再统一缩放”改为上述 Seaborn 定义。不能把 KDE 的 n/N 缩放再次应用到 violin；不能声称不同 normalizationScope 下所有 hue 之间都等面积。

## 5. 迁移与示例

此次是有意的默认统计行为变化，现有未配置选项的 KDE/violin 图形会变化；时间序列增加必填 input。文档及变更记录明确说明。

```ts
// 时间序列：外部区间展示
{ type: 'timeSeriesPlot', input: 'estimates', data: rows, interval: intervalSpec }

// 时间序列：重复时间观测 -> 均值及默认 CI
{ type: 'timeSeriesPlot', input: 'observations', data: observations }

// 时间序列：逐条连接已有原始时间观测
{ type: 'timeSeriesPlot', input: 'observations', estimator: false, data: observations }

// 恢复 KDE 此前的默认统计配置
{
  type: 'kdePlot', data: samples, normalizationScope: 'series',
  estimation: { bandwidth: 'scott', standardDeviation: 'population' },
  sampling: { cut: 3 }
}

// 恢复 Gaussian violin 此前的默认统计配置
{
  type: 'violinPlot', data: groupedSamples, densityNormalization: 'width',
  estimation: { bandwidth: 'scott', standardDeviation: 'population' },
  sampling: { cut: 3 }
}
```

保留此前默认效果不等于维持所有旧配置逐像素结果；尤其旧 area 的截断面积算法将按新的统计定义迁移。Epanechnikov 的旧 cut 为 1。示例必须使用不等样本量和不同离散程度，能实际区分归一化选项。

## 6. 实施任务

### Task 1：在 VUtils 扩展标准 KDE 路径

**Files（VUtil 仓库路径）：** packages/vutils/src/common/kde.ts、packages/vutils/__tests__/kde.test.ts，以及该包现有 API 文档/变更记录。

**接口：** 消费既有 mean/variance；产出扩展 KDEOptions，保留 KDEEvaluator 的 bandwidth/evaluate/evaluateGrid 返回形状。

- [x] 基于执行时最新 origin/main 创建独立上游分支；先核对是否已存在等价 API，若已有则复用标准接口。
- [x] 增加区分旧/新统计口径的测试，先运行并确认新选项尚未实现：

```ts
const sampleH = Math.sqrt(0.5) * Math.pow(2, -0.2);
expect(kde([0, 1]).bandwidth).toBeCloseTo(sampleH / Math.sqrt(2), 12);
expect(kde([0, 1], { standardDeviation: 'sample' }).bandwidth).toBeCloseTo(sampleH, 12);
expect(kde([0, 1], { standardDeviation: 'sample', bandwidthAdjust: 2 }).bandwidth)
  .toBeCloseTo(sampleH * 2, 12);
expect(kde([0, 1], { bandwidth: 0.25, bandwidthAdjust: 2 }).bandwidth).toBe(0.5);
```

- [x] 按第 3 节实现一次标准差选择和一次 adjust；补充 Silverman、平移/缩放、大偏移、空/单样本/常数、evaluate 标量与数组一致、固定带宽无需自动口径的测试。
- [x] VUtil 仓库四包分别执行 `npm test -- --runInBand`；vutils 类型检查及构建通过，其余三包原有 rootDir 配置冲突，使用 `npm run compile -- --rootDir .` 完成类型检查。
- [x] 整理独立上游变更；需要 PR 时再运行上游完整规定检查。正式发布使用包含新 API 的实际版本，不预填未来版本号。

### Task 2：提取共享样本估计，完成时间序列输入

**Files：**

- Create: packages/vchart-statplots/src/common/sample-estimate-types.ts
- Create: packages/vchart-statplots/src/common/sample-estimate.ts
- Create: packages/vchart-statplots/src/plots/time-series/statistics.ts
- Modify: packages/vchart-statplots/src/plots/time-series/{types,validate,compile}.ts
- Modify: packages/vchart-statplots/src/plots/estimate-interval/{types,validate,statistics}.ts
- Test: packages/vchart-statplots/__tests__/unit/time-series.test.ts（新增）、input-alignment.test.ts、third-phase.test.ts

**接口：** sample-estimate-types.ts 导出 SampleErrorBar 和 SampleEstimateOptions；sample-estimate.ts 导出 summarizeSample 和 validateSampleEstimateOptions。时间序列 statistics.ts 导出 summarizeTimeSeries(spec)。

```ts
interface SampleEstimateOptions {
  estimator?: 'mean' | 'median';
  errorBar?: SampleErrorBar;
}
interface SampleEstimate {
  estimate: number;
  lower: number | null;
  upper: number | null;
  sampleCount: number;
  interval: string;
}
export declare function summarizeSample(
  values: readonly number[], options: SampleEstimateOptions, path?: string
): SampleEstimate;
export declare function validateSampleEstimateOptions(options: SampleEstimateOptions): StatPlotIssue[];
```

- [x] 增加先失败的时间序列测试：乱序重复时间被接收，mean/median 与 SE 结果正确，时区别名合并。

```ts
const t = '2026-01-01T00:00:00Z';
const spec: TimeSeriesPlotSpec = {
  type: 'timeSeriesPlot', input: 'observations',
  errorBar: { kind: 'standardError' },
  data: [{ time: t, value: 1 }, { time: '2026-01-01T08:00:00+08:00', value: 3 }]
};
// 编译后的同一时间结果：value=2、sampleCount=2、lower=1、upper=3。
```

- [x] 将原点区间统计拆为分组和 summarizeSample；原有点区间测试先保持通过，再接入时间序列。共享函数不接收空数组，不修改传入数组；全 null 分组由时间序列层生成断点，不调用它。
- [x] 按第 2 节实现 raw/estimates 判别联合、排序、同瞬间分组、逐条模式及 null 规则；依然调用标准 curve/band 工具。
- [x] 验证默认 bootstrap 固定种子重复编译一致；median/CI、range/percentile、单样本、常数组、空输入、两系列同时间、缺失组、外部区间、跨模式字段和非法日期均覆盖。
- [x] 运行定向单测：`npm test -- --runInBand time-series input-alignment third-phase`（包目录）。

### Task 3：共享带宽适配与 KDE 归一化

**Files：** src/common/{kde-types,kde}.ts、src/plots/kde/{types,estimation,compile,validate}.ts、__tests__/unit/kde.test.ts，路径均相对于 packages/vchart-statplots。

**接口：** prepareKdeGroups 接收调用方默认 cut，显式向 VUtils 传 standardDeviation/bandwidthAdjust；estimateKde 接收 normalizationScope，生成显示密度与元数据。

- [x] 添加相同形状、不等组样本数的测试，防止只检查“曲线存在”：

```ts
const a = [0, 1];
const b = [0, 1, 0, 1, 0, 1, 0, 1];
// 固定相同带宽、网格：series 模式每个位置 A/B 密度相同；
// all 模式 B/A=4，A/all 是 A/series 的 0.2，B/all 是 B/series 的 0.8。
```

- [x] 按第 3/4 节更新默认、采样范围、跨字段校验及 Tooltip；standardDeviation 在 StatPlots 显式传入，VUtils 默认不被修改。
- [x] 增加固定带宽单位、adjust、cut=0/3、样本/总体口径、两种核、有限 cut 不二次归一化、空数据、不可表示范围的测试。
- [x] 使用用户明确的旧配置验证此前默认效果；当前“population 默认”测试改为新默认测试加显式旧模式测试，不能简单删除数值断言。
- [x] 运行 `npm test -- --runInBand kde distributions`（包目录）。

### Task 4：violin 的归一化模式及范围

**Files：** src/plots/violin/{types,estimation,compile,validate}.ts、__tests__/unit/violin.test.ts；复用 Task 3 共享 KDE。

**接口：** estimateViolin 增加范围参数；组摘要增加实际 normalization 配置与范围统计；__densityWidth 为第 4 节公式，原 density 不变。

- [x] 添加 count 和范围测试，构造至少 2 categories × 2 series，样本数与离散程度均不同。
- [x] 一次评估每组密度和峰值，再一次计算范围 maxPeak/maxCount，最后生成 width。删除 area 的截断积分二次归一化，不引入第二个 KDE 模型。
- [x] 用独立固定输入验证公式：density=0.2、peak=0.4、scopeMaxPeak=0.8、sampleCount=2、scopeMaxCount=8 时，area=0.25、count=0.125、width=0.5。
- [x] 验证默认 area、默认 series、显式 all、无 series 时两范围等价、width 范围不改变结果、不存在组合不补空轮廓，固定 density 不受归一化模式影响。
- [x] 原“与 KDE 共用默认网格”断言改为显式相同 cut 后的共享网格断言；另断言默认 Gaussian violin cut=2、KDE cut=3。
- [x] 运行 `npm test -- --runInBand violin kde`（包目录）。

### Task 5：协议、参考数据和迁移示例

**Files：**

- Modify: src/types.ts、scripts/build-schema.ts（仅生成器确需调整时）、schema/plots/{timeSeriesPlot,kdePlot,violinPlot}.schema.json、schema/statplot.schema.json、src/generated/validate.js、src/generated/validate.d.ts
- Modify: docs/plots/{timeSeriesPlot,kdePlot,violinPlot}.md、docs/{spec,computation-contract,catalog}.md、docs/plot-catalog.json、README.md
- Modify: examples/specs/{timeSeriesPlot,kdePlot,violinPlot}.json、对应 minimal/grouped/variants、examples/specs/index.json
- Create: __tests__/fixtures/time-density-reference.json、__tests__/unit/time-density-reference.test.ts
- Modify: __tests__/unit/{schema,field-labels,third-phase}.test.ts、引用旧时间序列示例的浏览器检查

- [x] 时间序列主例展示每个时间多条样本；新增外部区间、逐条连接、SE 和缺失断点变体。
- [x] KDE 主例使用 1:4 样本量组；violin 主例用不同离散程度的分组，增加 count、all 范围、旧默认配置和 cut=0 变体。
- [x] 参考 JSON 固定原始样本、Python 库版本、调用参数、带宽、同位置密度及 violin 宽度。仅记录确定性数值；bootstrap 不要求与 NumPy 随机端点逐项一致。
- [x] 对比 SciPy 自动带宽和密度、Seaborn 三种 violin 公式与 hue 范围、时间序列均值/SE；归一化参考必须能拒绝错用 n/N 和误按 category 分范围。
- [x] 同步反例：缺 input、跨模式字段、固定带宽带标准差口径、adjust<=0、cut<0、estimator=false 带区间、重复外部时刻。
- [x] 运行 `npm run build:schema`、`npm run check:schema`、`npm run check:examples`、`npm run check:catalog`；确认仍是 28 种类型。

### Task 6：真实渲染、性能和正式依赖验收

**Files：** __tests__/browser/time-series.spec.ts（新增）、kde.spec.ts、violin.spec.ts、semantics.spec.ts、distribution-performance.spec.ts；benchmark 结果与说明；package.json、common/config/rush/pnpm-lock.yaml（正式上游版本可用后）。

- [x] 时间序列验证图元真实使用聚合结果，线与区间的同系列颜色、Tooltip 样本数、图例同时隐藏两者、null 断线、input 切换后旧区间移除。
- [x] KDE/violin 验证 adjust、normalizationScope、densityNormalization 的 update 改变真实图元；resize 和 hover 不改变统计结果；释放后资源归零。用已知输入比较曲线/宽度，不以“截图不为空”代替数值检查。
- [x] 运行该包全量单测、类型检查与浏览器检查：`npm test -- --runInBand`、`npm run compile`、`npm run test:browser`。
- [x] 测量 10k 时间观测/100 时间组、10k KDE 样本/4 系列及 10k violin 样本/20 组的 compile/render/update/resize/hover/release；同机与本轮前基线比较。时间原始估计新增 bootstrap 成本独立记录，并与 errorBar=false 对照。
- [x] 从仓库根目录运行 `node packages/vchart/scripts/visual-test.mjs --dir charts/line`、`--dir charts/range-area`、`--dir charts/scatter` 和 `--dir components/legend`，执行前通过 `--list` 核实显式用例清单。StatPlots 新统计定义依靠包内数值与浏览器用例，不能声称 develop 基线支持尚未存在的语义入口。
- [ ] 提交任何 PR 前运行 `node packages/vchart/scripts/visual-test.mjs`，审查三图报告/agent-summary；执行错误必须解决或如实记录阻断，不用 self-compare 代替基线比较。
- [x] 上游版本发布后，升级实际受影响的 VUtils 相关包与 Rush 锁文件，运行相关工程构建；隔离验收 CJS/ESM/UMD 与严格类型消费。已使用 npm 1.0.27 验收，局部源码联调结果不作为正式 npm 依赖验收结论。

## 7. 完成标准与自审

- 原始时间观测无需调用方排序或预聚合；默认结果为按时间分组的均值与明确的 CI；逐条展示、外部区间仍有独立且严格的输入契约。
- KDE/violin 默认自动带宽与 SciPy 的样本口径相符；固定带宽单位不变；实际带宽调整只执行一次。
- KDE 分组概率质量、violin 面积/样本数/宽度、归一化范围三者的数值测试能区分正确和错误实现。
- 显式 population/series/width/cut 配置能恢复旧默认效果；旧 area 的统计定义变化有完整迁移说明。
- 点区间复用改动未改变其已有默认和区间含义；没有 per-graphic 的新增统计开销。
- Schema、示例、文档、类型、参考 JSON、浏览器及性能证据一致；正式依赖阻断与视觉基线阻断分别记录。

自审：所有默认、分组范围、null/退化样本、固定数值带宽、模式迁移、上游兼容性与发布条件均已明确；没有把 KDE 的概率质量缩放混入 violin 宽度；没有承诺复刻 NumPy bootstrap 随机序列。实际检查结果与发布条件见 packages/vchart-statplots/docs/validation.md 本轮验收记录。

执行收尾：实现及正式依赖联调完成，8 个项目的 14 处依赖已统一升级到 ~1.0.27。升级后 charts 109 项及 data 4 项官方基线比较通过。此前 legend 官方 develop 的既有色域范围断言失败记录保留，不记为完整通过；提交 PR 前仍须运行全量视觉回归。本轮仅整理本地提交，见验收记录。
