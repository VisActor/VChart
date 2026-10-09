# Spec 协议

输入为纯 JSON。type 使用 lowerCamelCase 规范图表名，data 使用固定语义字段；不接受 xField、encoding、回调和原生配置透传。TypeScript、分图 Schema 与 standalone 校验器保持一致。旧接口见 [迁移表](naming-migration.md)。

## 公共配置

| 字段                | 含义                                                                                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type / data         | 必填，类型和对应数据；histogram、kdePlot、ecdfPlot 使用原始 value 观测，boxPlot 使用原始 category/value/series 观测，hexbinPlot 使用原始 x/y 散点，pairPlot、missingValueMatrix、correlationMatrix 使用 variables 与 data.observations |
| title / description | 标题及数据范围、统计方法说明                                                                                                                                                             |
| theme               | VChart 原生 light（默认）或 dark                                                                                                                                                         |
| colors              | 共用 categorical / sequential / diverging，支持名称与色号数组；见[公共配色](colors.md)                                                                                                   |
| fieldLabels         | 该图允许的字段展示名，供轴和 tooltip 使用；不控制图元标签                                                                                                                                |
| 行级 series         | 在该图 Schema 支持时比较系列，同一表全部提供非空系列名或全部省略；histogram、hexbinPlot 不支持分组                                                                                       |

观测 id 为字符串，category 为类别。缺失值只在明确允许 null 的字段中接受。数值必须有限，不接受数值字符串；未知字段、NaN、Infinity 不做静默归一化。缺少下界或上界时不能推断另一端。

## 区间与外部方法

```json
{ "kind": "confidence", "level": 0.95 }
```

confidence、prediction、credible 要求 0 < level < 1；standardError、standardDeviation 要求 multiplier > 0；range 不接受 level 或 multiplier。lower/upper 同时提供且 lower ≤ upper；不预设为 95% 置信区间。

外部模型结果的 method、metric 是结果说明；scatterPlot.fit.input=observations 的 method 与 residualPlot.regression.method 是实际回归算法配置。qqPlot.distribution / referenceLine、autocorrelationPlot.method / maxLag / confidence、calibrationCurve.binning、countPlot.statistic / normalizationScope 是实际计算配置，更新会重算。kdePlot.estimation 是实际核密度估计配置，修改 kernel / bandwidth 会重新计算；sampling.points 只控制绘制精度。boxPlot.whiskers.iqrMultiplier 是有效须规则，改变倍数会重新计算须与异常值。referenceLine 只在明确提供时绘制，ROC/校准对角线、残差/SHAP 零线等由图义确定的参考线继续内置。

## 显示统计量与默认值

| 选项                                  | 默认值及含义                                                                        |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| countPlot.statistic                   | count；proportion 默认全表比例，normalizationScope=series 才为系列内比例            |
| histogram.binning.binCount            | 可选 1–200 整数；省略时使用 Sturges 候选数，恒定观测一个箱                          |
| histogram.statistic                   | count；proportion 为样本比例，density 的柱面积和为 1；输入原始 value                |
| kdePlot.estimation.kernel / bandwidth | gaussian / scott；kernel 可选 epanechnikov，bandwidth 可为正数或 scott / silverman  |
| kdePlot.sampling.points               | 256；每系列 2–2048 个等距绘制点，不改变带宽                                         |
| ecdfPlot.data                         | 原始 value / series，按真实跳点计算右连续累计概率，不分箱                           |
| boxPlot.whiskers.iqrMultiplier        | 1.5；有限非负，按 category + series 独立计算，四分位数采用线性插值                  |
| violinPlot.estimation                 | 按 category + series 独立估计；核函数、固定带宽及 Scott / Silverman 与 kdePlot 相同 |
| violinPlot.sampling.points            | 每组 2–2048 整数，默认 256，仅控制轮廓绘制精度                                      |
| violinPlot.densityNormalization       | width 等最大宽度；area 等面积                                                       |
| stripPlot.layout / jitterRatio        | strip；jitter 布局最大偏移比例默认 0.3，范围 0–0.5                                  |
| pointIntervalPlot.valueScale          | linear；log 的估计、区间和参考值必须为正                                            |
| correlationMatrix.triangle            | full；原始观测内部生成对称矩阵                                                              |
| correlationMatrix.variables / method / minSamples | 有序变量必填；pearson / 2，支持 spearman、kendall tau-b |
| confusionMatrix.normalization         | none；actual 按实际类别、predicted 按预测类别、all 按全部计数归一化                 |
| seasonalPlot.layout                   | overlay；subseries 按 phase 分面、横轴 cycle                                        |
| screePlot.showCumulative              | false                                                                               |
| pairPlot.diagonal.type                | histogram；none 保留对角槽位但关闭对角分布                                          |
| pairPlot.diagonal.binning.binCount    | 可选的 1–200 整数；省略时按各变量有效 N 使用 Sturges 箱数，恒定变量一个箱           |
| hexbinPlot.binning.xBins              | 30；1–200 的整数，水平方向分箱分辨率，非总箱数                                      |

