# vchart-statplots 图表与配置命名优化设计

状态：已于 2026-09-30 实施，验收结果见 [实现与验收记录](../../../packages/vchart-statplots/docs/validation.md)。用户已确认直接统一新名称，旧 Spec 不兼容；仅图库旧 URL 与浏览记录迁移。

## 1. 目标与方案

目标是让使用者和 skill 根据分析意图生成简洁、含义准确的 JSON，并让 type、字段、选项、文档和实际图形保持一致。审查覆盖全部 28 类，包含保留 type 的图表。

| 方案 | 收益与代价 | 决策 |
| --- | --- | --- |
| 统一图表名称，并修正有明确歧义的配置与行为 | 一次完成发布前的命名调整，保留既有语义 Spec 架构 | 采用 |
| 仅修改 type 和中文展示名 | 改动较小，但 labels、归一化和季节子序列问题继续存在 | 不采用 |
| 重做通用编码 DSL，全面展开缩写、抽象统计配置 | 迁移范围大，会增加 skill 生成成本，当前无对应需求 | 不采用 |

约束：

- 包名仍为 `@visactor/vchart-statplots`，当前分支为 `codex/vchart-statplots`。
- Node.js 22、TypeScript 4.9.5；沿用现有 Jest、Playwright、Schema 生成器和构建期 Ajv。
- Spec 是纯 JSON、固定语义字段；不增加字段猜测、运行时别名归一化、回调或 VChart 配置透传。
- 统计结果由 Python 或调用方 JS 提供；仅进行既有显示归一化、累加、布局和颜色映射。
- 保留 VChart 原生 `light` / `dark` 主题；不增加额外主题。
- 旧 type、旧字段和旧枚举值在新接口中按结构错误拒绝；语义错误使用既有错误 code 和 JSON Pointer。
- 单位、含义、默认值和约束写入 TS JSDoc、生成的 Schema 及中文文档。
- 不新增图表类型；不改统计估计方法、完整配对要求、时间合法性、相关矩阵约束等无关契约。
- 该设计已获授权并完成本地实现；未提交、推送或发布。

## 2. 规范名称

沿用 [28 类命名审查](../../../packages/vchart-statplots/docs/naming-review.md)，21 类更名，7 类保留。英文 type 使用完整常见图表术语，不机械添加统一后缀。

| 当前 type | 新 type | 中文主名称 | 新公开 Spec 类型 |
| --- | --- | --- | --- |
| `count` | `countPlot` | 类别计数图 | `CountPlotSpec` |
| `missingness` | `missingValueMatrix` | 缺失值矩阵图 | `MissingValueMatrixSpec` |
| `histogram` | `histogram` | 直方图 | `HistogramSpec` |
| `kde` | `kdePlot` | 核密度估计图 | `KdePlotSpec` |
| `ecdf` | `ecdfPlot` | 经验累积分布图 | `EcdfPlotSpec` |
| `boxPlot` | `boxPlot` | 箱线图 | `BoxPlotSpec` |
| `violin` | `violinPlot` | 小提琴图 | `ViolinPlotSpec` |
| `stripPlot` | `stripPlot` | 条带图 | `StripPlotSpec` |
| `estimateInterval` | `pointIntervalPlot` | 点估计区间图 | `PointIntervalPlotSpec` |
| `paired` | `pairedComparisonPlot` | 配对比较图 | `PairedComparisonPlotSpec` |
| `scatter` | `scatterPlot` | 散点图 | `ScatterPlotSpec` |
| `hexbin` | `hexbinPlot` | 六边形分箱图 | `HexbinPlotSpec` |
| `correlationMatrix` | `correlationMatrix` | 相关矩阵图 | `CorrelationMatrixSpec` |
| `pairPlot` | `pairPlot` | 散点矩阵图 | `PairPlotSpec` |
| `timeSeries` | `timeSeriesPlot` | 时间序列图 | `TimeSeriesPlotSpec` |
| `seasonal` | `seasonalPlot` | 季节图 | `SeasonalPlotSpec` |
| `autocorrelation` | `autocorrelationPlot` | 自相关图 | `AutocorrelationPlotSpec` |
| `scree` | `screePlot` | 碎石图 | `ScreePlotSpec` |
| `embedding` | `embeddingPlot` | 降维散点图 | `EmbeddingPlotSpec` |
| `residual` | `residualPlot` | 残差图 | `ResidualPlotSpec` |
| `qq` | `qqPlot` | Q–Q 图 | `QqPlotSpec` |
| `confusionMatrix` | `confusionMatrix` | 混淆矩阵 | `ConfusionMatrixSpec` |
| `roc` | `rocCurve` | ROC 曲线 | `RocCurveSpec` |
| `precisionRecall` | `precisionRecallCurve` | PR 曲线 | `PrecisionRecallCurveSpec` |
| `calibration` | `calibrationCurve` | 概率校准曲线 | `CalibrationCurveSpec` |
| `learningCurve` | `learningCurve` | 学习曲线 | `LearningCurveSpec` |
| `featureImportance` | `featureImportancePlot` | 特征重要性图 | `FeatureImportancePlotSpec` |
| `shapBeeswarm` | `shapBeeswarmPlot` | SHAP 蜂群图 | `ShapBeeswarmPlotSpec` |

