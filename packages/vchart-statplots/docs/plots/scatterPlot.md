# 散点图 `scatterPlot`

查看两个数值变量的关系。

fit 的 method、曲线和区间由外部计算；带状区间必须有 interval。不会根据散点自动拟合。

## 输入与配置

语义输入字段：`id`、`x`、`y`。字段、必填项和单位以 [JSON Schema](../../schema/plots/scatterPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/scatterPlot.json)；[完整主例](../../examples/specs/scatterPlot.json)。

## 选型边界

- 需要库内拟合
- 分类轴蜂群布局
