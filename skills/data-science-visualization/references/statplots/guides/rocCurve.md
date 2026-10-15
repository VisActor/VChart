# ROC 曲线 `rocCurve`

[TS 类型](../types/plots/roc/types.d.ts) · [最小输入](../examples/specs/minimal/rocCurve.json) · [公共约束](common.md) · [完整文档](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/docs/plots/rocCurve.md)

`data: [{actual: boolean, score: number, series?}]`，true 表示正类；score 是有限分数，越大越倾向正类，不要求位于 [0,1]。

## 计算与配置

- 每系列必须同时有正负样本；任意输入顺序有效，按分数降序计算，完全相同的分数作为一个阈值处理。
- 起点 (0,0) 没有有限 threshold，不填写 Infinity；其后保留全部不同的有限阈值，终点为 (1,1)。不丢弃共线阈值点，不平滑。
- 库以完整 ROC 梯形积分计算每系列 AUC，并在 tooltip 展示阈值、AUC、样本数。两轴固定 [0,1]，保留随机分类对角线。
- 不接收 fpr/tpr/threshold/metrics。模型训练、标签映射和缺失清洗由调用方完成。
