# 季节图 `seasonalPlot`

[TS 类型](../types/plots/seasonal/types.d.ts) · [最小输入](../examples/specs/minimal/seasonalPlot.json) · [公共约束](common.md) · [完整文档](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/docs/plots/seasonalPlot.md)

比较不同年份的季度形状。

cycle 是年份等完整周期，phase 是季度等周期内位置。两份 Order 必须非空、不重复并覆盖数据，可声明无观测的位置。overlay 横轴为 phase；subseries 按 phase 分面、横轴为 cycle。两种布局都按显式顺序断线，缺口不补零。

## 输入与配置

语义输入字段：`value`、`cycle`、`phase`。字段、必填项和单位以 [TS 类型](../types/plots/seasonal/types.d.ts) 为准；未知属性会被拒绝。

## 选型边界

- 没有周期和周期内位置
- 缺少明确顺序
