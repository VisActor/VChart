# 28 类图表命名审查

后续已采用新的图表与配置契约，当前可执行接口见 [迁移说明](naming-migration.md)；下文保留当时的审查过程。

日期：2026-09-29。状态：审查建议，尚未修改公共 type、Schema、示例或运行时。

本次对照当前目录、各图的输入契约和编译器审查名称，并核对统计可视化生态中的术语。下列生态对应关系用于支持这次建议，不代表现有实现最初逐一参考了这些库，也不表示计算能力相同。

## 结论与规则

建议保留 7 个 type，调整 21 个 type。其中 `count`、`missingness`、`paired` 和 `estimateInterval` 的调整主要解决语义问题；其他多数调整是让 type 成为完整图表名，统一使用习惯。并非所有短名称都有错误，也不能仅凭改名断言模型命中率提高。

1. 使用常见图表术语和 lowerCamelCase；优先完整名称，如 `countPlot`、`rocCurve`。
2. 已经完整的 `histogram`、`correlationMatrix`、`learningCurve` 保留，不机械追加 `Plot`。
3. 保留 KDE、ECDF、QQ、ROC、SHAP 等专业缩写，写成 `kdePlot`、`qqPlot` 等；中文展示名负责解释。
4. 主名称描述图表，拟合、区间带、累计曲线等可选能力放在说明中。具体变体可有自己的展示名。
5. 每类 Spec 只有一个规范 type。用户习惯叫法在 skill 的选型目录中识别，并映射到 type 和必要选项。
6. 名称不能承诺实现没有提供的行为。`seasonal` 的 `subseries` 是本次发现的实际语义问题，应先修正契约与实现，再向 skill 宣称支持标准季节子序列图。

## 全量建议

“保留”表示保留英文 type，不代表中文展示和选型说明无需改进。

| 当前 type | 建议 type | 建议中文主名称 | 审查理由与能力边界 |
| --- | --- | --- | --- |
| `count` | `countPlot` | 类别计数图 | 避免与计数操作混淆；支持由类别计数归一化得到比例，不是任意数值柱状图。 |
| `missingness` | `missingValueMatrix` | 缺失值矩阵图 | 当前是观测 × 变量的缺失状态矩阵；原名泛指整个缺失数据分析任务。 |
| `histogram` | 保留 | 直方图 | 已是完整、常见的图表名；输入为连续变量的预计算分箱。 |
| `kde` | `kdePlot` | 核密度估计图 | 区分密度估计方法与图表；当前只支持一维预计算密度曲线。 |
| `ecdf` | `ecdfPlot` | 经验累积分布图 | 补齐图表名称；中文必须体现“累积”，不能仅称经验分布。 |
| `boxPlot` | 保留 | 箱线图 | 已是清楚、常用的完整名称。 |
| `violin` | `violinPlot` | 小提琴图 | 与 `boxPlot` 使用同一命名方式，补齐常见术语 violin plot。 |
| `stripPlot` | 保留，明确变体 | 条带图 | 当前还包含 jitter、swarm 布局；具体变体分别展示为抖动散点图、蜂群图，详见下文。 |
| `estimateInterval` | `pointIntervalPlot` | 点估计区间图 | 原名容易被理解为“估计区间”的计算操作；新名表达点与区间，不能统称置信区间图。 |
| `paired` | `pairedComparisonPlot` | 配对比较图 | 明确同一对象两个状态的比较；与多变量的 `pairPlot` 拉开区别。 |
| `scatter` | `scatterPlot` | 散点图 | 补齐完整术语；拟合曲线可选，主名称不应暗示一定有拟合。 |
| `hexbin` | `hexbinPlot` | 六边形分箱图 | 区分分箱操作与图表；接收原始 x/y 散点和分箱分辨率。 |
| `correlationMatrix` | 保留 | 相关矩阵图 | 明确且通用；不是任意数值热力图或缺失状态矩阵。 |
| `pairPlot` | 保留 | 散点矩阵图 | 对应常见 pair plot；当前为两两散点与对角线直方图。 |
| `timeSeries` | `timeSeriesPlot` | 时间序列图 | 区分数据类型与图表；区间带属于可选能力。 |
| `seasonal` | `seasonalPlot` | 季节图 | 补齐 seasonal plot；`subseries` 的实现语义需修正，不能只改 type。 |
| `autocorrelation` | `autocorrelationPlot` | 自相关图 | 区分统计量与图表；`method: pacf` 时展示为偏自相关图。 |
| `scree` | `screePlot` | 碎石图 | 使用完整术语 scree plot；当前纵轴为解释方差比例，累计比例可选。 |
| `embedding` | `embeddingPlot` | 降维散点图 | 明确展示已计算的嵌入坐标；具体方法由 pca、tsne、umap 指定。 |
| `residual` | `residualPlot` | 残差图 | 使用完整术语；当前具体指残差对拟合值，不代表全部残差诊断图。 |
| `qq` | `qqPlot` | Q–Q 图 | 补齐通用术语；当前为样本分位数对理论分位数，不限定正态分布。 |
| `confusionMatrix` | 保留 | 混淆矩阵 | 已是标准名称。 |
| `roc` | `rocCurve` | ROC 曲线 | 使用完整术语，明确为 FPR–TPR 曲线。 |
| `precisionRecall` | `precisionRecallCurve` | PR 曲线 | 明确为精确率–召回率曲线，而非单个指标或表格。 |
| `calibration` | `calibrationCurve` | 概率校准曲线 | 区分校准操作与图表；识别 reliability diagram、可靠性图等叫法。 |
| `learningCurve` | 保留 | 学习曲线 | 当前指训练样本数与训练/验证分数的关系，不能匹配到 epoch–loss 曲线。 |
| `featureImportance` | `featureImportancePlot` | 特征重要性图 | 区分统计结果与图表；具体含义由计算方法决定。 |
| `shapBeeswarm` | `shapBeeswarmPlot` | SHAP 蜂群图 | 保留 SHAP 限定以区分普通蜂群图，并补齐图表名。 |

