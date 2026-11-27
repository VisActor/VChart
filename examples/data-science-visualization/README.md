# 数据科学可视化案例

8 个中文案例分别展示一种典型图型。每例均附完整模拟输入、任务提示词、可交互 HTML、可重放 request、使用数据及来源，以及真实页面预览。

| 案例 | 图型 | 输入规模 | 结果 | 预览 |
| --- | --- | --- | --- | --- |
| [订单实付金额分布](order-value-histogram/README.md) | `histogram` 直方图 | 32 笔订单，30 个有效金额 | [HTML](order-value-histogram/result/visualization.html) | [PNG](order-value-histogram/preview.png) |
| [不同配送方案的时长分布](delivery-time-violin/README.md) | `violinPlot` 小提琴图 | 120 笔配送，三组 | [HTML](delivery-time-violin/result/visualization.html) | [PNG](delivery-time-violin/preview.png) |
| [传感器测量变量的相关关系](sensor-correlation/README.md) | `correlationMatrix` 相关矩阵 | 12 台设备，四个测量变量 | [HTML](sensor-correlation/result/visualization.html) | [PNG](sensor-correlation/preview.png) |
| [同一设备升级前后的响应时间](paired-response/README.md) | `pairedComparisonPlot` 配对比较图 | 13 台设备，25 条阶段观测 | [HTML](paired-response/result/visualization.html) | [PNG](paired-response/preview.png) |
| [验证集预测的残差结构](regression-residuals/README.md) | `residualPlot` 残差图 | 20 条已有预测 | [HTML](regression-residuals/result/visualization.html) | [PNG](regression-residuals/preview.png) |
| [不平衡分类的精确率与召回率](imbalanced-classifier-pr/README.md) | `precisionRecallCurve` PR 曲线 | 40 个样本，两个模型 | [HTML](imbalanced-classifier-pr/result/visualization.html) | [PNG](imbalanced-classifier-pr/preview.png) |
| [三批样本的 PCA 得分投影](pca-projection/README.md) | `embeddingPlot` PCA 降维散点图 | 30 个二维得分 | [HTML](pca-projection/result/visualization.html) | [PNG](pca-projection/preview.png) |
| [240 个样本的 SHAP 特征贡献](model-shap-beeswarm/README.md) | `shapBeeswarmPlot` SHAP 蜂群图 | 240 个样本，720 条特征记录 | [HTML](model-shap-beeswarm/result/visualization.html) | [PNG](model-shap-beeswarm/preview.png) |

## 打开与复作

下载所选案例，按其 README 打开 `result/visualization.html`。HTML 内嵌使用数据，依赖 `unpkg.com` 上 VChart/statplots 2.2.2 固定版本脚本；打开时需要网络和外部脚本权限，未包含完全离线的库副本。

安装完整的 [data-science-visualization](../../skills/data-science-visualization/SKILL.md)，只将所选案例的 `prompt.md` 与 `inputs/` 复制到独立工作区交给 Agent。复作时不要把 `result/`、预览或验收说明当作输入。已有结果可使用 `visualization.request.json` 在新目录重放或继续改图。

输入均为原创模拟材料，不代表真实业务、实验或模型评估结果。特征贡献、相关和配对变化不表示因果，PCA 批次标签不是聚类结果。密集 SHAP 保留全部样本和拥挤警告，窄屏可能发生重叠。

固定任务及独立验收标准见 [skill-cases](../../skill-cases/data-science-visualization/README.md)。[最新结果与验证索引](../../docs/superpowers/validation/2026-11-17-data-science-visualization-case-results.md)记录实际执行范围、文件版本和未决事项；展示作品的存在不代表所有宿主或无点击悬停路径均已验收。
