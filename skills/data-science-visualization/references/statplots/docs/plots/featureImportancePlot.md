# 特征重要性图 `featureImportancePlot`

比较给定方法算出的各特征重要性。

method 必填，按输入特征顺序显示，保留负值。重要性不等于因果效应；区间由计算端提供。

## 输入与配置

语义输入字段：`feature`、`importance`、`lower`、`upper`。字段、必填项和单位以 [JSON Schema](../../schema/plots/featureImportancePlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`method`、`interval`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/featureImportancePlot.json)；[完整主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/featureImportancePlot.json)。

## 选型边界

- 据重要性直接推断因果
- 逐观测 SHAP 分布
