# 性能基准

## 七类原始输入（2026-10-09）

`node packages/vchart-statplots/benchmarks/raw-input.mjs` 暖机后九次记录 count / confusion / ROC / PR / calibration / QQ / ACF 的 10k、100k 编译和独立校验，另测同分 PR、512 阶 ACF/PACF。浏览器 `raw-input-performance.spec.ts` 记录对应规模的首绘、重编译更新、resize、release 和 20 图表页面。

[结果](raw-input-results.json)包含绘图规模和生命周期记录。ROC/PR 使用不同评分，QQ 保留全部点；update 包含统计重算，resize 保留计算结果。本机冒烟，不设毫秒 SLA。脚本仅重写 Node 部分，浏览器记录从 `.vchart-statplots/raw-input/*lifecycle.json` 归档；可发版依赖前置项见[验收](../docs/validation.md)。

首版测试环境与实际数值见同目录 `results.json`。2026-09-30 命名优化的同环境前后测量见 [验收记录](../docs/validation.md)。数值是本机测量，不作为跨设备 SLA。

```sh
# 仓库根目录，先构建包。
node packages/vchart-statplots/benchmarks/run.mjs
npm run test:browser --prefix packages/vchart-statplots -- --grep 'performance|useful scales'
```

Node 场景暖机一次后测量 9 次，报告中位数及样本最大值（近似 p95）；compile 包含边界校验。包括 1 万 / 5 万 ROC 点、1 千 / 1 万蜂群点和 1 万完全重复值。UMD gzip 大小不包含外部 VChart。

浏览器关闭动画、DPR=1、UTC、本地资源。ROC 原生 line 与 statplots 使用相同轴、点、线、主题和画布；对照暖机后各测一次。浏览器时间含测量噪声，不能据单次差异推断回归。首版小提琴测量为 10 组、每组 1,000 个预计算密度采样点；本轮原始输入测量另行记录，不能直接比较。当前 compare-performance 使用每组 1,000 条原始观测、256 个绘制点。

散点场景测量 1 万点的首绘、更新、resize、导出、释放，以及 20 个图表各 1,000 点的创建和释放。Pair Plot 使用 4 / 8 变量、1 千 / 1 万观测，画布 1200×1000，记录面板数、总点数和反转记录顺序后的更新。刷选时间含 Playwright 指针往返及等待 brushEnd，不是纯绘制时间。

Pair Plot 规模按变量数平方增长：8 变量 × 1 万观测意味着 64 个面板与 56 万点。本机首绘约秒级，更新约数十秒，不能视为适合流畅交互的默认规模。优先筛选有意义的变量；如需抽样，应在计算端明确记录策略。

## 首版参考结果（2026-09-29，毫秒）

| 场景 | 编译 | 首绘 | 更新 | resize | 释放 |
| --- | ---: | ---: | ---: | ---: | ---: |
| native ROC line | 0.0 | 27.1 | 32.8 | 43.8 | 2.2 |
| statplots ROC | 2.4 | 30.2 | 40.4 | 34.0 | 2.1 |
| violin 10 groups × 1000 density samples | 3.6 | 18.6 | 24.1 | 8.4 | 0.4 |

| Pair Plot 变量 / 观测 | 面板 / 总点数 | 编译 | 首绘 | 更新 | 刷选往返 |
| --- | --- | ---: | ---: | ---: | ---: |
| 4 / 1000 | 16 / 12000 | 3.3 | 92.8 | 137.7 | 198.0 |
| 4 / 10000 | 16 / 120000 | 12.5 | 428.7 | 1315.5 | 1236.0 |
| 8 / 1000 | 64 / 56000 | 6.5 | 305.2 | 1586.5 | 653.0 |
| 8 / 10000 | 64 / 560000 | 32.8 | 1886.3 | 28231.0 | 5798.0 |

1 万散点首绘 63.1 ms；20 图表共 2 万点首绘 113.8 ms，释放后 canvas 数为 0。外部 VChart 不计入包体，UMD min gzip 为 31,719 字节。


## Hexbin 原始散点生命周期（2026-10-08）

[测量记录](hexbin-results.json) 包含 1 万 / 10 万原始点的 compile、render、update、resize、release 时间及非空箱数。输入为固定的整数模运算生成点，xBins=30，仅生成非空箱；每次更新增加一条重复观测，测试检查总计数 N+1、resize 保留箱数据及释放后 canvas=0。

```sh
npm run test:browser --prefix packages/vchart-statplots -- hexbin.spec.ts --grep '10k and 100k'
```

这是单次生命周期冒烟，不设毫秒阈值，不与原生散点或 Python 对比。compile 包含校验和分箱，update 包含重新编译，resize 的记录含 Playwright 往返；100k 首绘受到前一轮暖机影响。原始运行输出位于 `.vchart-statplots/hexbin/lifecycle-timing.json`。

## Pair Plot 内部对角分箱（2026-10-08）

