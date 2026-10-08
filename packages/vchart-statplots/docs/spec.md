# Spec 协议

输入为纯 JSON。type 使用 lowerCamelCase 规范图表名，data 使用固定语义字段；不接受 xField、encoding、回调和原生配置透传。TypeScript、分图 Schema 与 standalone 校验器保持一致。旧接口见 [迁移表](naming-migration.md)。

## 公共配置

| 字段 | 含义 |
| --- | --- |
| type / data | 必填，类型和对应预计算数据；pairPlot 使用 observations/diagonal 对象 |
| title / description | 标题及数据范围、统计方法说明 |
| theme | VChart 原生 light（默认）或 dark |
| colors | 共用 categorical / sequential / diverging，支持名称与色号数组；见[公共配色](colors.md) |
| fieldLabels | 该图允许的字段展示名，供轴和 tooltip 使用；不控制图元标签 |
| 行级 series | 比较系列，同一表全部提供非空系列名或全部省略 |

观测 id 为字符串，category 为类别。缺失值只在明确允许 null 的字段中接受。数值必须有限，不接受数值字符串；未知字段、NaN、Infinity 不做静默归一化。缺少下界或上界时不能推断另一端。

## 区间与外部方法

```json
{"kind":"confidence","level":0.95}
```

confidence、prediction、credible 要求 0 < level < 1；standardError、standardDeviation 要求 multiplier > 0；range 不接受 level 或 multiplier。lower/upper 同时提供且 lower ≤ upper；不预设为 95% 置信区间。

method、metric、distribution、estimation 是已有结果的说明；修改这些配置不会重新拟合或估计。referenceLine 只在明确提供时绘制，ROC/校准对角线、残差/SHAP 零线等由图义确定的参考线继续内置。

## 显示统计量与默认值

| 选项 | 默认值及含义 |
| --- | --- |
| countPlot.statistic | count；proportion 为系列内计数比例 |
| histogram.statistic | count；proportion 为系列内比例，density 的柱面积和为 1；不等宽箱必须 density |
| violinPlot.densityNormalization | width 等最大宽度；area 等面积 |
| stripPlot.layout / jitterRatio | strip；jitter 布局最大偏移比例默认 0.3，范围 0–0.5 |
| pointIntervalPlot.valueScale | linear；log 的估计、区间和参考值必须为正 |
| correlationMatrix.triangle | full；输入仍须完整对称 |
| correlationMatrix.variableOrder | 数据中变量首次出现顺序；显式数组须完整且无重复 |
| confusionMatrix.normalization | none；actual 按实际类别、predicted 按预测类别、all 按全部计数归一化 |
| seasonalPlot.layout | overlay；subseries 按 phase 分面、横轴 cycle |
| screePlot.showCumulative | false |

statistic 只选择已有计数的显示形式。countPlot、histogram 的归一化在各 series 内独立进行；零总量无法定义比例/密度，相关归一化图形不绘制。混淆矩阵的零分母显示 NA。fieldLabels.proportion 改变名称，不改变数值单位。

seasonalPlot 的 cycleOrder 与 phaseOrder 必填、非空、不重复，覆盖数据；可声明无观测的位置，缺口断线。pairedComparisonPlot.categoryOrder 必须是两个不同类别；同一对象以 id 连接。

## API 与错误

validateStatPlot(unknown) 返回 `{valid:true,errors:[]}` 或 `{valid:false,errors:[{code,path,message}]}`。path 是 JSON Pointer；未知字段和旧名称报 SCHEMA_ERROR，数值关系按 INVALID_RANGE、INVALID_ORDER、DUPLICATE_KEY、INCONSISTENT_SERIES、UNSUPPORTED_COMBINATION 分类。错误路径使用新字段。

compileStatPlot(spec) 使用相同校验，失败抛出 StatPlotValidationError，其 issues 保留结构化错误；成功返回原生 VChart ISpec。存储与传输使用原始语义 JSON。输入保持归调用方所有，不被修改。

registerStatPlots() 幂等注册专用系列。生命周期、事件和导出复用 VChart；更新使用 `chart.updateSpec(compileStatPlot(nextSpec))`。不承诺直接 updateData 后统计约束仍成立。

空数据保留标题并显示“暂无可绘制数据”；默认关闭动画。pairPlot 的面板数随变量数平方增长，调用方应先选变量，必要抽样由计算端明确记录。
