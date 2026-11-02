# 概率校准曲线 `calibrationCurve`

[TS 类型](../types/plots/calibration/types.d.ts) · [最小输入](../examples/specs/minimal/calibrationCurve.json) · [公共约束](common.md)

`data: [{actual: boolean, probability: number, series?}]`，true 为正类，probability 必须在 [0,1]。允许单样本、全正/全负和恒定概率。

## 计算与配置

- `binning.binCount` 默认 5，整数 1–512；`strategy` 默认 `uniform`，也支持 `quantile`。
- uniform 在 [0,1] 等宽分箱；quantile 对每系列独立排序，以线性插值（type 7）取概率分位边界。
- 与 sklearn 一致，等于内部边界的概率归入左箱；0 和 1 都计入。这与 histogram 的左闭右开不同。
- quantile 重复边界保留，空箱省略，恒定概率得到一个可绘制的非空箱；不强求实际箱数等于请求箱数。
- 每个非空箱绘制平均预测概率与实际正例率，tooltip 显示边界、样本数；保留理想校准对角线。
- 不接收旧分箱统计或 interval。第一版不提供二项置信区间，也不执行模型校准。
