# 混淆矩阵 `confusionMatrix`

检查实际类别与预测类别的错误分布。

normalization 默认为 none；actual 按实际类别计数合计作分母，predicted 按预测类别，all 按全部计数。零分母显示 NA。

## 输入与配置

语义输入字段：`actual`、`predicted`、`count`。字段、必填项和单位以 [JSON Schema](../../schema/plots/confusionMatrix.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/confusionMatrix.json)；[完整主例](../../examples/specs/confusionMatrix.json)。

## 选型边界

- 未提供完整类别组合计数
