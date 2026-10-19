# 概率校准曲线 `calibrationCurve`

`data: [{actual: boolean, probability: number, series?}]`，true 为正类，probability 必须在 [0,1]。允许单样本、全正/全负和恒定概率。

## 计算与配置

- `binning.binCount` 默认 5，整数 1–512；`strategy` 默认 `uniform`，也支持 `quantile`。
- uniform 在 [0,1] 等宽分箱；quantile 对每系列独立排序，以线性插值（type 7）取概率分位边界。
- 与 sklearn 一致，等于内部边界的概率归入左箱；0 和 1 都计入。这与 histogram 的左闭右开不同。
- quantile 重复边界保留，空箱省略，恒定概率得到一个可绘制的非空箱；不强求实际箱数等于请求箱数。
- 每个非空箱绘制平均预测概率与实际正例率，tooltip 显示边界、样本数；保留理想校准对角线。
- 不接收旧分箱统计或 interval。第一版不提供二项置信区间，也不执行模型校准。

## 示例

```json
{
  "type": "calibrationCurve",
  "data": [
    {
      "actual": false,
      "probability": 0
    },
    {
      "actual": true,
      "probability": 0.2
    },
    {
      "actual": false,
      "probability": 0.3
    },
    {
      "actual": true,
      "probability": 0.5
    },
    {
      "actual": true,
      "probability": 0.65
    },
    {
      "actual": false,
      "probability": 0.8
    },
    {
      "actual": true,
      "probability": 1
    }
  ]
}
```

[分图 Schema](../../schema/plots/calibrationCurve.schema.json) · [主例](../../examples/specs/calibrationCurve.json) · [公共配置](../spec.md)。输入保持不可变，空数据显示空态；更新重新调用 `compileStatPlot(nextSpec)` 后执行 `chart.updateSpec`。内部绘图结果不是可传回的公共输入。

参考 [sklearn calibration_curve](https://scikit-learn.org/1.5/modules/generated/sklearn.calibration.calibration_curve.html)。
