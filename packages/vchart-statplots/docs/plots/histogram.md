# 直方图 `histogram`

查看连续变量的分箱分布和尾部。

statistic 默认为 count；proportion 的柱高之和为 1；density 的柱面积之和为 1。不等宽箱必须显式使用 density。归一化在同一 series 内进行；零总量不产生有效归一化柱。

## 输入与配置

语义输入字段：`binStart`、`binEnd`、`count`。字段、必填项和单位以 [JSON Schema](../../schema/plots/histogram.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/histogram.json)；[完整主例](../../examples/specs/histogram.json)。

## 选型边界

- 类别频数比较
- 没有分箱结果
