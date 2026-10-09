# 命名与配置迁移

> 下文先记录历史命名迁移；本次七类图表的数据迁移见末尾「原始观测迁移」。不得继续使用历史表格中的预计算输入。

本包发布前统一公共契约。新接口只接受以下规范名称；旧 type、字段与枚举值会报 SCHEMA_ERROR。图库旧 URL 和浏览记录可恢复到新类型，但编辑器不会转换旧 JSON。

## 图表类型

| 当前 type           | 新 type                 | 中文主名称     | 新公开 Spec 类型            |
| ------------------- | ----------------------- | -------------- | --------------------------- |
| `count`             | `countPlot`             | 类别计数图     | `CountPlotSpec`             |
| `missingness`       | `missingValueMatrix`    | 缺失值矩阵图   | `MissingValueMatrixSpec`    |
| `histogram`         | `histogram`             | 直方图         | `HistogramSpec`             |
| `kde`               | `kdePlot`               | 核密度估计图   | `KdePlotSpec`               |
| `ecdf`              | `ecdfPlot`              | 经验累积分布图 | `EcdfPlotSpec`              |
| `boxPlot`           | `boxPlot`               | 箱线图         | `BoxPlotSpec`               |
| `violin`            | `violinPlot`            | 小提琴图       | `ViolinPlotSpec`            |
| `stripPlot`         | `stripPlot`             | 条带图         | `StripPlotSpec`             |
| `estimateInterval`  | `pointIntervalPlot`     | 点估计区间图   | `PointIntervalPlotSpec`     |
| `paired`            | `pairedComparisonPlot`  | 配对比较图     | `PairedComparisonPlotSpec`  |
| `scatter`           | `scatterPlot`           | 散点图         | `ScatterPlotSpec`           |
| `hexbin`            | `hexbinPlot`            | 六边形分箱图   | `HexbinPlotSpec`            |
| `correlationMatrix` | `correlationMatrix`     | 相关矩阵图     | `CorrelationMatrixSpec`     |
| `pairPlot`          | `pairPlot`              | 散点矩阵图     | `PairPlotSpec`              |
| `timeSeries`        | `timeSeriesPlot`        | 时间序列图     | `TimeSeriesPlotSpec`        |
| `seasonal`          | `seasonalPlot`          | 季节图         | `SeasonalPlotSpec`          |
| `autocorrelation`   | `autocorrelationPlot`   | 自相关图       | `AutocorrelationPlotSpec`   |
| `scree`             | `screePlot`             | 碎石图         | `ScreePlotSpec`             |
| `embedding`         | `embeddingPlot`         | 降维散点图     | `EmbeddingPlotSpec`         |
| `residual`          | `residualPlot`          | 残差图         | `ResidualPlotSpec`          |
| `qq`                | `qqPlot`                | Q–Q 图         | `QqPlotSpec`                |
| `confusionMatrix`   | `confusionMatrix`       | 混淆矩阵       | `ConfusionMatrixSpec`       |
| `roc`               | `rocCurve`              | ROC 曲线       | `RocCurveSpec`              |
| `precisionRecall`   | `precisionRecallCurve`  | PR 曲线        | `PrecisionRecallCurveSpec`  |
| `calibration`       | `calibrationCurve`      | 概率校准曲线   | `CalibrationCurveSpec`      |
| `learningCurve`     | `learningCurve`         | 学习曲线       | `LearningCurveSpec`         |
| `featureImportance` | `featureImportancePlot` | 特征重要性图   | `FeatureImportancePlotSpec` |
| `shapBeeswarm`      | `shapBeeswarmPlot`      | SHAP 蜂群图    | `ShapBeeswarmPlotSpec`      |

公开 Row 类型使用同一前缀；公共 compileStatPlot、validateStatPlot、registerStatPlots 函数名称保留。内部 VChart 系列名保持原生契约。

## 配置与数据字段

所有已提供 labels 的图表统一改为 fieldLabels，键随数据字段更名。fieldLabels 只控制展示文字。

