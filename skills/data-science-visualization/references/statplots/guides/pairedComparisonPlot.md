# 配对比较图 `pairedComparisonPlot`

[TS 类型](../types/plots/paired/types.d.ts) · [最小输入](../examples/specs/minimal/pairedComparisonPlot.json) · [公共约束](common.md) · [完整文档](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/docs/plots/pairedComparisonPlot.md)

比较同一对象干预前后的两次观测。

categoryOrder 明确前后顺序，按 id 连接；缺一侧仍显示单点。连接方向不表示因果。

## 输入与配置

语义输入字段：`id`、`category`、`value`。字段、必填项和单位以 [TS 类型](../types/plots/paired/types.d.ts) 为准；未知属性会被拒绝。

## 选型边界

- 多个变量的两两散点矩阵
- 超过两个状态