相应公开 Row 类型使用上述前缀，如 `CountPlotRow`、`RocCurveRow`；未变更图表的 Row 名称保留。`FitRow`、`PairPlotObservation`、`PairPlotBin` 保留。`compileStatPlot`、`validateStatPlot`、`registerStatPlots` 和错误类名称保留。

内部 `src/plots` 目录和非导出编译函数不机械移动或改名；其参数类型、访问的字段和 switch 判别值必须更新。原生 VChart 的 `type: 'scatter'`、`seriesField`、`label` 等配置，以及 `statplotsViolin` 等内部系列名不受公共 type 更名影响。

## 3. 公共字段规则

### 3.1 展示文字：`labels` → `fieldLabels`

当前 labels 为字段、坐标轴和 tooltip 的展示名，不控制图元数据标签。统一改为 `fieldLabels`，仍使用每类图表明确允许的键，不扩大为任意字符串字典。

- 所有原有 `labels` 键随数据语义字段的更名同步更名。
- 字段值仍用于统计，展示文字不参与分组、排序、join 或校验。
- 同一语义量的坐标轴、tooltip 应使用同一份展示名，用户提供的名称优先于默认名称。
- countPlot 新增可选 `fieldLabels.proportion`；histogram 将 `fieldLabels.probability` 改为 `fieldLabels.proportion`；confusionMatrix 新增可选 `fieldLabels.proportion`。这些是实际绘制的派生量。
- 其余图维持原有可配置键的范围；不在本轮增加完整的 tooltip 定制接口。
- pairPlot 当前没有 labels，继续通过 `variables` 和数据变量名展示，不新增任意动态字段映射。
- embeddingPlot 的轴展示优先级维持：显式 `fieldLabels.x/y` > dimensions 中的名称和解释方差 > 方法默认轴名。它们分别表达展示覆盖与统计元数据。
- `referenceLine.label` 是线的文本，保留该局部名称。

### 3.2 保留已有明确语义

保留公共 `type`、`data`、`title`、`description`、`theme`、`series`；保留常见 `id`、`category`、`value`、`x/y`、`count`、`binStart/binEnd`、`lower/upper`。

`Interval.kind/level/multiplier` 保留：level 为 0–1 的水平，multiplier 为正数，range 不接受二者；不预设 95% 或自动改成置信区间。`method`、`metric`、`distribution`、`estimation` 是预计算结果说明，修改它们不会重新拟合模型。

保留 q1/q3、fpr/tpr、auc 等领域内明确的缩写。是否展开字段，以能否消除真实歧义为依据，不以长度为依据。

## 4. 28 类配置审查与最终字段选择

下表使用新 type。每一行均隐含公共 labels → fieldLabels；“保留”字段仍需补齐 JSDoc、默认值和能力边界。

