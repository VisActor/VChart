# 季节图 `seasonalPlot`

比较不同年份的季度形状。

cycle 是年份等完整周期，phase 是季度等周期内位置。两份 Order 必须非空、不重复并覆盖数据，可声明无观测的位置。overlay 横轴为 phase；subseries 按 phase 分面、横轴为 cycle。两种布局都按显式顺序断线，缺口不补零。

## 输入与配置

语义输入字段：`value`、`cycle`、`phase`。字段、必填项和单位以 [JSON Schema](../../schema/plots/seasonalPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`phaseOrder`、`cycleOrder`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/seasonalPlot.json)；[完整主例](../../examples/specs/seasonalPlot.json)。

## 选型边界

- 没有周期和周期内位置
- 缺少明确顺序
