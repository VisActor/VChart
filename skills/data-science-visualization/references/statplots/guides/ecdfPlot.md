# 经验累积分布图 `ecdfPlot`

[TS 类型](../types/plots/ecdf/types.d.ts) · [最小输入](../examples/specs/minimal/ecdfPlot.json) · [公共约束](common.md)

从原始样本计算经验累积概率，保留真实跳点并比较不同系列。编译阶段复用 vutils.ecdf；`F(x) = 样本中 value ≤ x 的数量 / N`，使用右连续阶梯。

## 输入与配置

每行是一条有限数值 value 观测；无序和重复值均有效。可选 series 在各系列内独立以自身 N 归一化，最终概率为 1；全表全部提供非空系列名或全部省略。拒绝旧 probability / cumulativeProbability、权重、null、字符串、NaN 和 Infinity。

不需要分箱、网格或估计参数。fieldLabels.value / cumulativeProbability 修改轴及 tooltip 名称；公共主题、颜色、标题、图例沿用现有规则。

## 精确跳点与绘制

原生 line 使用 stepAfter，y 轴固定 [0,1]。共享 x 轴按全表跨度左右各留白 5%；常数值 v 留白为 `max(0.5, abs(v) × 0.05)`。两端补概率为 0 / 1 的连接点以显示首个跳跃和左右平台；连接点不计入样本量，也不是原始观测。

单样本、常数样本在真实 value 从 0 跳到 1。空 data 无曲线，显示“暂无可绘制数据”。无法表示有限留白和轴跨度时在 /data 报 INVALID_RANGE，提示转换单位或平移数值。

关闭点符号，dimension tooltip 展示最近绘制位置的 value / cumulativeProbability；两端显示的是 F(x)，不是额外样本。曲线保留全部不同值 U 个跳点，大量不同值的绘制成本随 U 增长。

在排序去重后的真实观测位置调用 vutils evaluator 求概率，不使用等距 evaluateGrid，不抽样或降采样。
