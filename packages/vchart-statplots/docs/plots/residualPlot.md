# 残差图 `residualPlot`

检查残差随拟合值变化的结构，内置 y=0 参考线。

## 两种输入

- `input: "predictions"`：data 为 `{id, actual, fittedValue, series?}[]`，内部计算普通残差 `actual − fittedValue`，Tooltip 同时显示实际值与拟合值。
- `input: "residuals"`：data 为 `{id, fittedValue, residual, series?}[]`，residualKind 必填 raw/standardized/studentized，直接展示外部模型残差，不重算。

id 为非空字符串，同一系列内唯一；不同模型可共享观测 id。数值必须有限，相减溢出报告结构化错误。series 全表提供或全部省略。两种模式禁止混用字段。空表显示空态。

```json
{"type":"residualPlot","input":"predictions","data":[{"id":"1","actual":8,"fittedValue":10},{"id":"2","actual":12,"fittedValue":11}]}
```

## 迁移与 Python 对照

原结果输入增加 input=residuals，明确 residualKind；已持有真实值与模型预测时使用 predictions。本包不拟合回归，不能宣称完全等同于 Seaborn residplot 的自动回归；标准化、学生化残差仍由了解模型方差与杠杆值的调用方计算。

[最小示例](../../examples/specs/minimal/residualPlot.json)；[Schema](../../schema/plots/residualPlot.schema.json)。
