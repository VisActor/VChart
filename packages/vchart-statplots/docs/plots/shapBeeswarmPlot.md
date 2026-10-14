# SHAP 蜂群图 `shapBeeswarmPlot`

查看各特征逐观测的 SHAP 贡献与特征值。

x=shapValue，颜色=该特征内相对 featureValue；不可混用两者。缺失值灰色，常量中性灰色。唯一键是 (id,feature)，只接受数值特征值。

## 输入与配置

语义输入字段：`id`、`feature`、`shapValue`、`featureValue`。字段、必填项和单位以 [JSON Schema](../../schema/plots/shapBeeswarmPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`featureOrder`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/shapBeeswarmPlot.json)；[完整主例](../../examples/specs/shapBeeswarmPlot.json)。

## 选型边界

- 普通蜂群图
- 只提供聚合重要性