| 新 type                 | 配置与数据字段调整                                                                      | 保留与说明                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `countPlot`             | `normalization` → `statistic`，`count/proportion` 枚举保留；新增 fieldLabels.proportion | category/count/series；输入始终是计数，statistic 选择显示统计量，默认 count                                           |
| `missingValueMatrix`    | `data[].observation` → `observationId`；`missing` → `isMissing`                         | variable；id 表示观测，不是单元格唯一键；重复键仍是观测与变量组合                                                     |
| `histogram`             | `normalization` → `statistic`；枚举 probability → proportion                            | count/density 保留；默认 count；当前使用原始 value 和可选 binning.binCount，旧 binStart/binEnd/count/series 直接拒绝  |
| `kdePlot`               | data 仅接收原始 value / series；拒绝旧 density                                          | estimation.kernel / bandwidth 真正参与估计；bandwidth 为正数或 scott / silverman，sampling.points 控制绘制精度        |
| `ecdfPlot`              | data 仅接收原始 value / series；拒绝 probability / cumulativeProbability                | 重复值分别计入，库内生成右连续累计概率及真实跳点                                                                      |
| `boxPlot`               | 五数摘要 → 原始 category/value/series；whiskerRule → whiskers.iqrMultiplier             | 默认 1.5×IQR；q1/median/q3/whiskerLower/whiskerUpper/outliers 只存在于内部绘图数据，旧预计算输入拒绝                  |
| `violinPlot`            | `widthScale` → `densityNormalization`，枚举 width/area 保留                             | 原始 category/value/series；内部计算 KDE，控制密度轮廓归一化，默认 width，不表示像素宽度                              |
| `stripPlot`             | `jitter` → `jitterRatio`                                                                | layout=strip/jitter/swarm；jitterRatio 是最大偏移与完整分类带宽的比，0–0.5，默认 0.3，仅 jitter 布局可用              |
| `pointIntervalPlot`     | `reference` → `referenceLine`                                                           | estimate/lower/upper、interval、valueScale、referenceLine.value/label；valueScale 控制数值轴，不固定为 xScale         |
| `pairedComparisonPlot`  | `categories` → `categoryOrder`，仍为两个不同字符串的元组                                | id/category/value；显式顺序，不引入额外的 before/after 数据结构                                                       |
| `scatterPlot`           | 无专属更名                                                                              | x/y/id/series、fit.method/data/interval、拟合行 estimate/lower/upper；fit 内必须有预计算结果                          |
| `hexbinPlot`            | 无专属更名                                                                              | 原始 x/y + binning.xBins；旧 id/count/vertices 输入移除，见逐图迁移说明                                               |
| `correlationMatrix`     | `data[].value` → `correlation`；`order` → `variableOrder`                               | row/column、method、triangle；variableOrder 精确覆盖变量，triangle 仅改变显示                                         |
| `pairPlot`              | 无专属更名                                                                              | variables 仍表示顺序；data 仅保留 observations，删除 data.diagonal 与公开 PairPlotBin；可选顶层 diagonal 配置展示方式 |
| `timeSeriesPlot`        | 无专属更名                                                                              | time/value/lower/upper、interval；time 为带时区 ISO 8601，null 明确断线                                               |
| `seasonalPlot`          | period → phase、season → cycle、periodOrder → phaseOrder；新增必填 cycleOrder           | value/series、layout=overlay/subseries；分组和时间方向见下文“季节图”                                                  |
| `autocorrelationPlot`   | `data[].value` → `correlation`                                                          | lag、method=acf/pacf、interval；不额外将无偏估计强行裁剪到 [-1,1]                                                     |
| `screePlot`             | 无专属更名                                                                              | component/explainedVarianceRatio、showCumulative；布尔选项已经表达显示开关                                            |
| `embeddingPlot`         | 无专属更名                                                                              | id/x/y、method、dimensions；explainedVarianceRatio 仅 PCA 可用，避免 method 对应三份重复 Spec                         |
| `residualPlot`          | `data[].fitted` → `fittedValue`                                                         | id/residual、residualKind；明确为拟合值，不暗示包含所有残差诊断                                                       |
| `qqPlot`                | theoretical → theoreticalQuantile、observed → sampleQuantile；reference → referenceLine | distribution；referenceLine.method/intercept/slope 保留；理论与样本分位数方向明确                                     |
| `confusionMatrix`       | normalization 枚举 true → actual；新增 fieldLabels.proportion                           | normalization 的 none/predicted/all 保留，默认 none；actual/predicted/count 保留，分母与数据字段用语一致              |
| `rocCurve`              | 无专属更名                                                                              | fpr/tpr/threshold、metrics[].series/auc；保留常见领域缩写                                                             |
| `precisionRecallCurve`  | `prevalence` → `positiveRate`                                                           | recall/precision/threshold、metrics[].averagePrecision；正例比例为 0–1 的显式参考线数值，不是让用户传基线模型         |
| `calibrationCurve`      | `meanPredicted` → `meanPredictedProbability`                                            | observedRate/binStart/binEnd/count/lower/upper、interval；observedRate 明确表示实际正例比例                           |
| `learningCurve`         | 无专属更名                                                                              | trainSize/split/score、metric、interval；trainSize 是训练样本数，split=train/validation，不能填 epoch                 |
| `featureImportancePlot` | 无专属更名                                                                              | feature/importance/lower/upper、method、interval；保留负重要性与外部计算方法                                          |
| `shapBeeswarmPlot`      | 无专属更名                                                                              | id/feature/shapValue/featureValue、featureOrder；featureValue 可为 null，原值不转换成 SHAP 值                         |

