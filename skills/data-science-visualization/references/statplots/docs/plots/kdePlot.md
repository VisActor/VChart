# 核密度估计图 `kdePlot`

从原始样本估计一维概率密度，比较不同系列的分布。编译阶段直接使用 vutils.kde；density 是每单位 value 的概率密度，峰值可以大于 1。

## 输入与配置

```json
{
  "type": "kdePlot",
  "data": [{ "value": 0 }, { "value": 1 }, { "value": 1 }, { "value": 4 }],
  "estimation": { "kernel": "gaussian", "bandwidth": "scott" },
  "sampling": { "points": 256 }
}
```

最小配置只需 type / data。每行是一条有限数值 value 观测；无序和重复值均有效。可选 series 按系列独立估计、默认按组样本占全表的比例缩放密度；全表必须全部提供非空系列名或全部省略。拒绝旧 density、权重、null、字符串、NaN 和 Infinity，不静默清洗或抽样。

- estimation.kernel：gaussian（默认）或 epanechnikov。
- estimation.bandwidth：正数表示固定带宽（单位同 value）；scott（默认）或 silverman 表示各系列独立自动估计。
- StatPlots 默认使用样本标准差 σ（estimation.standardDeviation=sample），可显式设 population 恢复旧约定：一维 Scott 为 `σ × N^(-1/5)`，Silverman 为 `σ × (4/3)^(1/5) × N^(-1/5)`。后者不是包含 IQR 的其他同名规则。
- estimation.bandwidthAdjust：有限正的带宽倍率，默认 1；对自动和固定带宽均只乘一次。固定数值 bandwidth 时禁止显式 standardDeviation，避免无效配置。
- normalizationScope：默认 all，各组显示 `f_g(x) × n_g/N`；series 显示各组自身概率密度 `f_g(x)`。改变范围不改变 KDE 模型、带宽或网格。
- sampling.cut：有限非负的外延带宽倍数，高斯默认 3，Epanechnikov 默认 1。cut=0 只覆盖样本极值，不截断或重归一化密度。
- sampling.points：每系列等距绘制点数，默认 256，必须为 2–2048 整数；仅控制曲线离散精度，不改变估计方法或带宽。
- fieldLabels.value / density：修改轴及 tooltip 名称；保留公共主题、配色、标题与分组图例。

[JSON Schema](../../schema/plots/kdePlot.schema.json)；[Spec 协议](../spec.md)；[最小示例](../../examples/specs/minimal/kdePlot.json)；[分组](https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/examples/specs/grouped/kdePlot.json)；[固定带宽](../../examples/specs/variants/kdePlot-fixed.json)；[Epanechnikov](../../examples/specs/variants/kdePlot-epanechnikov.json)；[常数样本](../../examples/specs/variants/kdePlot-constant.json)。

## 估计、绘制与边界

使用 vutils evaluator 在本包生成的网格求值，不使用只覆盖样本范围的 evaluateGrid。默认 Gaussian 绘制范围是 `[min - 3h, max + 3h]`，保留至少约 99.73% 的理论概率质量；尾部仍延伸到范围外。Epanechnikov 为 `[min - h, max + h]`，覆盖完整核支撑。各系列独立网格，共享范围并集的 x 轴；使用 linear 连接，不二次平滑，不重归一化截断曲线。

离散折线面积不承诺精确为 1。小带宽、跨度大的多峰样本可能需要增加 sampling.points 才能充分显示峰形。关闭绘制点符号，dimension tooltip 展示最近绘制位置的 value / density、原始样本数、实际带宽和归一化范围；这些点不是原始样本。

单样本和常数系列无法自动估计正带宽，报 INVALID_RANGE，指向该系列首条观测并要求显式 estimation.bandwidth；提供正带宽即可正常绘制。空 data 使用占位轴域、无曲线并显示“暂无可绘制数据”。

带宽、密度尺度、共享轴域不可用有限数表示时明确报 INVALID_RANGE，请先转换单位或平移数值。网格舍入导致位置不再严格递增时在 /sampling/points 报错，提示减少点数或转换单位，不静默改变采样点数。

统计只发生在 compileStatPlot；数据或参数更新使用 `chart.updateSpec(compileStatPlot(nextSpec))`。resize / hover 不扫描原始样本，主题与配色不会改变统计结果。

## 迁移与选型边界

旧 value / density 输入直接拒绝；estimation 已由说明信息改为实际计算配置。原来的曲线采样位置不能当作原始样本；只有预计算密度时使用 VChart 原生 line。二维密度、加权估计和任意回调核函数不在本图契约中。

## 默认值迁移与 Python 对照

默认 all 对应 [Seaborn kdeplot](https://seaborn.pydata.org/generated/seaborn.kdeplot.html) 的 common_norm=True；series 对应 False。自动 Gaussian 带宽使用 SciPy 的样本标准差约定。完整支撑下 all 所有曲线面积和为 1，series 每条曲线面积为 1；有限 cut 和离散点不承诺精确积分，也不重新缩放可见面积。

旧默认效果可显式配置：

```json
{
  "normalizationScope": "series",
  "estimation": { "bandwidth": "scott", "standardDeviation": "population" },
  "sampling": { "cut": 3 }
}
```

数字 bandwidth 始终是原始 value 单位的实际带宽；它与 SciPy/Seaborn 数字 bw_method 的系数含义不同。常数组仍要求显式正带宽；cut=0 的常数组无正绘制跨度，明确拒绝。网格默认 256 点，不承诺与 Python 的默认绘制分辨率一致。
