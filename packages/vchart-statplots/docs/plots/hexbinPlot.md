# 六边形分箱图 `hexbinPlot`

展示已计算的六边形分箱计数。

每箱必须给六个有序数据坐标顶点；检查非退化凸多边形。面积来自真实边界，颜色表示 count，绝不按 count 改符号尺寸。

## 输入与配置

语义输入字段：`id`、`count`、`vertices`。字段、必填项和单位以 [JSON Schema](../../schema/plots/hexbinPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/hexbinPlot.json)；[完整主例](../../examples/specs/hexbinPlot.json)。

## 选型边界

- 只有原始散点，没有六边形顶点与计数
