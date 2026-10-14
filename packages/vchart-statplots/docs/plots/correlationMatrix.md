# 相关矩阵 `correlationMatrix`

从原始数值表格计算变量间的相关方向和强度。

## 输入与计算

必填 `variables: string[]` 与 `data: {observations: [{id, values}]}`，表格键集、观测 id 和顺序契约与 [缺失矩阵](missingValueMatrix.md) 一致，values 只允许有限数字或 null。variables 同时定义变量集合与显示顺序。

`method` 默认 pearson，可选 spearman、kendall（tau-b）；`minSamples` 默认 2，必须为至少 2 的整数。每个变量对独立排除任一端为 null 的观测，Spearman 在该配对子集中重新计算平均秩，Kendall 正确处理并列值。常量或有效配对样本不足显示 NA，包括退化对角；有效非退化对角为 1。Tooltip 展示有效配对数及 NA 原因。

只计算半个矩阵再镜像；`triangle` 默认 full，可选 upper/lower，只控制显示。保持紧密方形单元格与固定 [-1,1] 色标，主题和颜色配置沿用公共契约。空观测不产生矩阵或色标。

```json
{"type":"correlationMatrix","variables":["height","weight"],"method":"spearman","data":{"observations":[{"id":"1","values":{"height":170,"weight":60}},{"id":"2","values":{"height":180,"weight":null}},{"id":"3","values":{"height":190,"weight":80}}]}}
```

## 迁移与 Python 对照

删除原 row/column/correlation 结果行和 `variableOrder`，改为 variables/observations。method 现在选择真实算法。与 pandas.corr 的逐对缺失处理对齐，Kendall 对照 SciPy tau-b；本包全部方法统一应用 minSamples，退化对角统一为 NA，与部分 pandas 方法强制对角为 1 的边界不同。不计算 p-value。

Pearson O(N)，Spearman/Kendall O(N log N)，矩阵计算随变量对数量增长；先选择需要比较的变量。

[最小示例](../../examples/specs/minimal/correlationMatrix.json)；[Schema](../../schema/plots/correlationMatrix.schema.json)。
