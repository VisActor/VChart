# 特征重要性图 `featureImportancePlot`

[TS 类型](../types/plots/feature-importance/types.d.ts) · [最小输入](../examples/specs/minimal/featureImportancePlot.json) · [公共约束](common.md)

比较给定方法算出的各特征重要性。

method 必填，按输入特征顺序显示，保留负值。重要性不等于因果效应；区间由计算端提供。

## 输入与配置

语义输入字段：`feature`、`importance`、`lower`、`upper`。字段、必填项和单位以 [TS 类型](../types/plots/feature-importance/types.d.ts) 为准；未知属性会被拒绝。

## 选型边界

- 据重要性直接推断因果
- 逐观测 SHAP 分布
