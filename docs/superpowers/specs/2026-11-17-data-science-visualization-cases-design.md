# 数据科学可视化固定任务设计

## 目标与范围

按用户确认的 `skill-cases/data-science-visualization/` 目录，参考 VisActor/skills 的固定任务规范，新增 8 个中文任务。突出典型数据科学图表，每例只要求一种不同图型，不修改 Skill 或图库运行时。

| 目录 | 图型 | 场景 |
| --- | --- | --- |
| order-value-histogram | histogram | 订单金额的长尾分布与分箱调整 |
| delivery-time-violin | violinPlot | 三种配送方案的时长分布形状 |
| sensor-correlation | correlationMatrix | 传感器变量相关、逐对缺失与常量 |
| paired-response | pairedComparisonPlot | 同一设备升级前后的响应时间 |
| regression-residuals | residualPlot | 已有验证集预测的残差结构 |
| imbalanced-classifier-pr | precisionRecallCurve | 不平衡二分类的阈值与模型比较 |
| pca-projection | embeddingPlot | 已计算 PCA 得分与解释方差 |
| model-shap-beeswarm | shapBeeswarmPlot | 已有逐样本 SHAP 贡献与特征值 |

## 目录与输入

每例包含 `README.md`（验收）、`prompt.md`（执行任务）、独立 `inputs/`（数据和口径）及 `fixtures.json`（逐文件来源、SHA-256）。输入为自行构造的公开模拟材料，不声称来自真实业务、实验或已训练模型。已有模型输出场景是固定的模拟输出，不要求重新训练、降维或计算 SHAP。

根目录说明固定任务的执行隔离和维护规则；Skill 目录索引列出覆盖类型及公共交付要求。输入与提示词可交给 Agent，验收说明与校验清单不交给 Agent。不制作或分发标准答案，不要求固定配色、布局或像素相同。

## 交付与验收

成功任务交付 `visualization.html`、`visualization.request.json`、`visualization.data.json`，按固定生成器生成。逐例要求真实图元、Tooltip 和所请求交互；仅文件存在或 ready 状态不能计为通过。核对统计定义、完整使用数据、稳定 ID、单位与来源。数据事实用可重算数字约束，不强制统计结论出现在页面。

自动检查本次新增文件的完整性、输入哈希、相对链接与数据事实；用维护端临时请求验证输入可被当前发布版本接受及重放。该检查不代替真实 Agent 固定任务执行或人工视觉验收，未执行的维度如实记录。本次材料不修改运行时，按文档与输入改动运行必要检查；提交或 PR 遵循仓库流程及用户授权。
