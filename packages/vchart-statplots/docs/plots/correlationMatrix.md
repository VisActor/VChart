# 相关矩阵图 `correlationMatrix`

比较多个变量的相关方向和强度。

correlation 为 [-1,1] 或 null；矩阵必须完整对称。variableOrder 恰好包含每个变量一次；triangle 仅影响显示，默认 full。

## 输入与配置

语义输入字段：`row`、`column`、`correlation`。字段、必填项和单位以 [JSON Schema](../../schema/plots/correlationMatrix.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`method`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/correlationMatrix.json)；[完整主例](../../examples/specs/correlationMatrix.json)。

## 选型边界

- 任意数值矩阵
- 缺失状态矩阵
