# 计算契约

`vchart-statplots` 按图义接收原始观测或外部模型结果。count、histogram、KDE、ECDF、box、violin、hexbin、pair、confusion、ROC、PR、calibration、QQ、ACF/PACF、缺失判断、相关矩阵、分组估计区间、时间序列分组聚合、原始配对探索性回归、普通残差和学习曲线跨折汇总的统计计算在编译阶段完成，渲染、resize 和 hover 不重新扫描原始输入。模型训练、PCA/UMAP/t-SNE、SHAP、标准化/学生化残差、特征重要度、外部模型估计区间仍由调用方提供明确结果。

输入不通用化：count 是 category，confusion 是类别 actual/predicted，ROC/PR 是布尔 actual/有限 score，calibration 是布尔 actual/[0,1] probability，QQ 与 ACF 是 value/series。ACF 按序，QQ 排序；不能共用一种数据清洗策略。

`hexbinPlot` 在编译阶段计算：输入原始 x/y 散点与 `binning.xBins`（默认 30），编译阶段完成固定归一化、六边形分箱和计数。每条观测恰好入一个箱，重复坐标重复计数，仅生成非空箱；颜色表示计数，面积保持一致。resize、hover、主题和配色切换不改变分箱结果。原始数值轴和 tooltip 保留原单位，保形布局在屏幕中维持正六边形。完整规则和数值边界见[逐图契约](plots/hexbinPlot.md)。

`pairPlot` 在编译阶段计算：输入有序 variables 和 data.observations，对角直方图按变量独立排除 null，按有效样本量选择 Sturges 箱数；可用 diagonal.binning.binCount 覆盖。同变量的所有系列共享边界、分别计数，不先丢弃整行。diagonal.type=none 关闭对角分布，非对角仍按变量对排除缺失并按 id 联动。恒定变量只有一个箱；数值规则见[逐图契约](plots/pairPlot.md)。histogram 使用单变量原始输入。

`kdePlot` 和 `ecdfPlot` 接受原始 `{value, series?}` 样本；重复值分别计入；KDE 默认按全体样本比例缩放密度，ECDF 各系列独立归一化。编译阶段直接复用 vutils 的 kde / ecdf，render、resize 和 hover 不扫描原始样本。KDE 默认 Gaussian + Scott，以样本标准差估计带宽（可显式配置 population），带宽倍率作用于固定及自动带宽；单样本和常数系列要求显式正带宽。ECDF 在排序去重后的真实观测位置求概率，保留重复值权重，不使用等距网格。完整规则见 [KDE](plots/kdePlot.md) / [ECDF](plots/ecdfPlot.md)。

## Python 交接

```python
import json
spec = {
    "type": "rocCurve",
    "description": "独立验证集；正例定义为目标事件发生",
    "data": [{"actual": bool(label == positive_label), "score": float(score)}
             for label, score in zip(y_true, y_score)]
}
with open("rocCurve.json", "w", encoding="utf-8") as output:
    json.dump(spec, output, ensure_ascii=False, allow_nan=False)
```

无需输出阈值、坐标或 AUC；库从全部阈值计算。不能依赖 Python 默认允许的 NaN JSON。该片段是原始样本交接示例，不引入 Python 运行依赖。JavaScript 调用方输出同样 JSON 即可，不需要 Python。

## 必须保留的统计含义

- 直方图：提供原始 value 观测及可选 binning.binCount；本包确定边界并计数，按样本总数归一化。左闭右开，最后一箱含最大值；保留零频次箱。密度以面积而不是高度比较概率。
- KDE：保留原始样本、核函数及实际带宽规则；Gaussian 绘制范围截断尾部，不重新归一化。
- ECDF：重复值分别计入分母，真实跳点全部保留，右连续；边界连接点不计入样本量。
- 箱线图：原始 category/value/series，重复值分别计入；四分位数复用 vutils 线性插值，whiskers.iqrMultiplier 默认 1.5。小样本须候选落入箱体时取对应四分位数；零 IQR 不自动改为 min/max。详见[箱线图契约](plots/boxPlot.md)。
- 小提琴：原始 category/value/series，复用与 kdePlot 相同的 KDE；area 默认共享密度峰值尺度、width 等最大宽度、count 按样本数缩放；归一化范围默认同系列跨分类；采样密度为私有绘图结果。
- 区间：observations 模式用 estimator/errorBar 选择真实计算，estimates 模式用 interval 声明外部区间。
- 模型：训练/验证来源、正例定义、指标名称、ROC AUC 与 PR AP 由原始标签和分数内部计算；其他模型指标由外部提供。
- 相关矩阵：原始 variables/observations，逐对排除 null，method 选择真实算法；常量和样本不足显示 NA。
- 降维：坐标、方法及仅 PCA 允许的解释率；不要把 UMAP 轴命名为解释方差。
- SHAP：每行独立的 shapValue 与 featureValue；不同特征的原单位不可直接混合比较颜色。
- pairPlot：原始观测 id、有序变量及每个变量的 null；对角分箱由库生成，按 [start,end)，最后一箱含 end；各组共用边界，计数不暗中归一化。