statistic 选择计数的显示形式。countPlot 接收原始 category/series 观测，默认以全表 N 归一化，可指定系列内分母；未出现的类别 × 系列补 0。histogram 先对原始观测分箱，再按唯一分布的样本总量归一化；保留零频次箱，原始全零值仍是有效观测。混淆矩阵的零分母显示 NA。fieldLabels.proportion 改变名称，不改变数值单位。

seasonalPlot 的 cycleOrder 与 phaseOrder 必填、非空、不重复，覆盖数据；可声明无观测的位置，缺口断线。pairedComparisonPlot.categoryOrder 必须是两个不同类别；同一对象以 id 连接。

## API 与错误

validateStatPlot(unknown) 返回 `{valid:true,errors:[]}` 或 `{valid:false,errors:[{code,path,message}]}`。path 是 JSON Pointer；未知字段和旧名称报 SCHEMA_ERROR，数值关系按 INVALID_RANGE、INVALID_ORDER、DUPLICATE_KEY、INCONSISTENT_SERIES、UNSUPPORTED_COMBINATION 分类。错误路径使用新字段。

compileStatPlot(spec) 使用相同校验，失败抛出 StatPlotValidationError，其 issues 保留结构化错误；成功返回原生 VChart ISpec。存储与传输使用原始语义 JSON。输入保持归调用方所有，不被修改。

registerStatPlots() 幂等注册专用系列。生命周期、事件和导出复用 VChart；更新使用 `chart.updateSpec(compileStatPlot(nextSpec))`。不承诺直接 updateData 后统计约束仍成立。

空数据保留标题并显示“暂无可绘制数据”；默认关闭动画。pairPlot 的面板数随变量数平方增长，调用方应先选变量，必要抽样由计算端明确记录。

## 原始输入与明确默认值

ROC / PR 接收布尔 actual 和有限 score，所有不同阈值参与计算；calibration 接收布尔 actual 和 probability，binning 默认 5 箱 uniform；confusion 接收类别 actual/predicted 和可选 classOrder。QQ 默认标准正态，referenceLine 默认 none；ACF 默认 acf，maxLag 按 N 确定，confidence 默认 95%。详见各图契约。不接受旧统计结果，也不通过猜测字段或展开频数恢复样本。

## 显式输入模式与迁移

pointIntervalPlot 必填 input=observations/estimates；residualPlot 必填 input=observations/predictions/residuals；learningCurve 必填 input=folds/summaries。Schema 禁止跨模式字段，不自动识别旧数据。点区间原始样本默认 mean + 95% bootstrap（1000 次，seed=0），学习曲线默认均值 ± 1 倍总体 SD，原始残差按 regression 拟合后为 y−predict(x)，外部预测残差为 actual−fittedValue。外部结果添加对应 input，保留其原有统计含义。

缺失和相关矩阵迁移为 variables/data.observations；每行 values 必须恰好匹配变量集合，null 是唯一缺失标记。删除旧掩码/系数结果行及 variableOrder。相关矩阵 method 现在控制计算，不只是元数据。完整迁移边界见五类逐图文档。

## 原始配对回归

scatterPlot 的 fit.input 明确 observations/estimates，不配置 fit 仍为纯散点。内部支持 linear、polynomial（degree=2–5）、lowess；线性/多项式默认 95% 成对 bootstrap，LOWESS 无置信带。residualPlot 的 observations 默认 linear 与原始 x 横轴，可显式 xAxis=fitted；外部预测/残差保持拟合值横轴。smooth 仅拟合残差趋势。详见[散点契约](plots/scatterPlot.md)与[残差契约](plots/residualPlot.md)。
