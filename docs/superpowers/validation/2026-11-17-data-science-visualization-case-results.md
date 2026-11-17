# data-science-visualization 最新结果与验证索引

日期：2026-11-17。本页汇总 8 个固定任务的最新选定产物；展示目录中不混入原始日志和诊断候选。

## 版本与环境

- Skill 源代码提交：`2254704c6f00f91c19d486e07006b323f5cf6dc8`，执行所用运行时没有本地修改；VChart/statplots 依赖为 2.2.2。依赖版本不作为独立 Skill 版本号。
- 执行者为当前 Codex 会话；宿主未提供可核对的模型标识。Python 3.11.16，Node.js 22.23.3；使用内置浏览器，PCA/SHAP 另用 Playwright Chromium，原执行的确切浏览器版本未记录，提交复核版本另记于下方。
- 当前会话参与过用例编写，**不是独立盲测**。归档未重新调用模型生成作品，也未将现有结果当作新一轮 Agent 执行。
- [文件与输入 SHA-256 清单](2026-11-17-data-science-visualization-case-results.json)记录提示词、输入、三份结果和预览，便于后续识别输入或结果变更。

## 最新选定结果

| 用例 | 选定执行 | 数据规模 | 实际 Tooltip 检查 | 按需交互/页面行为 |
| --- | --- | --- | --- | --- |
| [订单实付金额分布](../../../examples/data-science-visualization/order-value-histogram/README.md) | `2026-11-17-run-01` | 32 笔订单，30 个有效金额 | 点击定位首箱、末箱及切换后的首箱，核对区间与计数。 | 5→10→20→5 的真实下拉操作已核对，柱形和 Tooltip 同步改变。 |
| [不同配送方案的时长分布](../../../examples/data-science-visualization/delivery-time-violin/README.md) | `2026-11-17-run-01` | 120 笔配送，三组 | 点击定位三组轮廓，核对 N、原始极值、实际带宽及峰值密度。 | 未请求额外控件，页面未添加。 |
| [传感器测量变量的相关关系](../../../examples/data-science-visualization/sensor-correlation/README.md) | `2026-11-17-run-01` | 12 台设备，四个测量变量 | 点击定位温度–压力、压力–流量及电压–电压，核对相关值、N 和 NA 原因。 | Pearson→Spearman→Kendall→Pearson 的真实下拉操作已核对，Tooltip 中 method 更新。 |
| [同一设备升级前后的响应时间](../../../examples/data-science-visualization/paired-response/README.md) | `2026-11-17-run-01` | 13 台设备，25 条阶段观测 | 点击定位 001 两阶段、005 升级后及 013 未配对单点，核对 ID、阶段和值。 | 未请求额外控件，阶段顺序及未配对单点已查看。 |
| [验证集预测的残差结构](../../../examples/data-science-visualization/regression-residuals/README.md) | `2026-11-17-run-01` | 20 条已有预测 | 点击定位 V001、V010、V020，核对预测与正负残差及单位。 | 未请求额外控件，零线和原始残差横纵轴已查看。 |
| [不平衡分类的精确率与召回率](../../../examples/data-science-visualization/imbalanced-classifier-pr/README.md) | `2026-11-17-run-01` | 40 个样本，两个模型 | 点击定位模型 A 的 0.9/0.8 阈值及恢复后的模型 B，核对指标。 | 真实点击图例隐藏/恢复 B；A 的 AP、N 和正例率保持，B 恢复后可再次读取。 |
| [三批样本的 PCA 得分投影](../../../examples/data-science-visualization/pca-projection/README.md) | `2026-11-17-run-02` | 30 个二维得分 | 点击定位 P001、P011、P021，核对 ID、批次、坐标及轴解释方差。 | 仅静态图例；补充了指针移出、尺寸和像素对照，旧空帧根因仍未确认。 |
| [240 个样本的 SHAP 特征贡献](../../../examples/data-science-visualization/model-shap-beeswarm/README.md) | `2026-11-17-run-02` | 240 个样本，720 条特征记录 | DPR 1/2 各 9 次无点击悬停，覆盖原正负/零贡献、缺失值及每行堆叠上下缘；另有 CUA 点击定位核对。 | 每行 240 图元，纵向跨度约 51–60 px；1100px 宽度下 5 个拥挤点保留，未采样或隐藏。 |

