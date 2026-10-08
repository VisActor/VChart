# 核密度估计图 `kdePlot`

比较已计算的一维核密度曲线。

density 不是概率，峰值可以大于 1；不做插值平滑或重新估计带宽。

## 输入与配置

语义输入字段：`value`、`density`。字段、必填项和单位以 [JSON Schema](../../schema/plots/kdePlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`estimation`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/kdePlot.json)；[完整主例](../../examples/specs/kdePlot.json)。

## 选型边界

- 二维密度图
- 需要库内估计 KDE
