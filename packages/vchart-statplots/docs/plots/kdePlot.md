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

最小配置只需 type / data。每行是一条有限数值 value 观测；无序和重复值均有效。可选 series 按系列独立估计、各自以自身样本数归一化；全表必须全部提供非空系列名或全部省略。拒绝旧 density、权重、null、字符串、NaN 和 Infinity，不静默清洗或抽样。

- estimation.kernel：gaussian（默认）或 epanechnikov。
- estimation.bandwidth：正数表示固定带宽（单位同 value）；scott（默认）或 silverman 表示各系列独立自动估计。
- vutils 使用总体标准差 σ：一维 Scott 为 `σ × N^(-1/5)`，Silverman 为 `σ × (4/3)^(1/5) × N^(-1/5)`。后者不是包含 IQR 的其他同名规则。
- sampling.points：每系列等距绘制点数，默认 256，必须为 2–2048 整数；仅控制曲线离散精度，不改变估计方法或带宽。
- fieldLabels.value / density：修改轴及 tooltip 名称；保留公共主题、配色、标题与分组图例。

[JSON Schema](../../schema/plots/kdePlot.schema.json)；[Spec 协议](../spec.md)；[最小示例](../../examples/specs/minimal/kdePlot.json)；[分组](../../examples/specs/grouped/kdePlot.json)；[固定带宽](../../examples/specs/variants/kdePlot-fixed.json)；[Epanechnikov](../../examples/specs/variants/kdePlot-epanechnikov.json)；[常数样本](../../examples/specs/variants/kdePlot-constant.json)。

## 估计、绘制与边界

使用 vutils evaluator 在本包生成的网格求值，不使用只覆盖样本范围的 evaluateGrid。Gaussian 绘制范围是 `[min - 3h, max + 3h]`，保留至少约 99.73% 的理论概率质量；尾部仍延伸到范围外。Epanechnikov 为 `[min - h, max + h]`，覆盖完整核支撑。各系列独立网格，共享范围并集的 x 轴；使用 linear 连接，不二次平滑，不重归一化截断曲线。

离散折线面积不承诺精确为 1。小带宽、跨度大的多峰样本可能需要增加 sampling.points 才能充分显示峰形。关闭绘制点符号，dimension tooltip 展示最近绘制位置的 value / density；这些点不是原始样本。

单样本和常数系列无法自动估计正带宽，报 INVALID_RANGE，指向该系列首条观测并要求显式 estimation.bandwidth；提供正带宽即可正常绘制。空 data 使用占位轴域、无曲线并显示“暂无可绘制数据”。

带宽、密度尺度、共享轴域不可用有限数表示时明确报 INVALID_RANGE，请先转换单位或平移数值。网格舍入导致位置不再严格递增时在 /sampling/points 报错，提示减少点数或转换单位，不静默改变采样点数。

统计只发生在 compileStatPlot；数据或参数更新使用 `chart.updateSpec(compileStatPlot(nextSpec))`。resize / hover 不扫描原始样本，主题与配色不会改变统计结果。

## 迁移与选型边界

旧 value / density 输入直接拒绝；estimation 已由说明信息改为实际计算配置。原来的曲线采样位置不能当作原始样本；只有预计算密度时使用 VChart 原生 line。二维密度、加权估计和任意回调核函数不在本图契约中。
