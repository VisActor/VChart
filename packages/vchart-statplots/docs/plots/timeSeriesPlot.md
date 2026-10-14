# 时间序列图 `timeSeriesPlot`

接受原始时间观测，或显式声明外部估计结果。input 必填，带时区 ISO 时间转换为 UTC 数值坐标；每系列按时刻稳定排序，不修改输入。

```json
{
  "type": "timeSeriesPlot",
  "input": "observations",
  "data": [
    { "time": "2026-01-01T00:00:00Z", "value": 1 },
    { "time": "2026-01-01T08:00:00+08:00", "value": 3 },
    { "time": "2026-01-02T00:00:00Z", "value": null }
  ]
}
```

input=observations 按 series 与解析后的毫秒时刻分组，重复样本分别计入；不同时区表示同一时刻时合并。默认 estimator=mean、95% percentile bootstrap CI（1000 次、seed=0），第一时刻上例显示均值 2。支持 median，以及 errorBar 的 confidence、percentile、standardError、standardDeviation、range 或 false，与 pointIntervalPlot 共用算法。standardError 仅支持 mean；seed 为 uint32，重采样次数为 100–10000 整数，level 位于 (0,1)，multiplier 为有限正数。

同组 null 被有效样本排除；全 null 时刻保留断点，tooltip 样本数为 0。单样本的 CI/SD/SE 端点为 null 并提示样本不足，percentile/range 端点为样本值。常数组至少两条有效样本时区间可以零宽。没有声明的时间不补点，不自动重采样或填零。

estimator=false 按时刻直接连线，同一时刻按原始顺序保留，null 断线；errorBar 只能省略或 false，tooltip 不伪造样本数。原始模式禁止 lower/upper/interval。

input=estimates 接受 `{time,value,lower?,upper?,series?}[]`，外部区间必须声明 interval；上下界成对且 lower≤upper。允许乱序，同系列同一实际时刻只允许一个结果，时区别名重复也拒绝。value=null 不能携带区间；禁止 estimator/errorBar，tooltip 不推断样本数。旧 time/value/lower/upper 输入迁移为此模式。

曲线和区间带遇到 null 同时断开，图例同时控制对应系列的曲线与带。resize/hover 不重新估计；更新用 `chart.updateSpec(compileStatPlot(nextSpec))`。默认 bootstrap 复杂度为 O(BN)，median 还需排序重采样，较大样本可根据问题显式选择 SE/SD、percentile 或关闭区间。

流程对应 [Seaborn lineplot](https://seaborn.pydata.org/generated/seaborn.lineplot.html) 的分组聚合与误差带；estimator=false 对应 estimator=None、errorbar=None。bootstrap 随机数实现不同，不承诺和 NumPy 的 seed 逐端点相同。

[JSON Schema](../../schema/plots/timeSeriesPlot.schema.json)；[原始观测主例](../../examples/specs/timeSeriesPlot.json)；[外部区间](../../examples/specs/variants/timeSeriesPlot-estimates.json)；[直接连线](../../examples/specs/variants/timeSeriesPlot-direct.json)。
