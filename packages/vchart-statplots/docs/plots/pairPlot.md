# 散点矩阵图 `pairPlot`

同时查看多个变量两两关系及对角分布。

values 仅包含 variables 声明的键，缺失为 null。每面板按相关变量排除缺失，并显示 n；同变量共享域。对角分箱须与观测数逐箱一致，采用 [start,end)，最后一箱含 end。框选按 id 联动。n 指全部输入中的有效观测数；分组图例用于说明颜色，不过滤数据。

## 输入与配置

语义输入字段：`data.observations`、`data.diagonal` 与有序 `variables`。字段、必填项和单位以 [JSON Schema](../../schema/plots/pairPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`variables`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。此图不提供 fieldLabels，变量名称由 variables 明确指定，顺序即面板顺序。

[最小示例](../../examples/specs/minimal/pairPlot.json)；[完整主例](../../examples/specs/pairPlot.json)。

## 选型边界

- 同一对象前后两次配对比较