所有随机计算在计算端指定并记录种子。本包 jitter 按 id 确定性生成，swarm 按数值位置和 id 排序，不使用随机数；输入顺序变化不改变同一画布尺寸的蜂群排布。

## 可复现的两条交接链

在包目录执行 `python3 examples/python/histogram.py > histogram.json`，将文件内容粘贴到示例页的 Spec 输入框并绘制。Python 只输出原始 value=[0,1,2,3,4]、binCount=2 与 density，不预先分箱。浏览器计算边界 [0,2,4]、计数 [2,3]，密度高度 [0.2,0.3]，面积和为 1。

浏览器同样提交原始观测，调用 `chart.updateSpec(compileStatPlot(nextSpec))`；交接测试改为 value=[0,1,2,4]，两箱密度均为 0.25，并验证实例未更换。Python 不参与前端渲染，也不是运行依赖。只持有预分箱计数的调用方应使用 VChart 原生 histogram，不能通过展开 count 伪造原始样本。

## 数值基准复现

`__tests__/fixtures/raw-input-python.json` 固定 numpy=1.26.4、scipy=1.13.1、scikit-learn=1.5.2、statsmodels=0.14.4。使用相同版本运行 `scripts/generate-raw-input-fixtures.py`，再运行 raw-input-python 单元测试。ROC 保留全部阈值；PR 逆转 sklearn 输出为 recall 升序并保留无阈值起点；calibration 对照等宽/等频；QQ 对照 ProbPlot(a=0,fit=False)；ACF 对照 adjusted=False、fft=False，PACF 对照 ywm。正态逆 CDF 对照 scipy，绝对误差上限 5e-8（包括 1e-12 尾部与算法分段边界）。这些 Python 包仅用于生成测试基准，不是运行依赖。

## 本轮表格与模型结果入口

missingValueMatrix 与 correlationMatrix 从 variables/data.observations 生成私有绘图结果；pointIntervalPlot 明确 observations/estimates，residualPlot 明确 observations/predictions/residuals，learningCurve 明确 folds/summaries。各模式的精确边界见对应逐图契约。validate 仅执行结构和廉价参数校验，完整统计只在 compile 执行一次；resize/hover/图例不会扫描原始数据。

`__tests__/fixtures/input-alignment-python.json` 固定 numpy=1.26.4、scipy=1.13.1、sklearn=1.5.2、pandas=2.2.2，记录 21 组输入、参数与容差 5e−8。使用 `scripts/generate-input-alignment-fixtures.py` 复现；涵盖逐对相关性、并列秩、tau-b、样本区间与总体折间 SD。bootstrap 使用相同 LCG 重采样索引与 NumPy 分位数对照，不承诺 NumPy 相同 seed 的随机输出一致。

## 探索性回归边界

一元线性、多项式和 LOWESS 属于图内统计，在 compile 阶段按系列独立执行。scatterPlot 内部 fit 从同一 data 原始 x/y 拟合；外部 estimates 只展示。residualPlot 原始模式直接在观测 x 上预测，regression 控制生成残差的模型，smooth 单独控制趋势。外部预测和标准化/学生化模型残差继续保留。两图共用 vutils 标准求解路径与私有分组适配，不把模型对象存入图元数据，不在交互阶段重算。

线性/多项式均值响应置信带为成对 percentile bootstrap；LOWESS 无内部置信带。全量 LOWESS 的 delta 是显式插值策略，不丢观测或自动关闭稳健迭代。使用 vutils 自 1.0.26 起提供的稳定回归和 regressionBootstrap，正式依赖下限为 `~1.0.28`。

时间序列 input=observations 按系列及真实时刻汇总，默认均值与 95% bootstrap CI；input=estimates 展示外部区间。日期稳定排序，同一真实时刻的时区别名在原始模式合并、外部模式拒绝重复。null 保留显式缺口，不补时序网格。算法与 pointIntervalPlot 共用，详见[时间序列](plots/timeSeriesPlot.md)。
