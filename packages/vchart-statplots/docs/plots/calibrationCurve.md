# 概率校准曲线 `calibrationCurve`

检查预测概率与实际正例比例是否一致。

meanPredictedProbability 是分箱内平均预测概率，observedRate 是该箱实际正例比例；二者范围为 0–1。箱内计数必须大于零。

## 输入与配置

语义输入字段：`binStart`、`binEnd`、`meanPredictedProbability`、`observedRate`、`lower`、`upper`、`count`。字段、必填项和单位以 [JSON Schema](../../schema/plots/calibrationCurve.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`interval`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/calibrationCurve.json)；[完整主例](../../examples/specs/calibrationCurve.json)。

## 选型边界

- 要求重新校准模型
- 没有分箱统计