## 季节图

旧 period（如 Q1）改为 phase，旧 season（如 2024）改为 cycle。新增必填 cycleOrder，periodOrder 改为 phaseOrder；两者都需要由调用方显式指定。

旧 subseries 按年分面；新 subseries 按季度分面、横轴为年份。相同数据产生不同面板，这是语义修复。缺少位置按显式顺序断线，不补零或插值。

## 迁移示例

旧输入：

```json
{
  "type": "count",
  "normalization": "proportion",
  "labels": { "category": "客户类型" },
  "data": [
    { "category": "A", "count": 3 },
    { "category": "B", "count": 7 }
  ]
}
```

新输入：

```json
{
  "type": "countPlot",
  "statistic": "proportion",
  "fieldLabels": { "category": "客户类型", "proportion": "客户占比" },
  "data": [
    { "category": "A", "count": 3 },
    { "category": "B", "count": 7 }
  ]
}
```

countPlot 的比例仍由已有计数归一化；histogram 先对原始观测分箱再归一化。完整新契约见 [Spec 协议](spec.md)，自然语言选型见 [目录](catalog.md)。

## Histogram 原始观测迁移（2026-10-08）

旧 `data:[{binStart,binEnd,count,series?}]` 直接拒绝；新输入每行仅包含一个原始 value，不支持 series。库在 compileStatPlot 中确定边界、计数并换算 statistic，默认 count。

```json
{
  "type": "histogram",
  "binning": { "binCount": 2 },
  "statistic": "density",
  "data": [{ "value": 0 }, { "value": 1 }, { "value": 2 }, { "value": 3 }, { "value": 4 }]
}
```

binning 可省略，默认箱数只依赖样本量；显式 binCount 为 1–200 的整数。空数据、恒定值、零频次箱及浮点支持范围见[直方图契约](plots/histogram.md)。只有聚合结果时使用 VChart 原生 histogram；聚合数据无法恢复原始样本，不应按 count 重复展开伪造观测。

## pairPlot 对角分布迁移

直接删除 `data.diagonal`，保留原始 `data.observations` 和 `variables`；无需重新提供箱边界/count。旧字段报 SCHEMA_ERROR `/data/diagonal`，公开 `PairPlotBin` 已删除。可选顶层 `diagonal` 只控制展示：`{"type":"histogram","binning":{"binCount":20}}` 或 `{"type":"none"}`。省略为内部自动分箱。只有旧 bins 而没有原始观测时，不能还原两两散点；不得伪造观测。

## 箱线图原始输入

boxPlot 不再接收五数摘要或异常值数组。提供完整原始 `{category,value,series?}` 观测，按 category + series 独立计算；须规则说明字符串改为实际配置 `whiskers.iqrMultiplier`，默认 1.5。四分位数采用 vutils 的线性插值；小样本须不向箱体内反向延伸，必要时取 Q1 / Q3。仅有预计算摘要的调用方使用原生 VChart boxPlot，不能从摘要构造伪造样本。

## violinPlot 原始样本迁移

删除公共 density，提供原始 category / value / series；可用 estimation.kernel / bandwidth 和 sampling.points 控制估计及轮廓绘制。旧密度采样点不能作为原始观测；不能从预计算轮廓反推完整样本。单样本和常数组须显式指定正带宽。详见[小提琴图契约](plots/violinPlot.md)。

## 原始观测迁移（2026-10-09）

| 图                   | 删除的公共输入                                    | 当前输入 / 配置                                         |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| countPlot            | count、proportion                                 | category/series；normalizationScope=all 默认            |
| confusionMatrix      | count                                             | actual/predicted 类别；classOrder 可选                  |
| rocCurve             | fpr/tpr/threshold/metrics                         | actual:boolean、score；内部 AUC                         |
| precisionRecallCurve | recall/precision/threshold/metrics/positiveRate   | actual:boolean、score；内部 AP，baseline:boolean        |
| calibrationCurve     | 箱统计、lower/upper/interval                      | actual:boolean、probability；binning                    |
| qqPlot               | 分位数、外部 slope/intercept、字符串 distribution | value/series；distribution 正态参数，referenceLine 枚举 |
| autocorrelationPlot  | lag/correlation/lower/upper/interval              | 按序 value/series；method/maxLag/confidence             |

旧数据直接报错，没有兼容推断。持有统计结果而没有原始观测时，改用对应 VChart 原生图表；不能伪造样本。count 的历史系列内比例须显式设置 normalizationScope=series。QQ 当前只支持正态；ACF/PACF 固定估计口径，不能仅给方法名就视为兼容任意 Python 默认值。
