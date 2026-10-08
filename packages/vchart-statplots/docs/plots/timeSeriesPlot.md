# 时间序列图 `timeSeriesPlot`

查看随时间变化的数值及已有区间。

time 使用带时区 ISO 8601，显示为 UTC。每系列严格递增；value=null 同时断开曲线和区间带，不补零。

## 输入与配置

语义输入字段：`time`、`value`、`lower`、`upper`。字段、必填项和单位以 [JSON Schema](../../schema/plots/timeSeriesPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：`interval`。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/timeSeriesPlot.json)；[完整主例](../../examples/specs/timeSeriesPlot.json)。

## 选型边界

- 时间没有时区
- 训练轮次直接作为时间
