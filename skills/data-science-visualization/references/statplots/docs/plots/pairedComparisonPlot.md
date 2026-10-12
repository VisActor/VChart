# 配对比较图 `pairedComparisonPlot`

比较同一对象干预前后的两次观测。

categoryOrder 明确前后顺序，按 id 连接；缺一侧仍显示单点。连接方向不表示因果。

## 输入与配置

语义输入字段：`id`、`category`、`value`。字段、必填项和单位以 [JSON Schema](../../schema/plots/pairedComparisonPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`categoryOrder`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/pairedComparisonPlot.json)；[完整主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/pairedComparisonPlot.json)。

## 选型边界

- 多个变量的两两散点矩阵
- 超过两个状态
