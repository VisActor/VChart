# 图表选型与语义契约

28 类规范名称与 [机器可读目录](plot-catalog.json) 一致。统计计算边界见 [计算契约](computation-contract.md)，旧配置见 [迁移说明](naming-migration.md)。

| 图表                                           | type                    | 适用问题                                                     |
| ---------------------------------------------- | ----------------------- | ------------------------------------------------------------ |
| [类别计数图](plots/countPlot.md)               | `countPlot`             | 比较各客户类别有多少条观测。                                 |
| [缺失值矩阵图](plots/missingValueMatrix.md)    | `missingValueMatrix`    | 检查每条观测各变量的缺失位置。                               |
| [直方图](plots/histogram.md)                   | `histogram`             | 从原始连续变量观测查看分箱分布和尾部。                       |
| [核密度估计图](plots/kdePlot.md)               | `kdePlot`               | 从原始样本估计一维概率密度，比较不同系列的分布。             |
| [经验累积分布图](plots/ecdfPlot.md)            | `ecdfPlot`              | 从原始样本计算经验累积概率，保留真实跳点并比较不同系列。     |
| [箱线图](plots/boxPlot.md)                     | `boxPlot`               | 从原始分类观测计算四分位数、须和异常值，比较组间分布。       |
| [小提琴图](plots/violinPlot.md)                | `violinPlot`            | 从原始样本比较不同组的核密度分布形状。                       |
| [条带图](plots/stripPlot.md)                   | `stripPlot`             | 查看各类别中每条观测的数值。                                 |
| [点估计区间图](plots/pointIntervalPlot.md)     | `pointIntervalPlot`     | 从分组样本估计区间或展示外部估计结果。                       |
| [配对比较图](plots/pairedComparisonPlot.md)    | `pairedComparisonPlot`  | 比较同一对象干预前后的两次观测。                             |
| [散点图](plots/scatterPlot.md)                 | `scatterPlot`           | 查看原始 x/y 关系，可内部回归或展示外部曲线。                |
| [六边形分箱图](plots/hexbinPlot.md)            | `hexbinPlot`            | 汇总大量二维散点的局部分布，颜色表示每个六边形箱内的观测数。 |
| [相关矩阵图](plots/correlationMatrix.md)       | `correlationMatrix`     | 从原始表格计算变量相关方向和强度。                           |
| [散点矩阵图](plots/pairPlot.md)                | `pairPlot`              | 从原始观测查看多个数值变量的两两关系和自动计算的对角分布。   |
| [时间序列图](plots/timeSeriesPlot.md)          | `timeSeriesPlot`        | 从原始重复时间观测估计趋势和区间，或展示外部估计。           |
| [季节图](plots/seasonalPlot.md)                | `seasonalPlot`          | 比较不同年份的季度形状。                                     |
| [自相关图](plots/autocorrelationPlot.md)       | `autocorrelationPlot`   | 查看时间序列各滞后阶的自相关。                               |
| [碎石图](plots/screePlot.md)                   | `screePlot`             | 查看各成分解释方差比例。                                     |
| [降维散点图](plots/embeddingPlot.md)           | `embeddingPlot`         | 展示已计算的二维降维坐标。                                   |
| [残差图](plots/residualPlot.md)                | `residualPlot`          | 从原始 x/y 回归后检查残差结构，也支持外部预测/残差。         |
| [Q–Q 图](plots/qqPlot.md)                      | `qqPlot`                | 比较样本分位数与给定理论分布分位数。                         |
| [混淆矩阵](plots/confusionMatrix.md)           | `confusionMatrix`       | 检查实际类别与预测类别的错误分布。                           |
| [ROC 曲线](plots/rocCurve.md)                  | `rocCurve`              | 比较不同分类阈值的真阳性率与假阳性率。                       |
| [PR 曲线](plots/precisionRecallCurve.md)       | `precisionRecallCurve`  | 比较不同阈值的精确率与召回率。                               |
| [概率校准曲线](plots/calibrationCurve.md)      | `calibrationCurve`      | 检查预测概率与实际正例比例是否一致。                         |
| [学习曲线](plots/learningCurve.md)             | `learningCurve`         | 比较训练样本数变化时的训练与验证分数。                       |
| [特征重要性图](plots/featureImportancePlot.md) | `featureImportancePlot` | 比较给定方法算出的各特征重要性。                             |
| [SHAP 蜂群图](plots/shapBeeswarmPlot.md)       | `shapBeeswarmPlot`      | 查看各特征逐观测的 SHAP 贡献与特征值。                       |

## 原始输入选型

count 传原始类别；confusion 传每个样本的实际/预测类别；ROC、PR 传布尔标签和评分；calibration 传布尔标签和概率；QQ 传一维样本；ACF/PACF 传按序一维序列。统计结果由编译器生成，修改有效计算参数会重算。其余模型结果图的外部计算职责见[计算契约](computation-contract.md)。
