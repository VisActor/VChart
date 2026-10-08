# 性能基准

首版测试环境与实际数值见同目录 `results.json`。2026-09-30 命名优化的同环境前后测量见 [验收记录](../docs/validation.md)。数值是本机测量，不作为跨设备 SLA。

```sh
# 仓库根目录，先构建包。
node packages/vchart-statplots/benchmarks/run.mjs
npm run test:browser --prefix packages/vchart-statplots -- --grep 'performance|useful scales'
```

Node 场景暖机一次后测量 9 次，报告中位数及样本最大值（近似 p95）；compile 包含边界校验。包括 1 万 / 5 万 ROC 点、1 千 / 1 万蜂群点和 1 万完全重复值。UMD gzip 大小不包含外部 VChart。

浏览器关闭动画、DPR=1、UTC、本地资源。ROC 原生 line 与 statplots 使用相同轴、点、线、主题和画布；对照暖机后各测一次。浏览器时间含测量噪声，不能据单次差异推断回归。小提琴明确为 10 组、每组 1,000 个密度采样点。

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
