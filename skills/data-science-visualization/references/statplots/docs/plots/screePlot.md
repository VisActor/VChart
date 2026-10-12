# 碎石图 `screePlot`

查看各成分解释方差比例。

explainedVarianceRatio 输入 0–1，比率和不超过 1（容忍 1e-10 浮点误差）；累计线只做求和，不重新分解数据。

## 输入与配置

语义输入字段：`component`、`explainedVarianceRatio`。字段、必填项和单位以 [JSON Schema](../../schema/plots/screePlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/screePlot.json)；[完整主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/screePlot.json)。

## 选型边界

- PCA 得分散点
- 载荷矩阵
