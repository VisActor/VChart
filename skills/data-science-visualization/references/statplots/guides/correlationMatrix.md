# 相关矩阵 `correlationMatrix`

[TS 类型](../types/plots/correlation-matrix/types.d.ts) · [最小输入](../examples/specs/minimal/correlationMatrix.json) · [公共约束](common.md)

从原始数值表格计算变量间的相关方向和强度。

## 输入与计算

必填 `variables: string[]` 与 `data: {observations: [{id, values}]}`，表格键集、观测 id 和顺序契约与 [缺失矩阵](missingValueMatrix.md) 一致，values 只允许有限数字或 null。variables 同时定义变量集合与显示顺序。

`method` 默认 pearson，可选 spearman、kendall（tau-b）；`minSamples` 默认 2，必须为至少 2 的整数。每个变量对独立排除任一端为 null 的观测，Spearman 在该配对子集中重新计算平均秩，Kendall 正确处理并列值。常量或有效配对样本不足显示 NA，包括退化对角；有效非退化对角为 1。Tooltip 展示有效配对数及 NA 原因。

只计算半个矩阵再镜像；`triangle` 默认 full，可选 upper/lower，只控制显示。保持紧密方形单元格与固定 [-1,1] 色标，主题和颜色配置沿用公共契约。空观测不产生矩阵或色标。
