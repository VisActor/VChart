# 残差图 `residualPlot`

[TS 类型](../types/plots/residual/types.d.ts) · [最小输入](../examples/specs/minimal/residualPlot.json) · [公共约束](common.md)

检查残差随原始自变量或拟合值变化的结构，内置 y=0 参考线。使用必填 `input` 区分三种真实用途，禁止跨模式字段。

## 原始观测

`data` 为 `{x,y,id?,series?}[]`。regression 默认 `{method:"linear"}`，也支持 `{method:"polynomial",degree:2}` 与 `{method:"lowess",span?,iterations?,delta?}`，参数、稳定性与最低样本规则同[散点回归](scatterPlot.md)。各系列独立拟合，在每条真实 x 上使用同一模型预测，计算 raw 残差 `y−fittedValue`；不会从稀疏展示网格推算残差。

`xAxis` 默认 predictor，即原始 x，对应常见 Python 残差图；显式 fitted 可用拟合值作为横轴。fieldLabels 支持 x/y/fittedValue/residual，Tooltip 显示原始值、拟合值、残差及算法参数。原始重复样本保留，id 可省略；提供时须非空且同系列内唯一，不把私有行索引变成公共 ID。

## 外部预测与模型残差

- `input:"predictions"`：`{id,actual,fittedValue,series?}[]`，只计算 `actual−fittedValue`，不重新拟合。
- `input:"residuals"`：`{id,fittedValue,residual,series?}[]`，residualKind 必填 raw/standardized/studentized，直接展示。

两种外部模式保持 fittedValue 横轴和原有 fieldLabels.fittedValue/residual；禁止 regression/xAxis。id 必填、非空且同系列唯一。数值必须有限，相减溢出报告原始 JSON Pointer。标准化/学生化残差需要模型方差和杠杆信息，仍由调用方计算。

## LOWESS 残差趋势

`smooth` 省略/false 不画趋势，配置 `{method:"lowess",span?,iterations?,delta?}` 可对实际横轴和残差独立拟合趋势。适用于三种输入模式，不改变已有残差，不画趋势置信带。横轴少于两个不同取值时保留残差点，省略不可定义趋势并在 Tooltip 解释。趋势线和点共用系列色域及图例。
