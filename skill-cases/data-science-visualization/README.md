# data-science-visualization 固定任务

使用 [data-science-visualization](../../skills/data-science-visualization/SKILL.md) 完成以下中文任务。每例围绕一个独立问题，只要求一种不同图型；输入均为原创模拟数据，模型场景提供固定的模拟结果，不要求训练或推断。

| 用例 | 典型图型 | 回答的问题 | 明确请求的交互 |
| --- | --- | --- | --- |
| [订单金额分布](order-value-histogram/README.md) | `histogram` 直方图 | 金额落在哪些区间，长尾如何分布？ | 5/10/20 箱切换 |
| [配送时长分布](delivery-time-violin/README.md) | `violinPlot` 小提琴图 | 各方案的分布形状有何不同？ | 无额外控件 |
| [传感器变量关系](sensor-correlation/README.md) | `correlationMatrix` 相关矩阵 | 多个测量变量怎样共同变化？ | Pearson/Spearman/Kendall 切换 |
| [设备前后响应](paired-response/README.md) | `pairedComparisonPlot` 配对比较图 | 同一设备的前后数值如何变化？ | 无额外控件 |
| [验证集残差](regression-residuals/README.md) | `residualPlot` 残差图 | 已有预测误差是否呈现结构？ | 无额外控件 |
| [不平衡分类评估](imbalanced-classifier-pr/README.md) | `precisionRecallCurve` PR 曲线 | 各阈值下查准与查全如何权衡？ | 模型图例过滤 |
| [PCA 投影](pca-projection/README.md) | `embeddingPlot` 降维散点图 | 已有主成分得分怎样分布？ | 无额外控件 |
| [逐样本模型解释](model-shap-beeswarm/README.md) | `shapBeeswarmPlot` SHAP 蜂群图 | 240 个样本的密集堆叠、特征值与贡献方向如何对应？ | 无额外控件 |

所有图保留真实 Tooltip；静态图例或色标不等同于用户请求了过滤。默认不添加筛选、主题切换、导出按钮或分析面板。

已审查作品见 [examples/data-science-visualization](../../examples/data-science-visualization/README.md)，[最新结果与验证索引](../../docs/superpowers/validation/2026-11-17-data-science-visualization-case-results.md)单独记录执行范围与未决事项。执行固定任务时不向 Agent 提供这些结果和预览。

## 执行方式

1. 选择一例，先由验收者核对 `fixtures.json` 的输入文件清单、来源和 SHA-256。记录待测 Skill 的 commit 或本地差异，以及 Agent/模型和宿主版本。
2. 准备独立工作区，安装完整待测 Skill。只复制该例的 `prompt.md` 与 `inputs/`，不要给 Agent 读取本目录或父目录的验收 README、校验清单及维护端验证请求。
3. 在工作区执行固定提示词；任务已授权端到端生成，遇到真实数据口径缺失或宿主能力限制仍应说明。不要读取另一次执行的结果作为答案。
4. 完成后再由验收者按本页及该例 README 检查结果，实际打开 HTML 和操作交互；保留结果、截图、可获得的日志及简短检查记录。

例如，从仓库根目录准备直方图用例的首次本地工作区（后续执行请换新目录名）：

```sh
mkdir -p .vchart-statplots/skill-cases/order-value-histogram/run-01
cp skill-cases/data-science-visualization/order-value-histogram/prompt.md \
  .vchart-statplots/skill-cases/order-value-histogram/run-01/
cp -R skill-cases/data-science-visualization/order-value-histogram/inputs \
  .vchart-statplots/skill-cases/order-value-histogram/run-01/
```

若宿主可以浏览整个仓库，复制目录本身不能保证隔离；应在仓库外或限制可读范围的独立会话执行。

## 公共验收标准

- **三份交付**：新的 `outputs/` 下同时有 `visualization.html`、`visualization.request.json`、`visualization.data.json`，给出可用文件入口。不能只交截图或正文文件名。
- **规范生成**：使用 Skill 固定生成器及其 `release.json` 指定的同版本库；不重写统计计算或绘图运行时。Python 3.11+；这些输入仅需标准库，不需要 XLSX 依赖。
- **可独立打开**：HTML 内嵌使用数据，打开时仅依赖固定 CDN 脚本、网络和外部脚本权限，不依赖原始 CSV/JSON 路径或仓库服务。CDN 不可达时标注阻断，不能记为渲染通过。
- **真实渲染**：逐图核对 `status=rendered`（宿主允许读取时）与实际图元；仅文件、canvas 或批次 `ready` 存在不足以通过。
- **Tooltip**：实际悬停每例指定的代表图元，核对出现内容与数值、单位、样本/分组含义。程序派发事件或静态查看源码不能代替真实悬停。
- **按需交互**：用真实控件操作并观察结果，随后恢复初始视图。结合成功 Spec/图元状态区分控件文字变化与实际图表变化；无额外控件的用例不应默认添加控件。
- **数据与来源**：全部使用行、稳定 ID、重复观测、单位、分组、方法和模拟来源均与输入一致。只省略图型契约不接受的缺失必需值，并能在 data 中追溯；禁止静默采样、截断、填补或伪造结果。
- **重放**：在另一新目录用交付的 request 再运行固定生成器，检查无需原始输入文件即可重建同一初始请求的图型、数据和选项。浏览器中的临时选择不自动改变磁盘文件。
- **阅读与结论**：标题回答实际变量/范围，轴、图例、色标、图注可读且没有遮挡；模拟结果不冒充现实证据，相关、配对、PCA 或 SHAP 不推出因果。
- **报告真实性**：区分工程校验、实际操作与人工视觉检查。记录“检查项｜实际操作｜观察结果｜已验证/未验证及原因”；未完成步骤、环境阻断或部分交付如实列出，不写成通过。

## 当前覆盖边界

这里维护 8 个固定 Agent 任务的定义，执行结论以上方验证索引为准。已有本地执行由参与用例编写的当前会话完成，未作为独立盲测或多宿主评测；图型合法性和生成器检查不能替代真实 Tooltip、控件操作或视觉查看。本组用例突出典型图型，不穷举全部图型、输入格式、异常或多轮对话。