| 新 type | 配置与数据字段调整 | 保留与说明 |
| --- | --- | --- |
| `countPlot` | `normalization` → `statistic`，`count/proportion` 枚举保留；新增 fieldLabels.proportion | category/count/series；输入始终是计数，statistic 选择显示统计量，默认 count |
| `missingValueMatrix` | `data[].observation` → `observationId`；`missing` → `isMissing` | variable；id 表示观测，不是单元格唯一键；重复键仍是观测与变量组合 |
| `histogram` | `normalization` → `statistic`；枚举 probability → proportion | count/density 保留；默认 count；binStart/binEnd/count，非等宽仍要求 density |
| `kdePlot` | 无专属更名 | value/density、estimation.kernel/bandwidth；仅展示外部一维 KDE，不把 bandwidth 变成计算开关 |
| `ecdfPlot` | `data[].probability` → `cumulativeProbability` | value；明确输入是累计概率，不是区间概率质量 |
| `boxPlot` | `whiskerLow/whiskerHigh` → `whiskerLower/whiskerUpper` | category/q1/median/q3/outliers、whiskerRule；与 lower/upper 上下界用语一致 |
| `violinPlot` | `widthScale` → `densityNormalization`，枚举 width/area 保留 | category/value/density；控制密度轮廓归一化，默认 width，不表示像素宽度 |
| `stripPlot` | `jitter` → `jitterRatio` | layout=strip/jitter/swarm；jitterRatio 是最大偏移与完整分类带宽的比，0–0.5，默认 0.3，仅 jitter 布局可用 |
| `pointIntervalPlot` | `reference` → `referenceLine` | estimate/lower/upper、interval、valueScale、referenceLine.value/label；valueScale 控制数值轴，不固定为 xScale |
| `pairedComparisonPlot` | `categories` → `categoryOrder`，仍为两个不同字符串的元组 | id/category/value；显式顺序，不引入额外的 before/after 数据结构 |
| `scatterPlot` | 无专属更名 | x/y/id/series、fit.method/data/interval、拟合行 estimate/lower/upper；fit 内必须有预计算结果 |
| `hexbinPlot` | 无专属更名 | id/count/vertices[].x/y；顶点数与几何约束保留 |
| `correlationMatrix` | `data[].value` → `correlation`；`order` → `variableOrder` | row/column、method、triangle；variableOrder 精确覆盖变量，triangle 仅改变显示 |
| `pairPlot` | 无专属更名 | variables 是按显示顺序排列的变量选择；observations/diagonal/bins 含义明确，不改成通用 datasets |
| `timeSeriesPlot` | 无专属更名 | time/value/lower/upper、interval；time 为带时区 ISO 8601，null 明确断线 |
| `seasonalPlot` | period → phase、season → cycle、periodOrder → phaseOrder；新增必填 cycleOrder | value/series、layout=overlay/subseries；分组和时间方向按第 6 节修正 |
| `autocorrelationPlot` | `data[].value` → `correlation` | lag、method=acf/pacf、interval；不额外将无偏估计强行裁剪到 [-1,1] |
| `screePlot` | 无专属更名 | component/explainedVarianceRatio、showCumulative；布尔选项已经表达显示开关 |
| `embeddingPlot` | 无专属更名 | id/x/y、method、dimensions；explainedVarianceRatio 仅 PCA 可用，避免 method 对应三份重复 Spec |
| `residualPlot` | `data[].fitted` → `fittedValue` | id/residual、residualKind；明确为拟合值，不暗示包含所有残差诊断 |
| `qqPlot` | theoretical → theoreticalQuantile、observed → sampleQuantile；reference → referenceLine | distribution；referenceLine.method/intercept/slope 保留；理论与样本分位数方向明确 |
| `confusionMatrix` | normalization 枚举 true → actual；新增 fieldLabels.proportion | normalization 的 none/predicted/all 保留，默认 none；actual/predicted/count 保留，分母与数据字段用语一致 |
| `rocCurve` | 无专属更名 | fpr/tpr/threshold、metrics[].series/auc；保留常见领域缩写 |
| `precisionRecallCurve` | `prevalence` → `positiveRate` | recall/precision/threshold、metrics[].averagePrecision；正例比例为 0–1 的显式参考线数值，不是让用户传基线模型 |
| `calibrationCurve` | `meanPredicted` → `meanPredictedProbability` | observedRate/binStart/binEnd/count/lower/upper、interval；observedRate 明确表示实际正例比例 |
| `learningCurve` | 无专属更名 | trainSize/split/score、metric、interval；trainSize 是训练样本数，split=train/validation，不能填 epoch |
| `featureImportancePlot` | 无专属更名 | feature/importance/lower/upper、method、interval；保留负重要性与外部计算方法 |
| `shapBeeswarmPlot` | 无专属更名 | id/feature/shapValue/featureValue、featureOrder；featureValue 可为 null，原值不转换成 SHAP 值 |

### 4.1 为何使用 statistic

