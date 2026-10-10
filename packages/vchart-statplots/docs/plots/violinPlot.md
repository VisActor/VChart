# 小提琴图 `violinPlot`

从原始样本比较不同分类、系列的核密度分布形状。编译阶段与 kdePlot 共用 vutils KDE；调用方不需要计算 density。

默认 area 在归一化范围内共享概率密度的峰值尺度，完整支撑下轮廓等面积；width 每组最大宽度相同；count 最大宽度按样本数缩放。三者只改变私有绘制半宽，tooltip 的 density 始终是组自身概率密度。

## 输入与配置

```json
{
  "type": "violinPlot",
  "data": [
    { "category": "A", "value": 3 },
    { "category": "A", "value": 1 },
    { "category": "A", "value": 1 },
    { "category": "B", "value": 5 },
    { "category": "B", "value": 8 }
  ]
}
```

每行是一条原始 `{category, value, series?}` 观测。按 category + series 独立计算分布；系列全部提供或全部省略。保留首次出现的分组顺序，不补没有观测的组合。允许乱序，重复值分别计入权重。不修改输入、不去重、不静默清洗；拒绝旧 density、null、字符串和非有限 value。

- estimation.kernel：gaussian（默认）或 epanechnikov。
- estimation.bandwidth：有限正数为实际固定带宽（单位同 value）；scott（默认）或 silverman 为各组独立自动估计。默认使用样本标准差 σ；standardDeviation=population 恢复旧带宽约定，一维 Scott 为 `σ × N^(-1/5)`，Silverman 为 `σ × (4/3)^(1/5) × N^(-1/5)`，后者不含 IQR。
- sampling.points：每组等距轮廓点数，默认 256，范围 2–2048 整数；仅控制绘制精度，不改变统计模型。
- densityNormalization：area（默认）、count 或 width。设组内密度为 f、峰值为 p、样本数为 n；归一化范围内最大峰值为 P、最大样本数为 M。绘制半宽分别为 f/P、(f/p)×(n/M)、f/p，不对截断曲线做梯形面积二次归一化。
- normalizationScope：默认 series，即同一系列跨 category 共享 P/M；all 所有 category+series 共享。没有 series 时全部分类为同一范围。width 与 scope 无关。
- estimation.bandwidthAdjust：正的带宽倍率，默认 1；固定带宽也生效，固定带宽禁止显式 standardDeviation。
- sampling.cut：有限非负，Gaussian 默认 2、Epanechnikov 默认 1，cut=0 只覆盖原始极值。
- fieldLabels.category / value / density：改变轴和 tooltip 展示名称。

字段和必填项以 [JSON Schema](../../schema/plots/violinPlot.schema.json) 为准；未知属性会被拒绝。

最小示例中的配置：无额外必填图表选项。完整可选配置、默认值见 [Spec 协议](../spec.md) 和 Schema。fieldLabels 仅使用该图声明的键，改变坐标轴与 tooltip 展示名称，不改变统计数据。

[最小示例](../../examples/specs/minimal/violinPlot.json)；[完整主例](../../examples/specs/violinPlot.json)；[等面积](../../examples/specs/variants/violinPlot-area.json)；[固定带宽](../../examples/specs/variants/violinPlot-fixed.json)；[常数组/单样本](../../examples/specs/variants/violinPlot-constant.json)；[紧支撑核](../../examples/specs/variants/violinPlot-epanechnikov.json)。

## 轮廓、交互与边界

每组 Gaussian 绘制域为 `[min−2h,max+2h]`，Epanechnikov 为 `[min−h,max+h]`。使用 linear 连接，不补造零密度端点，不二次平滑；共享数值轴覆盖所有组绘制域。显式相同 cut、采样点、带宽及 kernel 时，与 normalizationScope=series 的 kdePlot 得到相同网格和密度。概率密度不是概率，峰值可以大于 1；截断曲线和有限采样折线不承诺积分精确为 1。

面积图元携带整组采样点，tooltip 展示组名、样本数、原始最小值/最大值、实际带宽、采样峰值密度；不将第一个点解释为指针所在数值。图例按 series 控制对应类别中的所有轮廓。

单样本和常数组没有正自动带宽，INVALID_RANGE 指向首条 value；提供显式正带宽即可绘制。空表合法，显示“暂无可绘制数据”。带宽、轴跨度、密度尺度不可表示或采样位置不能严格递增时明确报错，不自动改参数。

validateStatPlot 校验输入和模型/网格边界，不执行完整密度评估。极窄带宽、稀疏网格可能错过核支撑，特别是 Epanechnikov 的 2 点网格可能只有零密度端点。compileStatPlot 评估后若采样峰值不能形成有限正轮廓，抛出 StatPlotValidationError，路径 /sampling/points，提示增加点数或调整带宽；不会补造密度。宽度尺度溢出时提示转换单位。

更新使用 `chart.updateSpec(compileStatPlot(nextSpec))`；每组密度只在一次编译中评估一次。render / resize / hover 不扫描原始观测，主题和配色不改变统计。

## 与 Python 库的关系

原始样本 → 分类分组 → KDE → 轮廓的流程与 [Seaborn violinplot](https://seaborn.pydata.org/generated/seaborn.violinplot.html) 和 [Matplotlib violinplot](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.violinplot.html) 一致；category / series 对应 Seaborn 的分类变量 / hue。

默认 area、normalizationScope=series、Gaussian cut=2 与 Seaborn 0.13 的 density_norm=area、common_norm=False 对齐。自动带宽使用样本标准差；固定数字 bandwidth 仍为实际带宽，而 Python 数字 bw_method 为系数。默认网格 256 点，Seaborn 100 点；离散采样、截断边界导致可见面积不必严格相等。

旧默认效果显式配置：

```json
{
  "densityNormalization": "width",
  "estimation": { "bandwidth": "scott", "standardDeviation": "population" },
  "sampling": { "cut": 3 }
}
```

原来显式 area 的梯形积分归一化改为 Seaborn 的密度峰值尺度规则，不能承诺旧 area 逐点相同。常数组仍要求显式正带宽，Seaborn 的退化线段处理不在本图契约中。cut=0 的常数组因绘制跨度为零被拒绝。

## 选型边界

- 只有五数概括
- 仅持有预计算密度曲线

旧 category / value / density 输入直接拒绝。不能从旧轮廓反推或伪造原始观测；不支持权重、split / 半小提琴或内嵌箱体。
