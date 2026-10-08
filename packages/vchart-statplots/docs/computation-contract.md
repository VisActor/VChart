# 计算契约

`vchart-statplots` 通常接受可解释的预计算结果。Python 或调用方 JS 负责数据清洗、缺失策略、KDE、拟合、bootstrap、PCA/UMAP/t-SNE、ACF/PACF、SHAP、模型评价和统计推断。histogram 的单变量分箱由本包完成。其余本包计算包括计数归一化、比率累加、密度轮廓宽度、坐标布局和颜色映射。

`hexbinPlot` 是明确的计算例外：输入原始 x/y 散点与 `binning.xBins`（默认 30），编译阶段完成固定归一化、六边形分箱和计数。每条观测恰好入一个箱，重复坐标重复计数，仅生成非空箱；颜色表示计数，面积保持一致。resize、hover、主题和配色切换不改变分箱结果。原始数值轴和 tooltip 保留原单位，保形布局在屏幕中维持正六边形。完整规则和数值边界见[逐图契约](plots/hexbinPlot.md)。

`pairPlot` 是另一项明确的计算例外：输入有序 variables 和 data.observations，对角直方图按变量独立排除 null，按有效样本量选择 Sturges 箱数；可用 diagonal.binning.binCount 覆盖。同变量的所有系列共享边界、分别计数，不先丢弃整行。diagonal.type=none 关闭对角分布，非对角仍按变量对排除缺失并按 id 联动。恒定变量只有一个箱；数值规则见[逐图契约](plots/pairPlot.md)。histogram 使用单变量原始输入；kdePlot 仍接收预计算密度采样。

## Python 交接

```python
import json
from sklearn.metrics import roc_curve, roc_auc_score

fpr, tpr, thresholds = roc_curve(y_true, y_score)
spec = {
    "type": "rocCurve",
    "description": "独立验证集；正例定义为目标事件发生",
    "data": [{"fpr": float(x), "tpr": float(y)} for x, y in zip(fpr, tpr)],
    "metrics": [{"auc": float(roc_auc_score(y_true, y_score))}]
}
with open("rocCurve.json", "w", encoding="utf-8") as output:
    json.dump(spec, output, ensure_ascii=False, allow_nan=False)
```

阈值首项可能无限，非必要可省略；若保留 threshold，仅输出有限值。不能依赖 Python 默认允许的 NaN JSON。该片段是外部计算示例，不引入 Python 运行依赖。JavaScript 调用方输出同样 JSON 即可，不需要 Python。

## 必须保留的统计含义

- 直方图：提供原始 value 观测及可选 binning.binCount；本包确定边界并计数，按样本总数归一化。左闭右开，最后一箱含最大值；保留零频次箱。密度以面积而不是高度比较概率。
- 箱线图：须规则与异常点；小提琴：密度采样、可选方法说明放 description。
- 区间：计算方法放 description，区间种类及水平/倍数放 interval。
- 模型：训练/验证来源、正例定义、指标名称、外部 AUC/AP；不能从画出的折线代替原评估结果。
- 相关矩阵：方法、常量等导致的 null；不要把不可计算替换为 0。
- 降维：坐标、方法及仅 PCA 允许的解释率；不要把 UMAP 轴命名为解释方差。
- SHAP：每行独立的 shapValue 与 featureValue；不同特征的原单位不可直接混合比较颜色。
- pairPlot：原始观测 id、有序变量及每个变量的 null；对角分箱由库生成，按 [start,end)，最后一箱含 end；各组共用边界，计数不暗中归一化。

所有随机计算在计算端指定并记录种子。本包 jitter 按 id 确定性生成，swarm 按数值位置和 id 排序，不使用随机数；输入顺序变化不改变同一画布尺寸的蜂群排布。

## 可复现的两条交接链

在包目录执行 `python3 examples/python/histogram.py > histogram.json`，将文件内容粘贴到示例页的 Spec 输入框并绘制。Python 只输出原始 value=[0,1,2,3,4]、binCount=2 与 density，不预先分箱。浏览器计算边界 [0,2,4]、计数 [2,3]，密度高度 [0.2,0.3]，面积和为 1。

浏览器同样提交原始观测，调用 `chart.updateSpec(compileStatPlot(nextSpec))`；交接测试改为 value=[0,1,2,4]，两箱密度均为 0.25，并验证实例未更换。Python 不参与前端渲染，也不是运行依赖。只持有预分箱计数的调用方应使用 VChart 原生 histogram，不能通过展开 count 伪造原始样本。
