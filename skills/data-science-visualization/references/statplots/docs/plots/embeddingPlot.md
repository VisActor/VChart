# 降维散点图 `embeddingPlot`

展示已计算的二维降维坐标。

method 为 pca、tsne 或 umap；输入已计算坐标。dimensions 的解释方差仅 PCA 可用。fieldLabels 优先覆盖轴显示，不改变元数据。

## 输入与配置

语义输入字段：`id`、`x`、`y`。字段、必填项和单位以 [JSON Schema](../../schema/plots/embeddingPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`method`、`dimensions`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/embeddingPlot.json)；[完整主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/embeddingPlot.json)。

## 选型边界

- PCA 载荷图
- 仅给原始高维数据
