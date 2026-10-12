# 碎石图 `screePlot`

[TS 类型](../types/plots/scree/types.d.ts) · [最小输入](../examples/specs/minimal/screePlot.json) · [公共约束](common.md) · [完整文档](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/docs/plots/screePlot.md)

查看各成分解释方差比例。

explainedVarianceRatio 输入 0–1，比率和不超过 1（容忍 1e-10 浮点误差）；累计线只做求和，不重新分解数据。

## 输入与配置

语义输入字段：`component`、`explainedVarianceRatio`。字段、必填项和单位以 [TS 类型](../types/plots/scree/types.d.ts) 为准；未知属性会被拒绝。

## 选型边界

- PCA 得分散点
- 载荷矩阵
