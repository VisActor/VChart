# 缺失值矩阵图 `missingValueMatrix`

检查每条观测各变量的缺失位置。

必须显式给出所有 observationId×variable 单元格；未提供不代表 isMissing=false。保留输入顺序。

## 输入与配置

语义输入字段：`observationId`、`variable`、`isMissing`。字段、必填项和单位以 [JSON Schema](../../schema/plots/missingValueMatrix.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/missingValueMatrix.json)；[完整主例](../../examples/specs/missingValueMatrix.json)。

## 选型边界

- 缺失率柱状图
- 缺失相关性矩阵
