# 箱线图 `boxPlot`

比较组间四分位数、中位数与异常值。

whiskerRule 必填；whiskerLower/High 是须端点，不一定是样本极值。outliers 由计算端判定。

## 输入与配置

语义输入字段：`category`、`whiskerLower`、`q1`、`median`、`q3`、`whiskerUpper`、`outliers`。字段、必填项和单位以 [JSON Schema](../../schema/plots/boxPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`whiskerRule`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/boxPlot.json)；[完整主例](../../examples/specs/boxPlot.json)。

## 选型边界

- 没有须规则
- 将最小最大值直接当作箱须
