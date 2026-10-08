# ROC 曲线 `rocCurve`

比较不同分类阈值的真阳性率与假阳性率。

两轴均 [0,1]，各系列 fpr/tpr 单调不减；不平滑、不补端点。AUC 仅展示 metrics 输入，不从图上估算。

## 输入与配置

语义输入字段：`fpr`、`tpr`。字段、必填项和单位以 [JSON Schema](../../schema/plots/rocCurve.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/rocCurve.json)；[完整主例](../../examples/specs/rocCurve.json)。

## 选型边界

- 原始概率尚未计算曲线
- 精确率召回率曲线