[新协议测量](pair-diagonal-results.json) 单独记录共享分箱计算和原生图表生命周期。4/8 变量 × 1k/10k 的输入与历史模运算散点一致，移除外部 diagonal；本轮自动箱数分别为 11/15，旧例仅两箱且覆盖范围不同，因此不作为同条件性能提升结论。

独立计算包含范围、边界和计数，Node 22 下每规模先暖机一次、测量十次。4/8 变量 × 10k 的中位数约 1.10/1.94 ms。浏览器生命周期只测一次，不设毫秒阈值：8 变量 × 10k 的 compile 约 34 ms、render 约 1.85 s、update 约 14.54 s、resize 约 18.76 s，仍物化 56 万散点，不适合作为默认流畅交互规模。

每变量计数守恒，修改 id=501 的 v1 为 0.1 后对应旧箱减一、新箱加一；resize 保持箱数据；真实框选按 id 跨面板联动；release 后 canvas=0。brush 计时包含 Playwright 往返。共享工作区同时开发 histogram，不能把环境波动当作算法性能变化。

复现独立统计：`packages/vchart-statplots/node_modules/.bin/ts-node packages/vchart-statplots/scripts/benchmark-pair-diagonal.ts`。生命周期：`npm run test:browser --prefix packages/vchart-statplots -- pair-performance.spec.ts`。原始日志与截图在 `.vchart-statplots/pair-diagonal/`，不提交。

## Histogram 原始观测生命周期（2026-10-08）

[测量记录](histogram-results.json) 使用固定模运算 `value=((i*73)%997)/997` 生成 1 万 / 10 万原始观测，显式 binCount=30。compile 包含校验与分箱，暖机一次后测量九次，记录中位数与最大值；本机中位数约 0.3 / 1.6 ms。原生图元仅按箱数生成，不为每条观测创建图元。

```sh
npm run test:browser --prefix packages/vchart-statplots -- histogram.spec.ts --grep '10k and 100k'
```

每规模的 render/update/resize/release 只测一次，update 包含重新编译并增加一条重复观测，检查 sum(count)=N+1；resize 保持箱数据，release 后 canvas=0。20 个图表各 1,000 条观测的创建与释放同样通过。浏览器时间含测量噪声，100k 首绘受前一轮暖机影响，不设毫秒阈值或跨设备 SLA。原始输出位于 `.vchart-statplots/histogram/lifecycle-timing.json`。

## KDE / ECDF 原始样本生命周期（2026-10-08）

[测量记录](distribution-results.json) 在 Node.js 22 启动的 Chromium 中使用确定性模运算生成 10k / 100k 原始观测。KDE 默认 Gaussian + Scott、256 点，编译中位数约 9 / 93 ms；ECDF 同时测量重复值和全不同值，100k 全不同值保留 100002 个绘图点，编译约 24 ms、首绘约 115 ms。每规模先暖机一次、测量九次编译，记录中位数和最大值；图形生命周期单次测量不作为跨设备 SLA。

KDE 估计为 O(N × points)，每系列只生成 points 个绘图点。ECDF 不降采样，每系列计算为 O(N log N + U log U + U log N)，绘图规模随不同值 U 增长。数据更新新增重复 0，ECDF 断言更新后的真实概率；resize 不改变统计数据，20 图表全部释放后 canvas=0。

```sh
npm run test:browser --prefix packages/vchart-statplots -- distribution-performance.spec.ts
```

原始报告为 `.vchart-statplots/distributions/*-timings.json`。UMD 大小及浏览器、视觉验证范围见 [验收记录](../docs/validation.md)。

## BoxPlot 原始样本生命周期（2026-10-08）

[测量记录](box-plot-results.json) 使用确定性 10k / 100k 输入：单组和十组采用 value=(i×37)%1009；大量异常点采用每五条四个 0、一个 100，保持 20% 异常值（100k 实际生成 20000 个异常点图元）。统计按 category + series 独立，复杂度 O(N + Σ N组 log N组)，绘图规模随箱数和异常观测数增长，不去重或降采样。

每规模暖机一次，compile 测量九次，中位数约 1 / 9 ms（普通单组）；首绘、update、resize、release 各测一次。100k / 20k 异常点约 61 ms 首绘、53 ms 更新、54 ms resize；这些是本机冒烟结果，不是跨设备 SLA。数据更新重新编译，resize 保持统计数据，20 个图表释放后 canvas=0。

```sh
npm run test:browser --prefix packages/vchart-statplots -- box-plot-performance.spec.ts
```

原始性能与截图证据保留在 `.vchart-statplots/box-plot/`。实际统计和交互验收见 [验收记录](../docs/validation.md)。

## ViolinPlot 原始样本生命周期（2026-10-08）

[测量记录](violin-results.json) 使用 10k / 100k 确定性原始样本，value=(i×37)%1009；单组与十组分别生成 256 / 2560 个轮廓采样点。复用 vutils KDE，编译复杂度 O(N×points)，内存 O(N + 组数×points)，绘图规模 O(组数×points)。不去重或抽样原始数据。

