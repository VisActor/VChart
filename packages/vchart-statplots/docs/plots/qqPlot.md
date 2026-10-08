# Q–Q 图 `qqPlot`

比较样本分位数与给定理论分布分位数。

横轴 theoreticalQuantile，纵轴 sampleQuantile。distribution 必须说明理论分布；referenceLine 的斜率、截距由外部提供。不是 P–P 图或两样本 Q–Q。

## 输入与配置

语义输入字段：`theoreticalQuantile`、`sampleQuantile`。字段、必填项和单位以 [JSON Schema](../../schema/plots/qqPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`distribution`、`referenceLine`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/qqPlot.json)；[完整主例](../../examples/specs/qqPlot.json)。

## 选型边界

- P–P 图
- 两样本 Q–Q
- 缺少理论分布说明
