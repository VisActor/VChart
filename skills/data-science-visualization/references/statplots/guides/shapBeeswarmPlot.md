# SHAP 蜂群图 `shapBeeswarmPlot`

[TS 类型](../types/plots/shap-beeswarm/types.d.ts) · [最小输入](../examples/specs/minimal/shapBeeswarmPlot.json) · [公共约束](common.md) · [完整文档](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/docs/plots/shapBeeswarmPlot.md)

查看各特征逐观测的 SHAP 贡献与特征值。

x=shapValue，颜色=该特征内相对 featureValue；不可混用两者。缺失值灰色，常量中性灰色。唯一键是 (id,feature)，只接受数值特征值。

## 输入与配置

语义输入字段：`id`、`feature`、`shapValue`、`featureValue`。字段、必填项和单位以 [TS 类型](../types/plots/shap-beeswarm/types.d.ts) 为准；未知属性会被拒绝。

## 选型边界

- 普通蜂群图
- 只提供聚合重要性
