# 条带图 `stripPlot`

查看各类别中每条观测的数值。

layout 默认为 strip；jitterRatio 仅用于 jitter 布局，表示最大偏移占完整分类带宽的比例（0–0.5，默认 0.3）。蜂群必须显式 layout=swarm；布局按 id 确定，不修改原始数值。

## 输入与配置

语义输入字段：`id`、`category`、`value`。字段、必填项和单位以 [JSON Schema](../../schema/plots/stripPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/stripPlot.json)；[完整主例](../../examples/specs/stripPlot.json)。

## 选型边界

- 只有汇总统计
- SHAP 贡献
