# 降维散点图 `embeddingPlot`

[TS 类型](../types/plots/embedding/types.d.ts) · [最小输入](../examples/specs/minimal/embeddingPlot.json) · [公共约束](common.md)

展示已计算的二维降维坐标。

method 为 pca、tsne 或 umap；输入已计算坐标。dimensions 的解释方差仅 PCA 可用。fieldLabels 优先覆盖轴显示，不改变元数据。

## 输入与配置

语义输入字段：`id`、`x`、`y`。字段、必填项和单位以 [TS 类型](../types/plots/embedding/types.d.ts) 为准；未知属性会被拒绝。

## 选型边界

- PCA 载荷图
- 仅给原始高维数据
