# 残差图 `residualPlot`

检查残差随原始自变量或拟合值变化的结构，内置 y=0 参考线。使用必填 `input` 区分三种真实用途，禁止跨模式字段。

## 原始观测

```json
{"type":"residualPlot","input":"observations","data":[{"x":1,"y":2},{"x":2,"y":3},{"x":3,"y":5}]}
```

`data` 为 `{x,y,id?,series?}[]`。regression 默认 `{method:"linear"}`，也支持 `{method:"polynomial",degree:2}` 与 `{method:"lowess",span?,iterations?,delta?}`，参数、稳定性与最低样本规则同[散点回归](scatterPlot.md)。各系列独立拟合，在每条真实 x 上使用同一模型预测，计算 raw 残差 `y−fittedValue`；不会从稀疏展示网格推算残差。

`xAxis` 默认 predictor，即原始 x，对应常见 Python 残差图；显式 fitted 可用拟合值作为横轴。fieldLabels 支持 x/y/fittedValue/residual，Tooltip 显示原始值、拟合值、残差及算法参数。原始重复样本保留，id 可省略；提供时须非空且同系列内唯一，不把私有行索引变成公共 ID。

## 外部预测与模型残差

- `input:"predictions"`：`{id,actual,fittedValue,series?}[]`，只计算 `actual−fittedValue`，不重新拟合。
- `input:"residuals"`：`{id,fittedValue,residual,series?}[]`，residualKind 必填 raw/standardized/studentized，直接展示。

两种外部模式保持 fittedValue 横轴和原有 fieldLabels.fittedValue/residual；禁止 regression/xAxis。id 必填、非空且同系列唯一。数值必须有限，相减溢出报告原始 JSON Pointer。标准化/学生化残差需要模型方差和杠杆信息，仍由调用方计算。

## LOWESS 残差趋势

`smooth` 省略/false 不画趋势，配置 `{method:"lowess",span?,iterations?,delta?}` 可对实际横轴和残差独立拟合趋势。适用于三种输入模式，不改变已有残差，不画趋势置信带。横轴少于两个不同取值时保留残差点，省略不可定义趋势并在 Tooltip 解释。趋势线和点共用系列色域及图例。

```json
{"type":"residualPlot","input":"observations","regression":{"method":"linear"},"smooth":{"method":"lowess","span":0.5},"data":[{"x":1,"y":2},{"x":2,"y":3},{"x":3,"y":5},{"x":4,"y":8}]}
```

## Python 对照与迁移

原始入口的“拟合后 residual=y−predict(x)，横轴 x”对应 [seaborn.residplot](https://seaborn.pydata.org/generated/seaborn.residplot.html)。该函数的 lowess=True 是残差趋势，本包以 smooth 表达。regression.method="lowess" 则使用 LOWESS 模型生成残差，是不同用途的扩展。

现有 predictions/residuals 配置无需改变。旧外部结果继续明确 input/residualKind；不通过换个字段名冒充原始观测。空输入为空态，不修改数组或行对象，不在 resize/hover/图例/release 重算统计。

内部回归需包含本轮修复的后续 vutils 正式版本；当前 1.0.25 不具备完整能力。准确交付状态见[验收记录](../validation.md)。

[最小示例](../../examples/specs/minimal/residualPlot.json)；[外部预测](../../examples/specs/variants/residualPlot-predictions.json)；[Schema](../../schema/plots/residualPlot.schema.json)。