每例的 README 均列出 HTML、request、data 三个文件入口，最终产物统一在 [examples/data-science-visualization](../../../examples/data-science-visualization/README.md)。传感器结果额外保留来源哈希对应的中文字段 CSV，与原输入逐行相同，不改变数值和缺失。

## 已完成检查

- 原执行记录：8 例均实际打开并查看图元，代表 Tooltip 通过点击定位核对；分箱数、相关方法、PR 图例过滤通过真实控件操作并恢复。
- SHAP 后续扩为 240 个样本/720 条记录，保留原检查点；DPR 1/2 各 9 次真实无点击悬停均核对 ID 与特征。三行实际堆叠高度约 51–60 CSS px，1100px 宽度下 5 个拥挤标记保留，8 条特征值缺失的观测保留。
- PCA/原 SHAP 在独立 Chromium 中完成 108 组画布/截图像素对照；密集 SHAP 另完成 30 次检查，均未出现空白；24 张保留的宿主截图绘图区非空。具体依据见[空画布排查](2026-11-17-pca-shap-canvas-investigation.md)。
- 归档选择：前 6 例使用第一次实跑结果，PCA 与密集 SHAP 使用第二次实跑结果；三份结果保持原字节。JPEG 预览只解码转为 PNG，像素逐项一致；原 PNG 直接复制。
- 输入和提示词与当前固定任务一致；本次核对清单、哈希、相对链接、数据及来源、预览实际内容，并在新的本地目录重放归档路径下的 8 份请求。

## 未决事项与记录边界

- **PCA/SHAP 旧空帧未唯一归因**：本轮没有失败截图与同时刻 canvas 缓冲区的失配证据；不能用成功截图倒推截图工具必然有 bug，也没有修改图库重绘路径。
- 前 6 例和 PCA 的历史点击定位记录不能冒充无点击悬停验收；下方提交复核另补查了 8 例的代表点。仍未完成多宿主、全部点或所有响应式尺寸验收。
- 没有完整导出的会话日志；可获得的截图、AX 文本、请求、版本与工程检查记录保存在本地。原始证据及候选保持于 `.vchart-statplots/skill-cases/` 的各次运行目录，不提交或改写成公开案例的“全部通过”说明。
- 归档阶段只验证文件与路径迁移，没有重新执行全部交互、模型任务或全量视觉基线比较；当时未提交或发布。提交前复核单独记录在下方。

## 提交前复核（2026-11-17）

- 精确暂存 117 个本任务文件，排除任务开始前已有的 4 份旧计划/上架材料；没有打包原始运行日志、诊断脚本或候选产物。
- 修正空画布报告中指向被忽略运行目录的链接，改为入库的结果索引与展示目录；相对链接只认可 Git 索引内的文件，确认干净检出后可访问。
- 从 Git 暂存区独立导出案例和完整 Skill，在仓库外工作目录、禁用 site-packages 的 Python 3.11 中完成 8 份请求重放。输入事实、所有输入/结果哈希、示例与固定任务的一致性及 8 张 PNG 的尺寸/绘图区像素检查通过。
- Chromium **153.0.8010.12**（Playwright 隔离测试）：8 例均为 rendered，实际可见图元非空，真实鼠标无点击悬停代表点并断言 Tooltip 的 ID/类别及数值，无页面脚本错误。
- 分箱通过 5→10→20→5 的控件选择，核对真实边界/计数；相关方法通过 Pearson→Spearman→Kendall→Pearson，核对 Tooltip 中 method；PR 使用真实 canvas 图例点击隐藏/恢复 B，核对曲线和基线系列过滤以及 A 的 AP/N/正例率保持。所有初始规范 Spec 均恢复。
- 两种下拉使用 Playwright 的 `selectOption` 控件 API；本机 headless 中原生键盘弹出选择尝试未改变选项，未计为通过。原 CUA 真实点击记录继续保留，两者没有混记。
- 本次是对待提交产物的代表性浏览器与可移植性检查，不是新一轮盲测或完整点遍历。旧空帧未定责结论保留；没有运行时源码改动或 PR，未运行全量 VChart 视觉基线比较。
