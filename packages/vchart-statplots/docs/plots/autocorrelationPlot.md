# 自相关图 `autocorrelationPlot`

查看时间序列各滞后阶的自相关。

method 必须明确为 acf 或 pacf。lag 是非负整数；correlation 保留原计算结果，无偏估计允许超出 [-1,1]，不能套用相关矩阵的范围限制。

## 输入与配置

语义输入字段：`lag`、`correlation`、`lower`、`upper`。字段、必填项和单位以 [JSON Schema](../../schema/plots/autocorrelationPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`method`、`interval`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/autocorrelationPlot.json)；[完整主例](../../examples/specs/autocorrelationPlot.json)。

## 选型边界

- 偏自相关需 method=pacf
- 要求库内计算相关量
