# PR 曲线 `precisionRecallCurve`

`data: [{actual: boolean, score: number, series?}]`，与 ROC 使用相同的二分类原始输入；每系列至少一个正样本，全正允许，全负拒绝。

## 计算与配置

- 从 (recall=0, precision=1) 开始，按分数降序合并同分阈值，保留同召回率的点。无阈值起点不填 Infinity。
- 图线采用 stepBefore。AP = Σ(本次召回率 − 上次召回率) × 本次精确率，不用梯形面积替代；tooltip 显示库计算的 AP、样本数、正例率。
- `baseline` 默认 false；true 按系列生成 positiveCount / sampleCount 水平线。基线与对应曲线颜色一致，图例同时过滤二者。
- 不接收 recall/precision/threshold/metrics/positiveRate。

## 示例

```json
{
  "type": "precisionRecallCurve",
  "data": [
    {
      "actual": false,
      "score": 0.1
    },
    {
      "actual": false,
      "score": 0.4
    },
    {
      "actual": true,
      "score": 0.35
    },
    {
      "actual": true,
      "score": 0.8
    }
  ]
}
```

[分图 Schema](../../schema/plots/precisionRecallCurve.schema.json) · [主例](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/precisionRecallCurve.json) · [公共配置](../spec.md)。输入保持不可变，空数据显示空态；更新重新调用 `compileStatPlot(nextSpec)` 后执行 `chart.updateSpec`。内部绘图结果不是可传回的公共输入。

参考 [sklearn precision_recall_curve](https://scikit-learn.org/1.5/modules/generated/sklearn.metrics.precision_recall_curve.html)。