暖机一次后 compile 测量九次，中位数约 10 / 101 ms（单组）；首绘和 update 记录包含重新编译，resize / hover 不计算 KDE。100k 单组约 104 ms 首绘/更新、2.3 ms resize。20 图表各 1000 原始样本，共 20 个 canvas，释放后 canvas=0。本机测量不作为跨设备 SLA，不能与历史预计算密度的首版耗时直接比较。

```sh
npm run test:browser --prefix packages/vchart-statplots -- violin-performance.spec.ts
```

原始证据位于 `.vchart-statplots/violin/timings.json`；测量记录采用定向性能测试结果，后续全包回归运行也会生成自己的性能报告。数学、交互和截图验收见[验收记录](../docs/validation.md)。

## 表格与模型结果输入（2026-10-09）

[独立校验耗时](input-alignment-validation.json) 使用 Node 22，暖机一次后测五次，确认 validate 不运行完整相关性或 bootstrap。10k/100k ×16 变量约 1.3/14.2 ms（相关表格）、1.6/14.4 ms（缺失表格）；结构校验和必要键集/唯一性检查随输入增长，runtime 由 type/input 判别路由，不重复遍历 28 个图表分支。

[完整测量](input-alignment-results.json) 来自 `input-alignment-performance.spec.ts`，每配置独立页面测量一次。render 不含 compile，update 包含重新编译；无跨设备 SLA 或固定耗时阈值。确定性输入见用例，缺失矩阵的 N 指实际单元格、残差的 N 指实际散点，相关矩阵的 N 指观测数。全部 resize 保持统计数据，释放后 canvas=0；另测 20 个混合图表页面。

| 配置 | compile | render | update | resize |
| --- | --- | --- | --- |
| 相关矩阵 100k ×16，Pearson | 307 ms | 35 ms | 305 ms | 12 ms |
| 相关矩阵 100k ×16，Spearman / Kendall | 6.2 / 7.6 s | 40 / 38 ms | 6.2 / 7.4 s | 11 ms |
| 100k 均值，1000 次 bootstrap | 1.8 s | 25 ms | 2.1 s | 4 ms |
| 100k 中位数，1000 次 bootstrap | 12.6 s | 23 ms | 12.9 s | 4 ms |
| 缺失矩阵 100k 单元格 | 13 ms | 468 ms | 468 ms | 548 ms |
| 普通残差 100k 散点 | 23 ms | 337 ms | 319 ms | 296 ms |
| 学习曲线 100 规模 ×10 折 ×10 模型，两种 split | 12 ms | 48 ms | 32 ms | 18 ms |

矩阵统计复杂度为 Pearson O(P²N)、秩相关 O(P²N log N)；只计算半矩阵后镜像。缺失和残差生成 O(N)，学习曲线分组 O(N) 并排序结果。点区间均值 bootstrap O(BN)，中位数 bootstrap O(BN log N)。10k/100k、4/16 变量、三种方法、100/1000 次重采样，以及 10/100 训练规模、5/10 折、1/10 模型均有记录。

默认 estimator=mean、1000 次 CI 对 100k 样本已有秒级同步成本；选择 median 时默认次数成本更高。大样本应根据分析问题明确使用 SD/SE、percentile、range、关闭区间或减少重采样次数；不静默抽样。秩相关应先选择必要变量。render/resize/hover 不重算这些统计。

```sh
npm run test:browser --prefix packages/vchart-statplots -- input-alignment-performance.spec.ts
```

## 时间序列与 KDE/violin 默认配置（2026-10-09）

[测量记录](time-kde-results.json) 来自 `time-kde-performance.spec.ts`，使用 Node 22 和本地 VUtil 新接口构建。暖机一次后 compile 测五次取中位数；render 不含 compile，update 包含重编译。KDE/violin 与本轮前 UMD 使用相同 10k 原始数据，外部时间估计使用相同 100 条结果。原始时间聚合为新增能力，不与历史预聚合输入的编译耗时混比。

| 输入 | compile | render | update | resize |
| --- | --- | --- | --- | --- |
| KDE 10k / 4 系列 | 17 ms | 31 ms | 27 ms | 6 ms |
| violin 10k / 20 组 | 12 ms | 32 ms | 36 ms | 10 ms |
| 时间原始 10k / 100 时刻，默认 1000 次 CI | 208 ms | 25 ms | 220 ms | 7 ms |
| 相同时间原始输入，errorBar=false | 8 ms | 25 ms | 21 ms | 7 ms |
| 相同原始输入，estimator=false 直接显示 10k 点 | 8 ms | 61 ms | 54 ms | 39 ms |

前版 KDE/violin 编译中位数分别约 16/11 ms，新增标准差口径和归一化没有增加 KDE 求值次数；此次测量不作为跨设备阈值。时间原始 bootstrap 为 O(BN)，关闭区间后仍聚合为 100 个点；直接连线保留 10k 图元，渲染与 resize 成本因而不同。全部配置 resize 保持统计结果，release 后 canvas=0，hover 不运行统计。完整 hover/release 和基线数据保留在 JSON。

```sh
npm run test:browser --prefix packages/vchart-statplots -- time-kde-performance.spec.ts
```
