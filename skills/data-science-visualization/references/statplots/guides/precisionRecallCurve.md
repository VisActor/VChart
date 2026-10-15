# PR 曲线 `precisionRecallCurve`

[TS 类型](../types/plots/precision-recall/types.d.ts) · [最小输入](../examples/specs/minimal/precisionRecallCurve.json) · [公共约束](common.md) · [完整文档](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/docs/plots/precisionRecallCurve.md)

`data: [{actual: boolean, score: number, series?}]`，与 ROC 使用相同的二分类原始输入；每系列至少一个正样本，全正允许，全负拒绝。

## 计算与配置

- 从 (recall=0, precision=1) 开始，按分数降序合并同分阈值，保留同召回率的点。无阈值起点不填 Infinity。
- 图线采用 stepBefore。AP = Σ(本次召回率 − 上次召回率) × 本次精确率，不用梯形面积替代；tooltip 显示库计算的 AP、样本数、正例率。
- `baseline` 默认 false；true 按系列生成 positiveCount / sampleCount 水平线。基线与对应曲线颜色一致，图例同时过滤二者。
- 不接收 recall/precision/threshold/metrics/positiveRate。
