# 类别计数图 `countPlot`

比较各客户类别有多少条观测。

statistic 默认为 count；proportion 按同一 series 的计数总和归一化。输入仍为非负整数计数；总计数为零的系列没有可定义的比例。fieldLabels.proportion 同时用于轴与 tooltip。

## 输入与配置

语义输入字段：`category`、`count`。字段、必填项和单位以 [JSON Schema](../../schema/plots/countPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/countPlot.json)；[完整主例](../../examples/specs/countPlot.json)。

## 选型边界

- 任意数值柱状图
- 各组均值
- 连续变量分箱
