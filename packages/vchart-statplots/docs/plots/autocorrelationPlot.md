# 自相关与偏自相关图 `autocorrelationPlot`

`data: [{value: number, series?}]`，原始有限时间序列，按同系列在输入中的出现顺序计算，不排序、不插值、不丢弃缺失。

## 计算与配置

- `method` 默认 `acf`，也支持 `pacf`。每系列独立计算，常量序列拒绝。ACF 至少 2 个样本，PACF 至少 4 个。
- `maxLag` 可选整数 1–512。ACF 要求 L<N；PACF 要求 L<floor(N/2)。默认 min(floor(10 log10 N), 上述允许最大值, 512)。均包含 lag=0，值为 1。
- ACF 使用整个系列均值中心化，γₖ = Σ(xᵢ−mean)(xᵢ₊ₖ−mean)/N，再取 γₖ/γ₀，固定有偏（non-adjusted）口径。先中心化、缩放再乘积。
- PACF 使用以上自协方差，经 Levinson–Durbin 递推计算 Yule–Walker MLE，等价 Statsmodels method="ywm"；不支持其他估计法，不用 epsilon 或伪逆隐藏无效递推。
- `confidence` 默认 `{level: 0.95}`；false 关闭。level 在 (0,1) 且对应分位点可表示。ACF 为 Bartlett：z×sqrt((1+2Σⱼ₌₁ᵏ⁻¹ρⱼ²)/N)；PACF 为 z/sqrt(N)。
- 置信带围绕 0，lag=0 无区间；绘图边缘延展半个滞后，保证仅一个有效滞后的区间也有可见面积。点 tooltip 显示真实整数滞后的零中心上下界。
- 竖线从 0 延伸到相关值，点、竖线、区间按 series 同色并由图例同步过滤。resize/hover 不重算统计。
- 不接收 lag/correlation/lower/upper/interval；不是接收任意已计算 ACF 的容器。

## 示例

```json
{
  "type": "autocorrelationPlot",
  "data": [
    {
      "value": 1
    },
    {
      "value": 3
    },
    {
      "value": 2
    },
    {
      "value": 5
    },
    {
      "value": 4
    },
    {
      "value": 7
    },
    {
      "value": 1
    },
    {
      "value": 6
    },
    {
      "value": 3
    },
    {
      "value": 8
    }
  ]
}
```

[分图 Schema](../../schema/plots/autocorrelationPlot.schema.json) · [主例](../../examples/specs/autocorrelationPlot.json) · [公共配置](../spec.md)。输入保持不可变，空数据显示空态；更新重新调用 `compileStatPlot(nextSpec)` 后执行 `chart.updateSpec`。内部绘图结果不是可传回的公共输入。
