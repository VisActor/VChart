# 小提琴图 `violinPlot`

比较不同组预计算密度的分布形状。

width 按各组峰值归一；area 按给定密度梯形面积归一。密度始终原样保存，tooltip 显示该组采样范围及原始密度的峰值。宽度不表示样本数。

## 输入与配置

语义输入字段：`category`、`value`、`density`。字段、必填项和单位以 [JSON Schema](../../schema/plots/violinPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/violinPlot.json)；[完整主例](../../examples/specs/violinPlot.json)。

## 选型边界

- 只有五数概括
- 没有密度采样