countPlot 和 histogram 当前的 normalization 同时表达原始计数、比例和密度。`statistic` 直接说明纵轴显示哪个统计量，配置如下：

```ts
// 默认值均为 count。
type CountStatistic = 'count' | 'proportion';
type HistogramStatistic = 'count' | 'proportion' | 'density';
```

比例统一叫 proportion；密度保留 density，两者的单位和计算公式不同。Seaborn 的 stat 区分 count、proportion 和 density，可作为语义参考；本库使用完整字段名 statistic，并继续接收预计算分箱。[Seaborn histplot](https://seaborn.pydata.org/generated/seaborn.histplot.html)

confusionMatrix 的 normalization 选择的是分母，因此保留该字段，并将 true 改为 actual。violinPlot 的 densityNormalization 表达轮廓归一化，也不强行改为 statistic。

### 4.2 配置更名保持的数值契约

- countPlot / histogram 的 proportion 为 `count / 同一 series 内总 count`，未分组时使用全部输入计数。density 再除以箱宽，面积和为 1。保持既有零总量行为，文档说明分母为零时比例未定义。
- confusionMatrix actual 以实际类别合计为分母，predicted 以预测类别合计为分母，all 以全部计数为分母。零分母仍显示 NA。
- violinPlot width 使各组最大宽度相等，area 使各组面积相等；不增加按样本量缩放的 count 模式。
- correlationMatrix 的 correlation 仍为 [-1,1] 或 null；autocorrelationPlot 的估计值保持原有约束，不因字段同名引入错误范围限制。
- fieldLabels.proportion 仅改变展示文字，不改变单位或数值。

## 5. 精简 Spec 示例

```json
{
  "type": "countPlot",
  "statistic": "proportion",
  "fieldLabels": { "category": "客户类型", "proportion": "客户占比" },
  "data": [
    { "category": "新客户", "count": 30 },
    { "category": "老客户", "count": 70 }
  ]
}
```

```json
{
  "type": "pointIntervalPlot",
  "interval": { "kind": "confidence", "level": 0.95 },
  "referenceLine": { "value": 0, "label": "无效应" },
  "data": [
    { "category": "处理组", "estimate": 0.2, "lower": 0.1, "upper": 0.3 }
  ]
}
```

```json
{
  "type": "seasonalPlot",
  "layout": "subseries",
  "phaseOrder": ["Q1", "Q2"],
  "cycleOrder": ["2024", "2025", "2026"],
  "fieldLabels": { "phase": "季度", "cycle": "年份", "value": "销量" },
  "data": [
    { "cycle": "2024", "phase": "Q1", "value": 10 },
    { "cycle": "2025", "phase": "Q1", "value": 13 },
    { "cycle": "2026", "phase": "Q1", "value": 12 },
    { "cycle": "2024", "phase": "Q2", "value": 12 },
    { "cycle": "2025", "phase": "Q2", "value": 15 },
    { "cycle": "2026", "phase": "Q2", "value": 14 }
  ]
}
```

## 6. 季节图的语义修复

现有示例把 season 用作年份、period 用作季度；subseries 按年份分面，实际得到每年的季度趋势。本次统一 cycle=完整周期编号（例如年份）、phase=周期内位置（例如季度），以避免两个旧名字互相混淆。

```ts
export interface SeasonalPlotRow extends SeriesRow {
  cycle: string;
  phase: string;
  value: number;
}
export interface SeasonalPlotSpec extends BaseSpec {
  type: 'seasonalPlot';
  data: SeasonalPlotRow[];
  cycleOrder: string[];
  phaseOrder: string[];
  layout?: 'overlay' | 'subseries';
  fieldLabels?: { cycle?: string; phase?: string; value?: string };
}
```

- 两份顺序都是必填的非空、不重复字符串数组，必须覆盖所有输入 cycle / phase，可额外声明当前无观测的位置。空数据仍需要合法顺序并使用既有空状态。
- 唯一键为 `(series, cycle, phase)`。不按字符串字典序猜测时间，不依赖输入行顺序。
- overlay：横轴 phaseOrder；每个 `(series, cycle)` 一条线，按 phaseOrder 连接。默认仍是 overlay。
- subseries：每个 phase 一个面板，按 phaseOrder 排列；横轴 cycleOrder，按 series 区分线，所有面板共享数值轴域。
- 缺少某个组合时在声明的相应位置断线；不补 0，不插值。内部为实际存在的线构造有序显示数据和 null 缺口，不创建不存在的 series 组合。
- 面板标题展示 phase，横轴标题使用 fieldLabels.cycle；tooltip 包含 cycle、phase、value。
- 不新增自动均值、平滑或趋势估计。此处修复的是子序列分组与时间方向。[季节子序列定义](https://otexts.com/fpp3/subseries.html)

## 7. Skill 与图库资料

新增 `packages/vchart-statplots/docs/plot-catalog.json`，每项包含 type、中文名 name、英文名 englishName、group、aliases、useWhen、avoidWhen、schema、example、variants。它是选型元数据，不是运行时解析器；核心 compile/validate 不加载它。

variants 包含 name、aliases、options、example：普通蜂群绑定 layout=swarm，PACF 绑定 method=pacf，比例图绑定 statistic=proportion。PCA 得分图、t-SNE、UMAP 通过 method 区分；单独“PCA”请求可能需要继续明确问题。目录中的默认 aliases 只包含无需改变默认语义的别名。

别名不成为额外 type，不在库里做模糊匹配。Schema 继续精确拒绝未知字段。`scripts/check-catalog.ts` 比对 Schema 的类型集合、28 个目录项、文件链接和所有变体示例，防止目录宣称未实现能力。

图库从该 JSON 读取分组与主名称；根据实际 Spec 显示抖动图/蜂群图、偏自相关图、季节子序列图等变体名称。目录加载失败显示明确错误，不能静默退回另一份名称清单。

新增意图验收样本，覆盖全部图表的中文任务、英文名称和容易混淆的请求；记录预期 type + 必要选项，或需要澄清/不支持。结构检查只能证明样本与契约一致，不代表已经测得模型命中率。

## 8. 迁移与生成物

- 新接口只接受新名称，旧 type / 旧字段 / 旧枚举值明确拒绝。编译失败仍抛出带 issues 的 StatPlotValidationError。
- 源码、公开类型、示例文件名及内容、Schema 文件名、逐图文档、索引和测试一起更新。
- Schema 生成时精确清理 `schema/plots` 下过期的生成文件；`--check` 同时检测多余、缺失和内容过期。生成过程不修改其他目录的手写文件。
- 图库使用明确的 21 项旧 type → 新 type 映射，限于 URL 和 localStorage。有效 URL（含可迁移旧名）优先于浏览记录，最后使用 violinPlot。
- 旧 URL 通过 replaceState 写成新 URL，保留其他 query 和 hash；成功绘制后更新浏览记录。前进后退、快速切换的 revision 机制保持。
- 手工粘贴旧 JSON 仍报错，不通过 URL 映射转换 Spec。旧字段迁移表写入文档供调用方修改，不新增公共迁移 API。
- 旧实现计划、审查文档、测试报告保留历史记录；现行 spec/catalog/skill-authoring 更新到新契约。审查文档加入指向本设计的后续决策链接，避免继续使用已过期的 normalization 示例。
- 发布包包含新 Schema、资料目录和示例；清理构建输出后打包，验证不残留旧声明或旧命名的示例。

## 9. 验收标准

1. 新目录、联合类型、Schema、28 个主示例严格一一对应；旧接口拒绝，额外字段路径准确，冻结输入不被修改。
2. 配置改名保持对应统计值和单位；proportion / density、混淆矩阵分母、ECDF 累积概率、分位数方向、区间含义和 jitterRatio 具有明确断言。
3. fieldLabels 在实际坐标轴和 tooltip 中生效；不因内部默认文案覆盖而成为无效配置。
4. 季节图 Q1–Q4 × 三年生成四个子序列面板、每个面板按年连接；乱序输入、非字典顺序、缺口和分组均有验证。
5. 28 类新名能在图库切换，旧 URL / 浏览记录恢复正确，手工旧 Spec 报错，深浅色与生命周期正常。
6. Schema、编译、示例、lint、单测、浏览器、ESM/CJS/UMD 与打包入口通过相应检查；保留当前大图性能基准作比较，不增加运行时字段归一化或逐图元兼容分支。
7. 视觉验证覆盖受影响的季节布局、字段展示和相关图表；提交 PR 前按仓库要求运行默认官方 develop 全量回归，记录预期差异及基线不支持情况，不以自比较替代。

执行顺序、文件和命令见 [实现计划](../plans/2026-09-29-vchart-statplots-naming.md)。
