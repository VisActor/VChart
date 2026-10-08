# 点估计区间图 `pointIntervalPlot`

比较各组点估计与已经计算的区间。

区间含义必须显式声明；estimate 可以落在区间外。log 轴要求估计、端点和参考值为正；referenceLine 不自动假定 0 或 1。

## 输入与配置

语义输入字段：`category`、`estimate`、`lower`、`upper`。字段、必填项和单位以 [JSON Schema](../../schema/plots/pointIntervalPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`interval`、`referenceLine`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/pointIntervalPlot.json)；[完整主例](../../examples/specs/pointIntervalPlot.json)。

## 选型边界

- 完整 meta 分析森林图
- 缺少区间定义
