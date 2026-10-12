# 按目的选择图表

先明确用户想观察什么，再按 [目录](statplots/docs/plot-catalog.json) 的 useWhen/avoidWhen/variants 选择规范 type。下面只记录会影响决策的边界，逐图字段由上游 Schema 维护。

| 需求 | 首选与限制 |
| --- | --- |
| 连续变量分布/长尾 | histogram 接受原始 value；等宽分箱可调，组比较改用 KDE/ECDF 或分图 |
| 分组的分布形状 | kdePlot/violinPlot 的核与带宽是真实估计；单样本/常量组默认自动带宽可能无法估计，明确实际固定带宽或与用户选择 strip/box，不静默换图 |
| 累计占比/阈值位置 | ecdfPlot 保留重复值权重和真实跳点 |
| 类别人数/占比 | countPlot 是逐条观测计数；比例分母区分全表与系列内，不用于组均值或已有频数表 |
| 分组数值比较 | boxPlot 展示分位数；violinPlot 展示密度，宽度归一化不能当显著性；stripPlot 展示个体并保留 ID |
| 两个数值关系 | scatterPlot 默认不加 fit；密集点可明确改为 hexbinPlot，后者不支持 series |
| 多变量关系 | correlationMatrix 用真实数值列，不含数值 ID；pairPlot 限 4 变量，面板可用 n 不同，不整行删除 null |
| 缺失位置 | missingValueMatrix 保留原始数字/字符串/布尔/null；缺失率或缺失相关性不是它的输入 |
| 配对前后 | pairedComparisonPlot 需要真实对象 ID 与阶段；不能按两组的行顺序伪造配对，首版用直接 Spec |
| 已有结果 | embeddingPlot 使用真实二维得分；screePlot 使用解释率；PCA 载荷、因子载荷不能冒充这些结果 |
| 模型评估 | ROC/PR 用真实标签和 score，校准用 probability；明确正例及验证数据范围，不能由图表反推训练模型 |

常见别名：蜂群 → stripPlot + layout=swarm；SHAP 蜂群 → shapBeeswarmPlot；偏自相关 → autocorrelationPlot + method=pacf；UMAP → embeddingPlot + method=umap。详细变体从目录按需读，不复制另一套别名表。

给数据但没有具体问题时，先选一张能揭示主要分布或质量的图，简短说明选择依据；需要完整自主分析和报告时使用分析工作流。数据含义不能确定时继续检查质量，同时澄清会影响图义的那个字段，不用方法名清单让用户选择。
