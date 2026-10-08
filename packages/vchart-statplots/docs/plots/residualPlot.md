# 残差图 `residualPlot`

检查残差随拟合值变化是否存在结构。

residualKind 必须说明 raw/standardized/studentized；不在渲染端标准化，不连接散点。

## 输入与配置

语义输入字段：`id`、`fittedValue`、`residual`。字段、必填项和单位以 [JSON Schema](../../schema/plots/residualPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`residualKind`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/residualPlot.json)；[完整主例](../../examples/specs/residualPlot.json)。

## 选型边界

- 残差直方图
- 残差 Q–Q 图
