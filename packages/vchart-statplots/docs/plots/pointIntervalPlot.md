# 点估计区间图 `pointIntervalPlot`

从分组样本估计区间，或展示外部模型已计算的区间。必填 input 明确区分用途，不根据字段猜测。

## 原始样本

`input: "observations"`，data 为 `{category, value, series?}[]`，按 category + series 独立计算。estimator 默认 mean，可选 median。

errorBar 省略时使用 `{kind:"confidence",level:0.95,resamples:1000,seed:0}`：组内有放回重采样，每次 N 条，取估计值分布的线性插值分位数。resamples 必须为 100–10000 整数，seed 为 uint32；每组样本先排序并独立初始化同一个种子，输入行和分组顺序不影响结果。

| errorBar | 含义 |
| --- | --- |
| false | 只显示估计点 |
| confidence | percentile bootstrap 置信区间，level 默认 0.95 |
| percentile | 原始样本百分位区间，level 默认 0.95 |
| standardDeviation | 样本标准差，分母 N−1，multiplier 默认 1 |
| standardError | SD/sqrt(N)，仅允许 mean，multiplier 默认 1 |
| range | 样本最小值与最大值 |

level 严格在 (0,1)，multiplier 有限且大于 0。N=1 时 CI/SD/SE 无法计算，保留估计点但不绘制区间与端帽；percentile/range 可退化为点，常数组为零宽区间。log 轴在生成结果后检查估计值和端点为正，非法结果报告结构化错误，不截断区间。

```json
{"type":"pointIntervalPlot","input":"observations","errorBar":{"kind":"standardError"},"data":[{"category":"A","value":1},{"category":"A","value":3}]}
```

## 外部估计

`input: "estimates"`，data 为 `{category, estimate, lower, upper, series?}[]`，interval 必填，保留 confidence/prediction/credible/SD/SE/range 的外部语义。禁止 estimator/errorBar。estimate 可以位于区间外，lower ≤ upper。referenceLine 仅显式提供时绘制，不默认假定 0 或 1。

迁移原结果数据只需增加 input=estimates；无 input 会拒绝。原始样本用途与 Seaborn pointplot 对齐，但本包使用自己的确定性 LCG，同 seed 不承诺与 NumPy/Seaborn 逐点相同。percentile 是样本百分位区间，不是模型预测区间。

bootstrap mean 为 O(BN)，median 为 O(BN log N)；大样本请明确选择估计器、区间和重采样次数，不做隐式抽样。

[最小示例](../../examples/specs/minimal/pointIntervalPlot.json)；[Schema](../../schema/plots/pointIntervalPlot.schema.json)。
