# 条带图 `stripPlot`

[TS 类型](../types/plots/strip-plot/types.d.ts) · [最小输入](../examples/specs/minimal/stripPlot.json) · [公共约束](common.md)

查看各类别中每条观测的数值。

layout 默认为 strip；jitterRatio 仅用于 jitter 布局，表示最大偏移占完整分类带宽的比例（0–0.5，默认 0.3）。蜂群必须显式 layout=swarm；布局按 id 确定，不修改原始数值。

## 输入与配置

语义输入字段：`id`、`category`、`value`。字段、必填项和单位以 [TS 类型](../types/plots/strip-plot/types.d.ts) 为准；未知属性会被拒绝。

## 选型边界

- 只有汇总统计
- SHAP 贡献
