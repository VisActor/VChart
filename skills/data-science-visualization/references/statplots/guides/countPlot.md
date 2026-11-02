# 类别计数图 `countPlot`

[TS 类型](../types/plots/count/types.d.ts) · [最小输入](../examples/specs/minimal/countPlot.json) · [公共约束](common.md)

`data: [{category, series?}]`，每行是一条类别观测，重复类别分别计数。不接受 count、proportion 或权重。

## 计算与配置

- `statistic` 默认 `count`，可选 `proportion`。
- 比例默认 `normalizationScope: "all"`，分母是全表观测数；`"series"` 以对应系列样本数为分母。仅比例模式可指定该配置。
- 类别、系列保留首次出现顺序。分组数据补齐类别 × 系列交叉的零计数，缺失类别不会挤走其他柱。
- 不计算均值或其他汇总；任意数值柱图使用 VChart 原生 bar。
