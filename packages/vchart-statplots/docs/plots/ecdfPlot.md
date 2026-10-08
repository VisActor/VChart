# 经验累积分布图 `ecdfPlot`

比较样本的累计概率与尾部。

cumulativeProbability 为 0–1 的累计概率，随 value 单调非递减；使用右连续阶梯。

## 输入与配置

语义输入字段：`value`、`cumulativeProbability`。字段、必填项和单位以 [JSON Schema](../../schema/plots/ecdfPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/ecdfPlot.json)；[完整主例](../../examples/specs/ecdfPlot.json)。

## 选型边界

- 概率密度
- 普通分箱频数
