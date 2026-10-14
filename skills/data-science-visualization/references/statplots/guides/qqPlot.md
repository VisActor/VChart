# Q–Q 图 `qqPlot`

[TS 类型](../types/plots/qq/types.d.ts) · [最小输入](../examples/specs/minimal/qqPlot.json) · [公共约束](common.md) · [完整文档](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/docs/plots/qqPlot.md)

`data: [{value: number, series?}]`，原始有限数值，顺序任意、重复值有效。每系列独立排序，保留全部样本。

## 计算与配置

- `distribution` 默认 `{type: "normal", mean: 0, standardDeviation: 1}`。第一版只支持正态，标准差须为有限正数；不从样本自动拟合理论参数。
- 第 i 个排序样本使用 pᵢ=i/(N+1)，理论分位数为 mean + standardDeviation × normalQuantile(pᵢ)，与 Statsmodels ProbPlot(a=0, fit=False) 对齐。
- `referenceLine` 默认 `none`。`identity` 为共享 y=x；`quartiles` 用样本与理论的 25% / 75% 分位数计算；`regression` 用标准 OLS 拟合，每系列独立。
- 单样本可绘制；quartiles / regression 至少需两个。常数样本可绘制水平参考线。理论参数导致分位点不可区分、参考线不可表示时明确报错，请调整数值单位。
- Q–Q 点横轴理论、纵轴样本；辅助参考线不增加图例项。不是 P–P 图或两样本 Q–Q。
- 不接收 theoreticalQuantile/sampleQuantile 或外部 slope/intercept。
