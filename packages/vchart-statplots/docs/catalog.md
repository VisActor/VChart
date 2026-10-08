# 图表选型与语义契约

28 类规范名称与 [机器可读目录](plot-catalog.json) 一致。统计计算边界见 [计算契约](computation-contract.md)，旧配置见 [迁移说明](naming-migration.md)。

| 图表 | type | 适用问题 |
| --- | --- | --- |
| [类别计数图](plots/countPlot.md) | `countPlot` | 比较各客户类别有多少条观测。 |
| [缺失值矩阵图](plots/missingValueMatrix.md) | `missingValueMatrix` | 检查每条观测各变量的缺失位置。 |
| [直方图](plots/histogram.md)                   | `histogram`             | 从原始连续变量观测查看分箱分布和尾部。                               |
| [核密度估计图](plots/kdePlot.md) | `kdePlot` | 比较已计算的一维核密度曲线。 |
| [经验累积分布图](plots/ecdfPlot.md) | `ecdfPlot` | 比较样本的累计概率与尾部。 |
| [箱线图](plots/boxPlot.md) | `boxPlot` | 比较组间四分位数、中位数与异常值。 |
| [小提琴图](plots/violinPlot.md) | `violinPlot` | 比较不同组预计算密度的分布形状。 |
| [条带图](plots/stripPlot.md) | `stripPlot` | 查看各类别中每条观测的数值。 |
| [点估计区间图](plots/pointIntervalPlot.md) | `pointIntervalPlot` | 比较各组点估计与已经计算的区间。 |
| [配对比较图](plots/pairedComparisonPlot.md) | `pairedComparisonPlot` | 比较同一对象干预前后的两次观测。 |
| [散点图](plots/scatterPlot.md) | `scatterPlot` | 查看两个数值变量的关系。 |
| [六边形分箱图](plots/hexbinPlot.md) | `hexbinPlot` | 汇总大量二维散点的局部分布，颜色表示每个六边形箱内的观测数。 |
| [相关矩阵图](plots/correlationMatrix.md) | `correlationMatrix` | 比较多个变量的相关方向和强度。 |
| [散点矩阵图](plots/pairPlot.md)                | `pairPlot`              | 从原始观测查看多个数值变量的两两关系和自动计算的对角分布。   |
| [时间序列图](plots/timeSeriesPlot.md) | `timeSeriesPlot` | 查看随时间变化的数值及已有区间。 |
| [季节图](plots/seasonalPlot.md) | `seasonalPlot` | 比较不同年份的季度形状。 |
| [自相关图](plots/autocorrelationPlot.md) | `autocorrelationPlot` | 查看时间序列各滞后阶的自相关。 |
| [碎石图](plots/screePlot.md) | `screePlot` | 查看各成分解释方差比例。 |
| [降维散点图](plots/embeddingPlot.md) | `embeddingPlot` | 展示已计算的二维降维坐标。 |
| [残差图](plots/residualPlot.md) | `residualPlot` | 检查残差随拟合值变化是否存在结构。 |
| [Q–Q 图](plots/qqPlot.md) | `qqPlot` | 比较样本分位数与给定理论分布分位数。 |
| [混淆矩阵](plots/confusionMatrix.md) | `confusionMatrix` | 检查实际类别与预测类别的错误分布。 |
| [ROC 曲线](plots/rocCurve.md) | `rocCurve` | 比较不同分类阈值的真阳性率与假阳性率。 |
| [PR 曲线](plots/precisionRecallCurve.md) | `precisionRecallCurve` | 比较不同阈值的精确率与召回率。 |
| [概率校准曲线](plots/calibrationCurve.md) | `calibrationCurve` | 检查预测概率与实际正例比例是否一致。 |
| [学习曲线](plots/learningCurve.md) | `learningCurve` | 比较训练样本数变化时的训练与验证分数。 |
| [特征重要性图](plots/featureImportancePlot.md) | `featureImportancePlot` | 比较给定方法算出的各特征重要性。 |
| [SHAP 蜂群图](plots/shapBeeswarmPlot.md) | `shapBeeswarmPlot` | 查看各特征逐观测的 SHAP 贡献与特征值。 |
