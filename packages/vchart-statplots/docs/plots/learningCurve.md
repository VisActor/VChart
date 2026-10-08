# 学习曲线 `learningCurve`

比较训练样本数变化时的训练与验证分数。

trainSize 是训练样本数，split 区分 train 与 validation。metric 说明分数含义；不是 epoch–loss 或超参数验证曲线。

## 输入与配置

语义输入字段：`trainSize`、`split`、`score`、`lower`、`upper`。字段、必填项和单位以 [JSON Schema](../../schema/plots/learningCurve.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`metric`、`interval`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/learningCurve.json)；[完整主例](../../examples/specs/learningCurve.json)。

## 选型边界

- epoch–loss 曲线
- 超参数验证曲线