## 优先处理的语义问题

### 1. `countPlot` 不是通用 `barChart`

当前输入是 `category` 与非负整数 `count`，比例模式从计数归一化。skill 可匹配“各类别有多少”“类别频数”“类别占比”；“各部门平均收入”不能仅因想用柱形展示就匹配到这里。连续变量的分箱频数应选择 `histogram`。

Seaborn 明确区分了 `countplot` 与汇总估计值的 `barplot`。本库可以借鉴名称与选型边界，但不照搬其从原始数据计算统计量的行为。[Seaborn API](https://seaborn.pydata.org/api.html)

### 2. 配对比较、成对关系、蜂群布局需要明确路由

`pairedComparisonPlot` 用同一对象的 `id` 连接两个状态；`pairPlot` 展示多个变量之间的两两关系。中文“配对图”过于接近“成对图”，应使用“配对比较图”和“散点矩阵图”。

保留 `stripPlot` 是一个明确取舍：保留常见入口，并将 jitter/swarm 作为本库的布局变体。它不是宣称 strip plot 与 swarm plot 是同义词；Seaborn 将二者列为不同接口。skill 必须把“蜂群图”映射到 `layout: swarm`，不能仅作为名称别名而遗漏布局。[Seaborn 分类图接口](https://seaborn.pydata.org/api.html#categorical-plots)

不建议为了名字的完全对称而拆出重复 Spec；也不优先改成较长、较泛的 `categoricalScatterPlot`。若将来条带与蜂群出现不同输入契约或独立能力，再评估拆分。

### 3. `pointIntervalPlot` 是语义组合名，不冒充某个 Python API

它表达的是“点估计 + 区间”，当前还提供端帽、参考线及对数轴。区间可以表示置信区间、可信区间、预测区间、标准误、标准差或范围，名称不能预设为 confidence interval。

误差条图可作为候选意图，但需确认是否符合当前按类别排列的点与区间结构。森林图通常还涉及研究标签、权重或合并结果等语义；当前不能把任意“森林图”请求直接当作完整支持。Seaborn 的 `pointplot` 和 Matplotlib 的 `errorbar` 是相关概念，而非本库接口的等价实现。[Matplotlib errorbar](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.errorbar.html)

### 4. `seasonal.subseries` 与标准名称不一致

审查时的旧示例使用 `period = Q1…Q4`、`season = 2024…2026`；旧编译器按 `season` 分面，每个面板横轴为 `period`，得到的是“每年一个面板，面板内展示四个季度”。现已按后续设计修正，见 [新示例](../examples/specs/seasonalPlot.json) 与 [迁移说明](naming-migration.md)。以下保留当时的分析依据。

标准季节子序列图应把同一季度或月份放到一起，观察它在不同年份的变化。对这个示例，应是“Q1、Q2、Q3、Q4 四个面板，面板内展示 2024…2026”。这与现实现的分组方向相反。[Forecasting: Principles and Practice：Seasonal subseries plots](https://otexts.com/fpp3/subseries.html)

建议保留实现标准季节子序列图的目标，修正分组、横轴及排序契约；同时明确周期内位置和周期编号的字段含义。若决定保留当前行为，应将布局命名为分面而非 subseries。该问题需要单独实现和验证，本次不修改代码，也不将“季节子序列图”加入可直接生成的意图映射。

### 5. 主名称不能扩大实际支持范围

- `missingValueMatrix`：缺失状态矩阵；不代表缺失比例柱状图或缺失相关性矩阵。
- `residualPlot`：残差对拟合值；残差分布、残差自相关、残差 Q–Q 应按实际问题选择其他图。
- `qqPlot`：理论分位数对样本分位数；不能自动等同于 P–P 图，也不能默认正态或宣称支持两样本 Q–Q。
- `embeddingPlot`：二维坐标展示；PCA 请求还可能想要解释方差或载荷图，仅凭“PCA”不能决定 type。
- `learningCurve`：训练规模与模型分数；不能把 epoch 填进 `trainSize` 来画训练过程。这一语义与 scikit-learn 的定义一致。[scikit-learn 学习曲线](https://scikit-learn.org/stable/modules/learning_curve.html#learning-curve)
- `calibrationCurve`：预测概率与实际发生率；对应概率校准曲线/可靠性图。[scikit-learn 概率校准](https://scikit-learn.org/stable/modules/calibration.html#calibration-curves)
- `shapBeeswarmPlot`：每条观测的 SHAP 值分布；“SHAP summary”仍需区分蜂群与聚合重要性等展示请求。[SHAP beeswarm](https://shap.readthedocs.io/en/latest/generated/shap.plots.beeswarm.html)

## 面向 skill 的选型目录

仅修改 type 不能解决自然语言命中。建议每类提供中文名称、英文名称、别名、适用问题、输入要求、排除条件；变体单独记录选项。目录不参与运行时宽泛猜测，也不让 JSON Schema 接受一组同义 type。

以下使用建议名称，表示选型结果片段，不是完整可运行 Spec：

| 用户意图 | 应生成的 type 与选项 | 必须区分 |
| --- | --- | --- |
| 类别频数、count plot、countplot | `countPlot` | 输入是类别计数。 |
| 根据计数比较类别比例 | `countPlot` + `normalization: proportion` | 不能把任意已有百分比当作整数 count。 |
| 条带图、strip plot | `stripPlot` + `layout: strip` | 与抖动、非重叠蜂群布局区分。 |
| 抖动散点图、jitter plot（分类轴） | `stripPlot` + `layout: jitter` | 当前契约为类别与数值。 |
| 蜂群图、swarm plot、beeswarm（普通观测） | `stripPlot` + `layout: swarm` | 若展示 SHAP 值，则选择 `shapBeeswarmPlot`。 |
| ACF、自相关图 | `autocorrelationPlot` + `method: acf` | 接收外部计算的自相关统计量。 |
| PACF、偏自相关图 | `autocorrelationPlot` + `method: pacf` | 不能仅匹配 type 后使用错误 method。 |
| PCA 得分散点图 | `embeddingPlot` + `method: pca` | PCA 碎石图应选择 `screePlot`。 |
| UMAP 二维散点图 | `embeddingPlot` + `method: umap` | 需要已计算的坐标。 |
| 干预前后同一对象变化 | `pairedComparisonPlot` | 需要同一对象标识和两个状态。 |
| 多个变量两两关系矩阵 | `pairPlot` | 需要多个变量及观测。 |

检验命中能力时，应使用中文任务描述、英文标准名、Python 函数习惯名及相近反例，分别检查 type、必要选项和输入契约。不要只检查模型是否输出合法枚举值。本轮未运行模型选型评测，不能量化改名收益。

## 后续采用建议时的范围

命名变更需同步类型联合、注册表、Schema、示例、逐图文档、图库标签与 URL、测试以及 skill 选型目录，不能只修改展示文字。旧 URL 和上次查看记录是否迁移，应按实际兼容需求决定；不必让核心 Spec 永久接受所有旧名称。

本轮仅增加本审查文档。现有 [图表目录](catalog.md) 与 Schema 仍是当前可执行 API 的依据。
