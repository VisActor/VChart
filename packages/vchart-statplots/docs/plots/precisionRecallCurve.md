# PR 曲线 `precisionRecallCurve`

比较不同阈值的精确率与召回率。

positiveRate 是 0–1 的正例比例参考线。averagePrecision 必须由计算端提供，不能用画出的折线面积替代。

## 输入与配置

语义输入字段：`recall`、`precision`。字段、必填项和单位以 [JSON Schema](../../schema/plots/precisionRecallCurve.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`positiveRate`、`metrics`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/precisionRecallCurve.json)；[完整主例](../../examples/specs/precisionRecallCurve.json)。

## 选型边界

- 单个指标
- 把 AP 当作梯形积分面积
