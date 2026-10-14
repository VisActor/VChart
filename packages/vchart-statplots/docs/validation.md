# 实现与验收记录

## data-science-visualization 资源精简与图义（2026-10-13）

技能参考改为固定 2.1.8-alpha.0 发布物的 34 份原字节 TS 声明、28 图/一份公共指南、28 份唯一最小例子和按需变体。技能内 Schema/整套 docs/变体示例副本删除，公共运行验证与共享 controller 不变。参考正文下降 70.5%，五图平均首次必读字节下降 52.2%，指标包含完整索引与声明依赖，不等同于 token 或模型质量。

独立执行 11 个普通需求：7 个需求生成 8 份实际可用 HTML，另外四个正确澄清或转交，不算渲染成功。实际请求固化为七项语义回归，检查 0/重复/长尾/缺失、有效 N/累计分母、ID/单位、分组/NA、UMAP 来源和固定条件改图。Python 3.11/3.12 各 23、Node 19、Jest 664、完整浏览器 454 项本轮通过，真实 CDN 与复制目录另有实际用例。扩展测试 tsc 仍有既有文件错误，新 skill 测试无类型错误；宿主发现/预览未测，本轮未重跑核心官方视觉比较，前轮基线阻断不得写成通过。详细结果、误判纠正和可重复命令见 [资源与图义验收](../../../docs/superpowers/validation/2026-10-12-data-science-visualization-resources.md)。

## data-science-visualization 默认页面简化（2026-10-12）

默认只展示标题、图表、单位与 Tooltip，操作栏、导出、来源详情和原生筛选/框选按请求生成。固定条件独立于控件，对话改图保留完整使用行/ID/单位/条件；默认启动提示同时收敛。沿用共享控制器与固定发布资源，图库三组截图逐字节不变。

Python 3.11/3.12 各 23 项、Node 14 项、664 项单元及 447 项完整浏览器通过；28 类发布物、12 类绑定、六个便携示例、真实 CDN、真实交互和 10k 场景分别验证。正式全量视觉比较仍被同四项既有基线断言阻断，扩展测试项目 tsc 仍有既有错误；没有跳例或改阈值。详细命令、截图、独立执行与限制见 [简化验收](../../../docs/superpowers/validation/2026-10-12-data-science-visualization-simplification.md)。

## data-science-visualization 消费者（2026-10-12）

新增 [技能](../../../skills/data-science-visualization/SKILL.md)，复用固定 2.1.8-alpha.0 发布契约与公共 API；图库和技能共享提取后的浏览器控制器。12 类表格入口、28 类规范 Spec、便携 HTML、筛选/字段/参数/主题与导出已实现。独立需求验收发现并修复改图丢失已应用条件：保存当前视图请求保留全部使用行及 initialFilters，改图后可重放。

664 项单元、427 项完整浏览器通过；Python 3.11/3.12 各18项、Node12项、源码 compile/Schema/catalog/examples/资源校验通过。真实发布 UMD、真实 CDN、复制目录、鼠标交互、失败回滚和10k规模分别验收。官方全量262例仍被基线的band-axis-update-spec、legend-piecewise-domain、brush-link-data-key、update-resize四项阻断，不能声明全量视觉通过；宿主file预览/自动发现未验收，扩展测试项目tsc仍有既有错误。详细证据、命令与范围见 [验收文档](../../../docs/superpowers/validation/2026-10-12-data-science-visualization.md)。

## 原始散点回归与残差图（2026-10-09）

源码与联调已完成，正式依赖已升级为 VUtil 1.0.27。scatterPlot 新增显式 fit.input=observations / estimates，支持原始 x/y 的线性、2–5 次多项式和 LOWESS 拟合；不传 fit 仍为纯散点。residualPlot 新增 observations，默认按原始 x 绘制 y−predict(x)，另可选 fitted 横轴。predictions / residuals 外部用途保留，独立 smooth LOWESS 只拟合残差趋势。

线性/多项式默认使用成对 bootstrap 均值响应置信带；LOWESS 不画带。按系列独立计算，点、线、带共用颜色与图例筛选。类型、生成 Schema/校验器、主例与分组例、7 个新变体、目录和中文契约已同步。

### 上游修复及交付边界

VUtil 1.0.25 的大偏移线性/多项式预测错误、LOWESS predict/grid 稳健状态不一致、隐藏采样/减少迭代已在隔离工作树修复；新增根导出 regressionBootstrap。使用中心化/缩放、增量 QR 与退化最小范数解，不在 StatPlots 重写数学算法。LOWESS 保留局部 x/y 精度，距离或插值区间溢出时使用归一化坐标；保留全量观测；曲线网格保留正常整数步长，避免破坏柱状回归组件的类别索引。

- 上游实现来源：[VUtil PR #291](https://github.com/VisActor/VUtil/pull/291)，已合并为 `f963e37`。npm 1.0.26 已提供稳定回归、LOWESS fitted 和 regressionBootstrap 公共 API。
- 可应用补丁：`.vchart-statplots/regression/vutils-regression.patch`；已对相邻 VUtil 基线执行 `git apply --check`。补丁不包含开发 node_modules 链接。
- 本地开发包链接已通过标准 Rush update 替换；StatPlots 和 VChart 的 vutils 实际路径均指向 Rush 安装的 npm 1.0.27。
- 8 个项目的 14 处直接依赖下限及 Rush 锁文件已统一更新为 1.0.27，涉及 vutils、vdataset、vscale、vlayouts；本轮不执行 npm 发布。
- 开发阶段使用 `1.0.25-dev.regression` 完成 CJS 140 份主例/有效变体、严格类型与三模型 ESM/UMD 绘制及 release 验证；当前改用正式依赖，隔离验收结果见下方 1.0.26 和 1.0.27 升级记录。

### 数值与契约验证

- VUtil：53 套、276 项测试通过，compile/build 通过，ESLint 0 errors、8 条既有 warnings。先保存三个缺陷的失败测试，再修复；旧 LOWESS 测试中依赖隐藏近似或模型不一致的断言改为明确参数和真实模型一致性断言，没有放宽误差/性能预算。
- 上游 PR 的 CI 补充修复：`fbb4e6f` 迁移 labeler 配置并固定 v6.2.0 提交；`ee963ab` 将 Rush 包级测试与 VUtils Jest worker 串行执行，消除 CPU 争用对 LOWESS 墙钟预算的影响。[GitHub 单测任务](https://github.com/VisActor/VUtil/actions/runs/37907797390) 四个包共 101 套 / 816 项通过；保留全部用例及原性能阈值。Labeler 配置已随 PR 合并。
- StatPlots：36 套、636 项单元测试通过；compile、Schema 一致性、28 主例/112 有效变体/28 无效例和 28 类目录/89 条意图通过。ESLint 0 errors、962 warnings，主要为已有及测试类型警告。
- 固定数值对照共 11 组：线性与 2/3/5 次多项式（含大偏移）、LOWESS iterations=0/3 与 delta=0/0.7、三组同一配对索引的 bootstrap。参考环境为 Python 3.9.6、NumPy 1.26.4、statsmodels 0.14.4；容限 5e-8，版本记录在 JSON 中。仓库仅提交固定 JSON 与 TypeScript 测试，不包含 Python 生成脚本或运行依赖。seaborn 未参与数值执行；只对齐其公开输入和统计含义。
- VChart 数学端点回归的大偏移预测、Extension 散点三方法和柱状多项式调用检查通过。保留旧 confidenceInterval API，但没有将旧多项式/LOWESS 区间声称为新的 bootstrap CI。
- 有限输入导致无法表示的结果会报告原始 JSON Pointer；残差平滑跳过不可识别组后，错误仍定位原始行和 residual 字段。

### 浏览器、性能与原生视觉

完整 Chromium 回归 **339 项通过**；最终上游网格兼容修正后重新构建，回归、根 ESM 入口和全部变体 **131 项定向复验通过**。覆盖三种方法、真实 Tooltip、图例点/线/带联动、输入/方法切换、两个残差横轴、数据更新、resize 和 release。浏览器截图已审阅，五次重复截图一致。

性能结果见 [regression-results.json](../benchmarks/regression-results.json)：10k/100k 线性、多项式；10k 默认 1000 次 CI；5k 精确 LOWESS；100k 显式 delta=0.1；4 张 10k 残差图。记录 compile/render/重新编译/resize/真实 hover/release 和 CDP 堆使用量。原始样本 getter 在编译后改为抛错，生命周期和 hover 仍通过；全部原始图元保留。精确 LOWESS 的二次成本没有伪装为抽样性能，delta 的含义写入文档。单次测量不作为 SLA。

新增 statplots-regression / statplots-residual 原生用例已登记，共 262 例。两例各五轮 self-compare 稳定；对官方 develop `d169be9f3d63ed1e998dead9711dac5fb5af91fc` 各单例比较通过。六项反例（抑制实际点击、图例只绑定点、曲线颜色错误）均被真实语义断言拒绝，未填写虚构 BugServer ID。

- `charts/scatter` 8/8、`components/marker` 21/21、`data` 4/4 官方比较通过。
- `components/legend` 基线在既有 legend-piecewise-domain 失败，报告保持 error：`.vchart-visual/runs/1791532672261-05b0a20c/agent-summary.md`。
- 已执行官方全量 262 例；基线仍在 band-axis-update-spec、legend-piecewise-domain、brush-link-data-key、update-resize 失败，完整比较 false：`.vchart-visual/runs/1791531941425-939b6351/agent-summary.md`。
- 使用同次冻结 suite/UMD 补跑全部 current：257 项无差异，4 项当前语义通过但缺合法基线截图，保留 missing_artifact；theme-runtime-switch 存在既有 240 像素标签颜色差异，已审阅三图，当前截图与本轮之前逐字节一致。补跑不等于全量官方通过。

一次并行原生构建清理了 vutils-extension CJS/ES 产物，打断单元/浏览器验收；已按顺序完成构建后重新运行。一次 data 目录运行因编译期间编辑源码被 WORKSPACE_CHANGED 拒绝，已在源码稳定后完整复跑通过。未跳过用例、改变阈值或关闭检查。提交前额外复核了远处大观测导致近邻精度丢失的混合尺度情形，并修复局部响应与插值。276 项上游测试、636 项下游单测及 18 项回归/性能/ESM 浏览器检查重新通过。迁移到正式 1.0.25 基点后，开发包采用独立版本，避免 TypeScript 将其与 npm 1.0.25 的旧声明按相同包 ID 合并；提交到上游的正式 package.json 版本保持 1.0.25。所有日志、截图、反例、隔离包和原生补跑证据位于 `.vchart-statplots/regression/`。

## VUtil 1.0.26 正式依赖升级（2026-10-09）

8 个项目的 14 处直接依赖已统一升级为 `~1.0.26`，涵盖 vutils、vdataset、vscale、vlayouts，Rush 锁文件通过标准 update 生成。依赖一致性检查通过，14 处实际安装路径均为 npm 1.0.26；此前的开发包链接已替换。

- 11 个 Rush 构建任务全部完成；VChart、vutils-extension 与 StatPlots 的 TypeScript 检查通过。构建保留既有 circular/sourcemap、OpenInula 类型等警告；构建产生的受跟踪 bundle 和 VChart Schema 不纳入本次提交。
- StatPlots 36 套 / 636 项单测、完整 Chromium 339 项通过；ESLint 0 errors、962 条既有及测试类型 warnings。Schema、28 主例、112 有效变体、28 无效例及 28 类目录/89 条意图检查通过。
- 使用本分支 VChart、vutils-extension、StatPlots 的全新 tarball 在独立目录安装，四个 VUtil 包均来自 npm 1.0.26，无源码链接或开发版本覆盖。CJS 无 DOM 编译 140 份示例、根入口严格 types、线性/多项式/LOWESS 三模型 ESM/UMD 绘制、混合尺度精度与 release 检查通过。
- VChart Extension 的既有散点三方法与柱状回归调用检查通过；浏览器验证后的性能结果已更新至 benchmarks/regression-results.json，记录正式 vutils 版本。
- 官方 develop `d169be9f3d63ed1e998dead9711dac5fb5af91fc` 视觉比较：散点 8/8、标记 21/21、数据 4/4 通过。对应报告为 `.vchart-visual/runs/1791537939938-f7574fa4/agent-summary.md`、`1791537966504-826db319/agent-summary.md`、`1791538003785-114ae0f2/agent-summary.md`。本次未新建 PR，未重复核心全量；既有全量基线阻断仍按上文真实记录保留。

本轮证据位于 `.vchart-statplots/regression/vutils-1.0.26-*` 与 `packed/result.json`。仅提交固定 JSON 数值参考与 TypeScript 测试，不包含 Python 数据生成脚本。本轮不推送 VChart 分支、不创建 PR、不执行 npm 发布；旧版本及开发包说明属于历史阶段记录。

## VUtil 1.0.25 正式依赖升级（2026-10-09，历史阶段）

仓库中 8 个包的 14 处直接依赖已从 `~1.0.24` 更新为 `~1.0.25`，涉及 `@visactor/vutils`、`@visactor/vdataset`、`@visactor/vscale`、`@visactor/vlayouts`。通过标准 `Rush update` 更新锁文件；VRender 的兼容间接依赖也解析到 1.0.25。历史第三方包要求的旧版本保留原契约，没有添加全局强制覆盖。Rush 依赖一致性检查通过，全部直接依赖的实际安装路径均指向 npm 发布的 1.0.25。

- 独立临时目录从 npm 安装四个 1.0.25 包，验证根入口 normalQuantile/mean/correlation/bootstrapEstimate 的运行与严格类型声明；bootstrap 固定 seed 可复现。
- 使用本分支 VChart、vutils-extension、StatPlots 的全新打包产物隔离安装，所有 VUtil 依赖使用 npm 1.0.25，未链接工作区源码。CJS 无 DOM 编译 28 个主例通过，原始样本均值和样本数正确；严格类型检查以及 ESM/UMD 实际绘制与 release 通过，释放后 canvas=0。这没有把已有 npm VChart 2.1.7 视为支持本分支新增核心能力。
- `Rush build` 对 StatPlots、VChart Extension、React、OpenInula、Story Player 及其依赖的 11 个构建任务全部完成。保留既有 Rollup circular/sourcemap、OpenInula ReactNode 类型及 tslib 警告，未关闭检查。VChart、vutils-extension 和 StatPlots 的独立 TypeScript 检查通过。
- StatPlots 单元测试 32 套、595 项通过；构建结束后的完整 Chromium 回归 315 项全部通过。Schema、28 主例、105 有效变体、28 无效例及 28 类目录/89 条意图检查通过。
- 原生全量命令已运行，官方 develop 基线仍为 d169be9f3d63ed1e998dead9711dac5fb5af91fc。基线阶段的 band-axis-update-spec、legend-piecewise-domain、brush-link-data-key 和 update-resize 断言失败，正式报告保持 error / 完整比较 false。报告：`.vchart-visual/runs/1791527138258-ed34c982/agent-summary.md`。
- 在独立目录使用该次冻结 suite、UMD 与基线截图，通过相同 executePhase 补跑全部 260 个 current 用例：255 项无差异；theme-runtime-switch 存在既有 240 像素标签差异，当前截图与升级前本地截图逐字节一致；上述 4 项当前语义/交互检查通过，但缺少有效基线截图，保留 missing_artifact 错误，未跳过、更新基线或放宽阈值。补充结果不是全量官方比较通过。

正式发布包替代了本地开发链接，之前的 `.vchart-statplots/vutils-input-alignment` 临时联调工作树已清理；相邻 VUtil 任务的分支和文件未改动。清理了指向旧链接的 Vite 优化缓存。一轮浏览器测试在并行构建替换 UMD 时出现 7 项加载/导航失败，不计为通过；所有构建结束后重跑完整浏览器回归。首次单元运行因原生构建仅生成 vutils-extension ES 产物而缺少 CJS，按完整依赖顺序构建后复验通过；初次隔离浏览器验收使用 macOS 临时目录别名遇到 Vite HTML 代理问题，改用 realpath 后 ESM/UMD 验收通过，均未修改产品代码。

本轮证据位于 `.vchart-statplots/vutils-1.0.25/`，相关日志同步保留于该目录的 `logs/`。下文的旧版本及“等待上游发版”说明是历史阶段记录；统计工具发布依赖阻断已解除，其余 VChart 核心发布与 PR 视觉验收要求仍按实际结果核对。

## 表格与模型结果入口优化（2026-10-09）

五类改造已完成：missingValueMatrix/correlationMatrix 接收 variables/data.observations；pointIntervalPlot、residualPlot、learningCurve 分别以 input 区分样本/外部估计、预测/外部残差、各折/汇总。统计在 compile 执行一次，不进入 resize/hover；类型、生成 Schema、目录、示例与中文迁移文档同步。

- StatPlots：32 套、595 项单元测试通过；含 21 组固定 Python 对照及模式、null、配对、ties、单样本、冻结/置换输入、误差区间和模型结果反例。
- VUtil 联调：50 套、254 项测试与类型/构建通过；通用 mean、correlation、bootstrapEstimate 从包根导出。tau-b 对照独立逐对计数，修正对角浮点端点问题。
- Chromium：全量 315 项中 312 项首次通过；三处旧测试数据/选择器迁移后定向复验全部通过。它们分别为旧系数输入、图库固定旧标签数值、矩阵空数据 helper。未跳过用例或放宽数值、像素、交互断言。另有一轮被并行原生构建清理产物打断的测试，不计为通过。
- 新输入交互清单位于 input-alignment.spec.ts：五类真实 Tooltip、结果进入图元、同实例 update/resize、空态往返、release；另外验证点/区间/端帽及学习曲线/带的图例联动、三类输入模式切换。此前图例仅筛选估计点/得分曲线的问题通过标准 seriesId 绑定全部对应系列修复。
- 六个新增有效变体显式登记 examples/specs/index.json 和 docs/plot-catalog.json。28 主例、105 有效变体、28 无效例、89 条目录意图按契约通过。
- 五类更新/resize 后截图各连续五轮字节一致，已审阅面积、区间端帽、NA、原始残差及缺失网格。实际行为反例包括原有图例单系列绑定（新测试会失败）和旧 Kendall 运算顺序（Python/严格端点断言会失败）。本包截图稳定性不冒充官方基线比较。
- 原生视觉执行 `--dir charts/heatmap`：官方 develop d169be9f3d63ed1e998dead9711dac5fb5af91fc 基线比较 1/1 passed、无差异；其余 259 项未执行。本轮未改 VChart 核心，未创建 PR；创建 PR 前仍须全量原生基线回归。报告 `.vchart-visual/runs/1791518893009-0ebccedf/agent-summary.md`。

性能见 [测量记录](../benchmarks/input-alignment-results.json)：10k/100k 输入、相关矩阵 4/16 变量与三种算法、100/1000 次 bootstrap、缺失矩阵实际 10k/100k 单元格、残差实际 10k/100k 散点、学习曲线 10/100 规模 ×5/10 折 ×1/10 模型及 20 图表页面。resize 数据不变，release 后 canvas=0。单次测量不作为 SLA；100k 默认均值 bootstrap 约 1.8 秒，选择中位数时约 12.6 秒；100k ×16 的秩相关约 6–8 秒，文档明确同步统计成本及参数选择。

证据保留于 `.vchart-statplots/input-alignment/`；Python fixture 固定版本与解释器写入 input-alignment-python.json。最终 ESM/CJS/UMD 构建后，新入口与配色浏览器验证再次 16 项通过；ESLint 0 errors、888 warnings，主要为既有及测试 any/非空断言警告。

### 当时的本地依赖与发布边界（已由 1.0.25 替代）

另一任务切换 VUtil 分支后，本轮改用 `.vchart-statplots/vutils-input-alignment` 中的 detached 联调 worktree（fb6a7f5 + 本轮三项通用工具），保留既有 normalQuantile；消费者开发链接指向该 package，版本为 1.0.24-dev.input-alignment，避免 TypeScript 将不同本地内容视为同一个旧包。未覆盖另一任务的分支或源码，也未把通用算法复制到 StatPlots。工作树需保留到真实依赖版本可用。

这仅证明本地源码联调完成。现有 ~1.0.24 缺少这些 API，发布前仍须先发布包含 normalQuantile/mean/correlation/bootstrapEstimate 的真实 vutils 版本，更新消费者依赖下限与 Rush 锁文件，并从发布包隔离安装构建。本轮提交包含源码、测试与文档；没有发布或创建 PR。配套统计工具已在 VUtil 提交为 `28621a3`，当前联调源码与其一致。

日期：2026-09-29。分支：`codex/vchart-statplots`。环境：macOS arm64、Node 22.23.3、TypeScript 4.9.5、Playwright 1.63.0 / Chromium；VChart 和新包源码版本均为 2.1.7。

## 已实现范围

计划 P1–P4 的 28 类全部实现，包含 strip / jitter / swarm、季节叠加 / 子序列、ACF / PACF、区间与矩阵归一化变体。公共入口为 `compileStatPlot`、`validateStatPlot`、`registerStatPlots`、`StatPlotValidationError` 及类型导出。

提供 28 份主示例、28 份 minimal、22 份 grouped、8 份专门变体、28 份 invalid，28 份分类型 Schema、总 Schema、逐图说明和 skill 输入指南。Schema 与运行时结构校验器由 TS 生成，Ajv 仅在构建时使用。

## 新包验收

已执行 Rush 依赖安装与 `build --to @visactor/vchart-statplots`；ESM / CJS / UMD 构建完成。上游 Rollup 存在循环依赖、sourcemap 和过时 API 警告，构建成功。

首版交付检查（后续导航和主题改动见下文）：

| 检查 | 结果 |
| --- | --- |
| TypeScript、Schema 再生成一致性 | 通过 |
| 主示例 / 有效变体 / 无效示例 | 28 / 58 / 28 按预期通过或拒绝 |
| Jest | 8 套，113 项通过 |
| Chromium 浏览器 | 105 项通过 |
| ESLint | 0 errors、202 warnings，主要为已校验数据上的非空断言及测试类型；未通过禁用规则掩盖 |
| npm pack + 离线安装 | CJS 无 DOM、类型声明、ESM / UMD 实际渲染与释放通过 |
| 发布包内容 | 包含 Schema、示例、文档与产物，不含测试图片；VChart external |
| git diff --check | 通过 |

测试报告位于仓库根 `.vchart-statplots/`，不进入发布包。`browser-final.log` 保留完整 105 项结果，`unit.log`、`lint.log` 和 `pack-browser-smoke.json` 分别保留其他检查证据。

验证覆盖：

- 独立统计预期：原始分箱频数及直方图面积、ECDF 单调、箱线五数次序、零分母、对称相关矩阵、区间种类、时间合法性、分箱逐箱计数、凸六边形和蜂群碰撞。
- 实际图形：小提琴对称轮廓、箱线坐标域包含异常点、区间端帽、连续色标完整范围、时间线和带同步断开、ACF stem、Q–Q / 校准参考线。
- 交互与生命周期：真实 tooltip 和图例点击、50 次更新后事件仍只触发一次、resize 后蜂群和按 ID 刷选、20 个图表释放后无 canvas、PNG 导出和示例页切换全部类型。
- Python 标准库预计算 JSON 进入浏览器，随后用浏览器端结果更新同一实例；两次分别验证实际柱高比和等高关系。
- 全类型空状态、冻结输入不被修改、错误 code/path、未知字段、非有限数和无需运行时 eval。

首版没有历史截图基线。已审阅 `.vchart-statplots/screenshots/` 的 28 类主图及关键紧凑 / 深色图；图形正确性由上述独立预期与真实交互共同验证，不将自比较等同于统计正确性。

### 示例页导航优化

将类型下拉框改为左侧分组导航，使用 `?type=<type>` 分享与切换，按 URL → 上次成功查看类型 → `violin` 恢复。浏览器前进、后退和有效 JSON 绘制同步导航；连续切换时丢弃旧请求的结果，仅记录类型。

本次只修改示例页及其文档、测试。执行 `npm run test:browser --prefix packages/vchart-statplots -- gallery.spec.ts`，6 项通过，覆盖全部 28 类切换、URL 与历史记录、刷新与记忆恢复、无效类型与禁用存储、请求竞态、JSON 编辑同步、键盘访问、主题及 PNG 导出。1440 / 1000 / 390px 截图已审阅，页面无横向溢出；证据为 `.vchart-statplots/gallery-test.log` 与 `.vchart-statplots/screenshots/gallery-*.png`。JavaScript 语法检查与 `git diff --check` 通过。

### 原生深浅色主题

本节记录早期原生主题调整；当前数据配色契约见本文末尾“公共配色”与 [colors.md](colors.md)。当时移除自定义 `statplots-light / statplots-dark` 主题对象与六色分类色板，编译结果直接使用 `theme: 'light' | 'dark'`。原生主题负责分类色、背景、字体及组件默认样式；边框、缺失值、警告标记和区间辅助线读取原生语义颜色。统计连续色标及其标签对比色保留数据编码含义。相关矩阵标签显式关闭描边，避免原生系列色描边干扰文字。

本次新增主题浏览器检查，覆盖 28 类 light/dark 更新、实际背景和轴标签颜色、7 个系列的原生配色、缺失值、边框及区间线。已审阅小提琴、相关矩阵、六边形分箱、SHAP、碎石图和特征重要性的深浅色截图。

- ESM / CJS / UMD 构建、TypeScript 检查通过；Node 22 无 DOM 的 CJS 编译通过。
- Jest 8 套、113 项通过。测试配置复用 VChart 的 D3 / VRender 模块映射，并排除对工作区已构建 CJS 的重复转译，使用真实主题实现。
- 完整 Chromium 回归最终 **112 项通过**，包含示例页 URL/记忆、全部类型与变体、主题、交互、生命周期和性能用例。
- 首轮浏览器回归出现一次 Pair Plot 刷选时序失败：测试在更新后的绘制帧完成前开始拖拽，组件事件重新绑定可能打断交互。用例改为等待绘制帧后操作，未改超时或放宽断言；该用例连续 3 次通过，再运行完整回归通过。
- ESLint 0 errors、220 warnings（包含已有及新增测试中的类型警告）；`git diff --check` 通过。本次未修改 VChart 核心源码。

证据位于 `.vchart-statplots/`：`native-theme-build.log`、`native-theme-unit.log`、`native-theme-browser.log`、`native-theme-lint.log`、`native-theme-cjs.json`、`native-theme-pair-stability.log` 和 `screenshots/native-*.png`。首轮失败日志和 trace 保留为 `native-theme-browser-initial.log`、`native-theme-pair-initial-trace.zip`。

## 必要的 VChart 核心改动

1. 连续图例绑定三节点 scale 时，使用完整 min/max，避免只显示发散色域的前半段。
2. 标准 brush 增加 `brushLinkDataKey`，用一次索引构建按观测 ID 联动；省略选项保留空间联动。
3. 多 region brush 在释放任何容器前统一清理状态，避免访问已释放容器；清除旧 linked-in 条目，避免残留选择。
4. 分类轴 `reInit(spec)` 向父类传递新 spec，使主题和轴配置更新生效。

核心单元测试 4 项通过。新增 `legend-piecewise-domain`、`brush-link-data-key`、`band-axis-update-spec` 三个视觉用例；冻结同一 UMD 后使用官方 `executePhase` harness，5 轮 baseline/current 自比较均通过。四个反例分别截断色域、删除联动 key、抑制刷选、抑制轴更新，均触发预期语义断言。原始证据在 `.vchart-statplots/core-stability-final/result.json`。

### 官方 develop 全量结果

已实际执行 `node packages/vchart/scripts/visual-test.mjs`，选中全部 259 个用例。官方基线为 `d169be9f3d63ed1e998dead9711dac5fb5af91fc`，Chromium 153.0.8010.12。

默认 runner 在 baseline 阶段遇到三个新用例的语义断言失败后停止，因此官方报告状态保留为 **error / 完整比较 false**，没有跳过用例、调整阈值或把自比较冒充官方通过。失败分别对应旧版的轴主题更新、三节点色标范围及不支持 ID 联动。

随后将同一次运行冻结的 suite、两个 UMD 和基线截图复制到独立目录，使用同一官方 `executePhase` 执行全部 259 个 current 用例：

| 结果 | 数量 | 解释 |
| --- | ---: | --- |
| passed | 255 | 与官方 develop 截图一致 |
| diff | 1 | `theme-runtime-switch`，已审阅的预期修复 |
| MISSING_ARTIFACT | 3 | 三个新增用例当前绘制及语义验证通过，但旧版未生成合法基线截图 |

`theme-runtime-switch` 的差异仅为 9 个 x 轴标签的颜色、共 240 个像素。实际图元核对：旧版 `#89909d` → 新版 `#6F6F6F`，与该用例请求的 `theme.component.axis.label.style.fill` 一致；标签位置、字号、文本不变。已查看 baseline/current/diff 三图，属于分类轴主题修复的预期影响，未接受或覆盖基线。

证据（相对仓库根目录）：

- [官方原始报告](../../../.vchart-visual/runs/1790672624668-8356b593/agent-summary.md)
- [补充 current 阶段结果](../../../.vchart-statplots/core-official-supplement/summary.json)与[浏览器报告](../../../.vchart-statplots/core-official-supplement/current-report/index.html)
- [主题差异图](../../../.vchart-statplots/core-official-supplement/current-results/visual-theme-runtime-switch/theme-runtime-switch-diff.png)与[实际图元颜色核对](../../../.vchart-statplots/theme-review.json)
- [五轮稳定性及反例结果](../../../.vchart-statplots/core-stability-final/result.json)

稳定性测试与官方 current UMD 的 SHA-256 完全相同：`f8ee12ea6a6aead0acf8d9773e45795fe62e09e87c004199cd4c9377268f17cf`。

## 与原计划的实现差异

- 测试按阶段与语义集中在 `second-phase`、`third-phase`、`fourth-phase`、`semantics` 等文件中；布局工具放在对应 series 内，不建立空目录和空接口文件。
- 小提琴使用原生集合 area；tooltip 展示组内采样范围和原始密度峰值，避免将整组图形误解释为某个指针位置的密度。
- 内部 swarm 返回溢出点数量及逐点标记；公共 JSON 契约不变，保留所有点并用原生主题警告色的空心标记说明拥挤。
- Pair Plot 的图例只说明分组颜色，避免筛选后对角统计量和面板 n 含义变化。按 ID 刷选使用新加的标准 VChart 配置。
- 验收以最终行为为准；没有保留每个阶段“先红后绿”的全过程，不追认未保存的历史测试结果。

## 使用边界

- [性能测量](../benchmarks/README.md) 单列大规模 Pair Plot 的成本；8 变量 × 1 万观测绘制 56 万点，更新和刷选不适合频繁操作。不会静默抽样；调用方应先选变量或明确抽样策略。
- Pair Plot 建议每个变量分配至少约 220px 宽度；窄容器下轴文字可能省略，面板有效 n 同时保留在 tooltip。
- 不实现统计估计、计算 provider、Python runner、完整报告或 skill。本次交付的是图表包与生成 skill 所需资料。
- 当前为本地源码交付，未发布 npm。必须使用本分支配套 VChart 构建；已有 npm 2.1.7 不含新增刷选能力，发布时需同步版本与 peerDependency。


## 命名与配置优化（2026-09-30）

本轮已完成命名优化设计与计划的本地实现，继续使用 `codex/vchart-statplots`。28 类图表中 21 类采用新 type，7 类保留；Spec / Row 公开类型、28 份分图 Schema、示例、逐图说明和 Python 交接例同步迁移。完整变更见 [迁移表](naming-migration.md)。

`labels` 统一为 `fieldLabels`；显示统计量采用 `statistic`，密度轮廓采用 `densityNormalization`，抖动幅度采用 `jitterRatio`。周期顺序、相关系数、累计概率、拟合值、分位数和校准概率等字段明确了含义。参考线改为 `referenceLine`；fpr/tpr、q1/q3 等领域常用名称保留。countPlot、histogram 与 confusionMatrix 的自定义统计量展示名实际进入轴或 tooltip。

旧 Spec 的 type、属性及已撤销枚举会报结构错误，没有运行时兼容转换。仅图库入口迁移 21 个旧 URL 名称及浏览记录，维持 URL 优先级、前进后退和成功绘制后记忆；JSON 编辑器仍拒绝旧 Spec。图库与 skill 资料共用 `plot-catalog.json`，变体带显式 options。78 条中英文选型预期涵盖基础类型、变体与歧义请求；这是契约一致性检查，未执行模型命中率评测。

### 季节图结论纠正

首版“subseries 已支持”的结论不够准确：旧实现按年分面、面板内为季度。现在 `cycle` 表示年份等完整周期，`phase` 表示季度等周期内位置；subseries 按 phase 分面、横轴为 cycle，overlay 按 series/cycle 分线、横轴为 phase。两种布局都遵循必填顺序数组并显式断开缺口；不补零、不修改输入。叠加线使用独立组合键，避免系列或周期名含展示分隔符时误合并。

已查看 [季节子序列截图](../../../.vchart-statplots/naming-after/seasonal-subseries.png) 和 [展示名及真实 tooltip 截图](../../../.vchart-statplots/naming-after/field-labels.png)。季节测试同时检查面板数、横轴顺序、共享数值域、缺口图元、乱序输入和 resize。5 类图表的 light/dark 前后截图逐像素比较，10 帧差异均只位于标题区域；另已查看代表性小提琴和深色 SHAP 图，记录见 `screenshot-comparison.json`。

### 最终检查

| 检查 | 实际结果 |
| --- | --- |
| ESM / CJS / UMD 构建 | 通过 |
| TypeScript 源码及包含测试/脚本的类型检查 | 通过 |
| Schema 内容与文件集合 | 28 类一致；额外旧 Schema 的检查失败、重新生成清理均实测通过 |
| 主例 / 有效变体 / 反例 | 28 / 67 / 28，按预期通过或拒绝 |
| 选型资料 | 28 类、78 条意图预期及变体与可执行契约一致 |
| Jest | 11 套、211 项通过 |
| Chromium 最终全量 | 126 项通过 |
| npm pack 实际安装 | CJS 28 类无 DOM 编译、TS 声明及 ESM / UMD 绘制释放通过 |
| 发布资产集合 | 629 个文件，28 份新 Schema；无旧名称公开类型、Schema 和示例文件 |
| ESLint | 0 errors、263 warnings；保留非空断言等警告，未禁用规则 |
| 文档本地链接、git diff --check | 通过 |

新增及加强的断言包括旧 type / 字段拒绝、按系列的比例、直方图密度面积、混淆矩阵分母及 NA 展示名、Q–Q 坐标方向、PR 正例比例边界、ACF 无偏估计越界值保留、真实 tooltip 文字及全部旧导航恢复。测试中的 resize 返回值和 tooltip / 图例图元选择器错误已修正，未放宽语义断言或像素阈值。

日志统一保存在 `.vchart-statplots/naming-after/`：`build.log`、`types-tests.log`、`contracts.log`、`unit.log`、`browser-final.log`、`lint.log`、`stale-schema-rejected.log`、`stale-schema-cleaned.log`。实施前源码快照、113 项单测和基准保存在 `naming-before/`。仅保留部分早期失败日志，不追认所有阶段均有独立的先红后绿记录。

实际 tarball 安装到 `.vchart-statplots/consumer`，不是仅从源码目录导入。ESM/UMD 小提琴各绘制 3 个密度采样点，重复注册有效，release 后 canvas 为零；已核对安装文件与最终构建字节一致。首次离线安装因缺少 vutils-extension 缓存失败，联网安装后重新验证通过，没有把旧消费目录结果记作新包成功。包与日志见 `naming-after/final/`、`pack-final.json`、`install-final.log`、`consumer-types.log`、`consumer-cjs.json`、`pack-browser-smoke.json`。

### 同环境性能对照

Node 22.23.3、macOS arm64；以下为中位数，单位毫秒。compile 包含校验；样本数与测量方法沿用原基准。

| 场景 | 优化前 | 优化后 |
| --- | ---: | ---: |
| validate ROC 10000 | 0.524 | 0.536 |
| compile ROC 10000 | 0.795 | 0.859 |
| validate ROC 50000 | 3.031 | 3.045 |
| compile ROC 50000 | 5.202 | 5.077 |
| swarm 1000 | 1.921 | 1.900 |
| swarm 10000 | 20.863 | 20.674 |
| swarm 10000 identical values | 13.898 | 14.337 |

UMD min gzip 从 31,633 增至 33,916 字节，主要增加来自名称、字段说明及季节布局实现；不包含外部 VChart。上述单机短样本有波动，未观察到明显的整体退化，不能据此建立性能 SLA。大散点、多图与 Pair Plot 性能用例包含在 126 项浏览器检查内；既有大规模 Pair Plot 交互成本边界继续适用。

本轮没有新增 VChart 核心源码改动，也未提交 PR，未重新执行核心官方全量视觉比较。上文既有官方结果及三个缺失基线的限制仍然有效；提交 PR 前仍须执行仓库要求的全量。当前为本地交付，未提交、推送或发布。


## 公共配色（2026-09-30）

28 类 Spec 新增可选 colors，categorical / sequential / diverging 默认分别为 colorblind / viridis / RdBu_r，支持命名色板与 #RRGGBB 数组。原生 light/dark 保留；categorical=vchart 恢复原生分类色。SHAP 按特征内相对值使用 sequential，相关矩阵固定 [-1,1] 使用 diverging。缺失、常量、警告和辅助线继续用主题语义颜色。矩阵标签使用 VChart 原生 smartInvert。

共享 TypeScript 类型生成分图与总 Schema；数组同时校验元素类型、色号格式和最小长度。Ajv inlineRefs=32 让复杂公共配置复用校验函数，小数据行结构保持内联。内置色板静态打包，无新增运行时依赖，源版本和许可随包提供。

| 检查 | 结果 |
| --- | --- |
| ESM / CJS / UMD 构建与源码类型检查 | 通过 |
| 测试与脚本类型检查 | 通过 |
| Jest | 12 suites，255 tests 通过 |
| 完整浏览器回归 | 132/132 通过 |
| 最终元素类型校验与共享校验器生成后专项复验 | 配色、ESM/UMD 入口、图库、28 图深浅主题共 17/17 通过 |
| Schema / 示例 / catalog | 一致；28 主例、67 变体、28 反例、78 意图预期检查通过 |
| 配色文档 2 份完整 JSON | 实际校验通过 |
| ESLint | 0 errors，288 warnings（any 与非空断言等） |
| npm tarball 实际安装 | CJS 校验/编译、TypeScript 消费、浏览器 ESM/UMD 自定义色均通过 |

浏览器断言实际图元颜色、连续图例的范围与全部停靠点、正/负/零相关系数、自定义配色更新、超过 10 类的原生色板恢复和颜色循环；测试色板下矩阵文字对比度均 ≥4.5。已审阅深浅色相关矩阵、混淆矩阵、SHAP、六边形以及图库截图。图库标签保留 VChart 过渡，截图等待标签完全显示。

安装测试使用 tarball 中的 StatPlots 与当前仓库构建的 VChart peer，未用源码别名替代待测包。npm 安装曾清理消费目录的 VChart peer 链接，恢复后复验通过；没有把该次缺依赖失败记作包成功。重复注册有效，release 后 canvas 为零；色板许可证和使用文档已确认包含在包内。

### 配色性能与体积

同一 Node 22.23.3 进程交替测量旧包与新包，预热 3 次后取 9 次中位数（ms）：

| 场景 | 原包 | 新包 |
| --- | ---: | ---: |
| validate ROC 10000 | 0.439 | 0.451 |
| compile ROC 10000 | 0.886 | 0.987 |
| validate ROC 50000 | 2.307 | 2.490 |
| compile ROC 50000 | 6.410 | 6.613 |
| compile SHAP 1000 | 0.654 | 0.986 |
| compile SHAP 10000 | 4.715 | 4.084 |

SHAP 使用原生 256 停靠点尺度，1k 点新增约 0.33ms，10k 点未见退化；这些是单机短样本，不是性能保证。UMD min 从 336,668 到 357,044 字节，gzip 从 33,916 到 37,646 字节（+3,730），均不包含外部 VChart。

证据位于 `.vchart-statplots/colors-before/`（源码快照、211 项原单测、基准）和 `colors-after/`（build.log、unit.log、typecheck.log、contracts.log、browser-final.log、browser-final-targeted.log、lint.log、benchmark.json、comparison.json、consumer-cjs.json、consumer-typecheck.log、pack-browser-smoke.json 及截图）。本轮没有修改 VChart 核心，也未提交、推送或发布。


## Hexbin 原始散点与正六边形重构（2026-10-08）

hexbinPlot 改为 `data:[{x,y}]` 与可选 `binning.xBins`（默认 30，整数 1–200）。编译阶段归一化并分箱，内部生成计数、完整顶点和原始单位的轴域；专用原生 Layout 保持正六边形。旧 id/count/vertices 输入直接拒绝。Schema、中文契约、机器目录、skill 指南、主例和四份数据/分辨率变体同步更新；不新增运行依赖。

- Node 22 构建及 TypeScript（含测试）、Schema、示例、目录检查通过；28 份主示例、73 份有效变体、28 份反例、28 类目录及 78 条意图预期一致。
- Jest 16 套 / **310 项通过**；全包 Chromium **169 项通过**。其他 27 份图表 Schema 未改动。
- 实际几何覆盖 800×600、420×360、1000×420、823.5×599.25、DPR 1/1.25/2；六条边最大差 <1e−5 CSS px，120° 内角余弦误差 <1e−7，邻箱共享两顶点。不同单位、恒定轴、单点、重合点和超小容器正常；已审阅相关截图。
- 计数覆盖重复点、中心、共享边界及两侧、顶点和最大端点，结果与输入排列无关，冻结输入不被修改。真实 tooltip 检查原始单位包围盒及更新后的计数；resize/主题/配色保持箱数据，数据/xBins 更新才重新分箱。
- 反例证明测试能发现拉伸、去重、漏端点和失效更新。禁止更新时 tooltip 实际显示旧计数 2，测试要求 3 因而失败；恢复后全包回归通过。
- 1 万 / 10 万点生命周期守恒与释放检查通过，[性能记录](../benchmarks/hexbin-results.json) 仅为本机单次冒烟；不设环境敏感阈值。
- ESLint 0 errors / 427 warnings；JavaScript 语法与 git diff --check 通过。证据保留在 `.vchart-statplots/hexbin/{build,unit,browser,lint,counter-*}.log` 及该目录截图。

本轮仅修改 StatPlots，未改 VChart 核心；上述浏览器全包回归不等同于官方 develop 的全量视觉基线比较。

## Histogram 原始观测重构（2026-10-08）

histogram 现在接收单变量 `data:[{value}]`，在编译阶段按可选 binning.binCount 确定等宽边界并计数；默认使用 Sturges 候选数。删除 series 与旧 binStart/binEnd/count 输入，保留 count/proportion/density。域、边界与查箱工具从工作区 pairPlot 实现抽取为共用几何函数，分组和缺失职责仍由 pairPlot 处理；不新增运行依赖。

- ESM/CJS/UMD 构建、源码与测试 TypeScript、Schema 一致性检查通过。28 主例、79 有效变体、28 反例，28 类目录与 81 条意图预期检查通过；中文协议、迁移和 Python 原始观测交接同步更新。
- 全包 Jest **20 套 / 383 项通过**，Chromium **191 项通过**，包含 ESM 独立引擎注册。共享工作区同时开发 pairPlot，因此总数包含其新增回归，不能把所有改动归属到本任务。
- 计数守恒、重复值、内部边界归右、最大端点、零箱、空样本、恒定值、不可表示的浮点边界与密度面积均有断言。真实 hover 检查上下界、原始计数及显示量；同一实例更新数据和箱数，检查实际柱几何与 tooltip。200 箱窄容器先复现默认最小像素宽度破坏区间，使用标准 barMinWidth='0%' 后通过。
- 六项重点浏览器用例连续五轮通过；九种统计量/常数/零箱/深浅主题/宽窄窗口截图的五轮 SHA256 完全一致，已审阅截图。独立副本的去重、漏最大端点、内部边界归左、删除零箱、抑制更新和抑制 hover 反例均按预期失败，控制版本通过。
- 1 万 / 10 万观测的 compile 中位数约 **0.3 / 1.6 ms**；生命周期检查增加重复观测后 sum(count)=N+1，resize 保持箱数据，release 后 canvas=0。20 图表各 1,000 观测创建和释放通过，[性能记录](../benchmarks/histogram-results.json) 为本机冒烟，不设毫秒 SLA。
- ESLint 0 errors / 556 warnings，git diff --check 通过。最终浏览器测试使用冻结的 UMD/ESM、示例和页面资源，由 Vite 保留 ESM 解析并关闭热更新；此前并发构建引发的资源重载及依赖产物缺失，恢复构建和隔离资源后复验通过。

截图复查发现原生轴更新错误：系列统计先使用旧 min/max 更新 scale，轴 reInit 随后才应用新边界，之后没有统计事件。在线性轴标准 reInit 路径仅在解析后的显式边界变化时调用 updateScaleDomain，避免范围不变时追加计算。新单测覆盖变化、range 别名、移除边界及重复初始化；常数域与普通域往返的实际 scale 断言先失败后通过。线性轴 14 项单测通过，关联轴及更新单测按文件隔离的 6 套 / 27 项通过；批量 Electron runner 曾出现 stage.defaultLayer 为 null 的执行错误，相关文件隔离复验通过。VChart 源码类型检查和改动文件 lint（0 errors / 20 warnings）通过。

新增清单用例 linear-axis-update-bounds 与官方 develop `d169be9f3d63ed1e998dead9711dac5fb5af91fc` 的单例比较 **通过且无像素差异**，报告位于 `.vchart-visual/runs/1791446421440-bd8445bb/index.html`。本地冻结构建的轴目录 30 项自比较通过，新用例连续五轮截图一致；独立副本抑制更新、使用错误边界均被检出。

官方轴目录比较 **未完成**：基线侧已有 band-axis-update-spec 的分类轴主题更新断言失败，工具在本地阶段开始前中止。报告位于 `.vchart-visual/runs/1791446345535-0d19f435/index.html`；不能把本地自比较写成官方目录通过。本轮未运行官方 develop 全量比较，提交 PR 前仍须执行。

证据位于 `.vchart-statplots/histogram/`：unit-final.log、browser-final.log、stability-final.log、stability-images.json、contracts-final.log、lint-final.log、counterexamples/、native/results.json、core-unit-isolated.json、core-typecheck.log 及截图。冻结资源的完整浏览器复现命令为 `packages/vchart-statplots/node_modules/.bin/playwright test --config .vchart-statplots/histogram/playwright-frozen.config.cjs`；标准独占工作区可直接使用包内 test:browser。

## KDE / ECDF 原始样本重构（2026-10-08）

两图统一接收原始 `{value, series?}` 样本，拒绝旧 density / cumulativeProbability 输入，允许无序和重复值，各系列独立归一化。直接声明 `@visactor/vutils ~1.0.24` 并复用 kde / ecdf evaluator；未复制统计算法，也未修改 VUtil。KDE 默认 Gaussian + Scott，带宽配置真正生效；单样本 / 常数系列需显式正带宽。ECDF 保留全部真实跳点和重复值权重，并补齐首尾平台。

关闭采样点符号后采用原生 dimension tooltip；shared line / tooltip helper 仅新增可选参数，其他图表的默认点符号和 mark tooltip 保持原有行为。同步了 TS、生成 Schema / AJV、主例 / minimal / grouped / invalid、新变体、catalog、中文逐图文档及迁移说明。

| 检查 | 结果 |
| --- | --- |
| Rush 离线更新与锁文件安装检查 | 通过；锁文件仅增加 StatPlots 的直接 vutils importer |
| build / TypeScript / ESLint | 通过；ESLint 0 errors，现有非空断言及测试 any 警告仍存在 |
| Schema / 示例 / catalog | 通过；28 主例、83 有效变体、28 反例、81 意图预期 |
| Jest | 22 套、424 项通过 |
| Chromium 全量浏览器 | 最终 203 项通过，无跳过和阈值调整 |
| ESM / CJS / UMD | 原始 KDE / ECDF 输入与数学结果通过；ESM 使用调用方自己的 VChart engine |
| 五轮定向浏览器 | 30 项通过；8 组截图各五轮完全一致，已查看阶梯、常数、Gaussian 及分组深色图 |
| 受控反例 | 丢弃 ECDF 重复值权重、忽略固定带宽都会导致新增断言失败；故障修改已恢复 |
| 原生折线官方 develop 比较 | charts/line 7/7 通过，0 视觉差异、0 执行错误 |
| git diff --check | 通过 |

完整浏览器首轮曾在已有 Pair Plot 8 变量 × 10k 的 brushEnd 等待中超时；单独重跑通过，最终整套重跑也通过。一次 CJS 单格式清理构建还删除了 vutils-extension 的 ESM 产物，已通过构建两种格式恢复并验证；没有通过修改断言、跳过用例或增大超时解决。

定向测试断言真实 ECDF 跳点 x=1、首尾平台、常数从 0 跳到 1、KDE 参数更新后的真实曲线与 hover 值、系列增删、颜色 / 主题、resize 数据不变、同实例更新和释放后 canvas=0。性能覆盖 10k / 100k（ECDF 含全部不同值）以及 20 图表创建 / 释放，记录见 [性能基准](../benchmarks/distribution-results.json)；KDE 256 点约 9 / 93 ms 编译中位数，ECDF 100k 不同值保留 100002 个绘图点。数据是本机测量而非 SLA。UMD min 为 367604 bytes，gzip 为 42106 bytes，外置 VChart；增加了 vutils 的许可文本。

原始证据保存在 `.vchart-statplots/distributions/`：`unit-final.log`、`browser-complete.log`、`esm-final.log`、`counterexample-*.log`、`screenshot-stability.json`、`*-timings.json` 和截图。原生三图报告为 `.vchart-visual/runs/1791449431631-423703bf/index.html`，Agent 摘要为同目录 `agent-summary.md`；基线为官方 develop `d169be9f3d63ed1e998dead9711dac5fb5af91fc`。

本次没有创建 PR，原生比较范围仅为 charts/line；提交 PR 前仍须运行全量官方 develop 比较。上述新算法语义由本包单元 / 浏览器测试验证，原生目录比较不替代它们。

## BoxPlot 原始样本重构（2026-10-08）

boxPlot 接受原始 `{category,value,series?}`，按 category + series 独立排序，复用 vutils quantileSorted 线性插值；whiskers.iqrMultiplier 默认 1.5，允许有限非负值。旧五数摘要、outliers 数组和 whiskerRule 字符串拒绝。小样本须候选落入箱体时停在对应四分位数，零 IQR 不自动切换 min/max，重复异常值不丢弃。统计只在编译阶段执行，resize / hover 不扫描原始观测。

| 检查 | 结果 |
| --- | --- |
| ESM / CJS / UMD build、TypeScript | 通过；CJS 独立 require 原始箱线数值断言通过，ESM 与 UMD 在真实浏览器渲染 |
| Schema、示例、目录 | 28 主例、88 有效变体、28 反例；28 类目录和 81 条意图预期一致 |
| ESLint | 0 errors / 625 warnings；未禁用规则 |
| Jest 全包 | 23 套 / 443 项通过；新增箱线 21 项覆盖统计与非法输入 |
| Chromium 全包 | 212 项通过，包含新箱线统计、真实 hover/update、性能和 ESM 入口 |
| 截图稳定性 | 新增三个定向测试 × 五轮 = 15 项通过；五组截图 × 五轮 SHA256 全一致 |
| 错误反例 | 围栏冒充须、去重样本、忽略 k 的临时改动分别被定向测试检出；恢复后构建和全量验证 |
| 官方 develop 原生视觉比较 | charts/box-plot 4/4、components/title 1/1 通过，0 差异、0 执行错误 |

真实浏览器断言箱体五数和异常点坐标、纵轴包含极值、箱体与异常点 tooltip 内容、IQR 倍数变化移除旧异常点、双层分组位置、首次系列顺序、图例与箱体同色、主题、空表往返、同实例更新、resize 保持统计数据，以及 release 后 canvas=0。截图已审阅。空态往返发现公共编译层 title=undefined 无法清除旧说明，已通过明确 title.visible/text/subtext 修正；图例采用公开 item.shape.style 显示系列描边色。没有修改原生 VChart 核心。

性能覆盖 10k / 100k 的单组、十组、20% 异常点，以及 20 图表创建/释放。[测量记录](../benchmarks/box-plot-results.json)：普通单组编译中位数约 0.9 / 9.6 ms；100k 数据生成 20000 个真实异常点图元，约 61 ms 首绘、53 ms 更新、54 ms resize。统计复杂度 `O(N + Σ N组 log N组)`，绘图规模随箱数和异常点数增长；本机测量不作为跨设备 SLA。UMD min 366759 bytes / gzip 41755 bytes，较上次 KDE/ECDF 记录减少 845 / 351 bytes。沿用已有 vutils 直接依赖，锁文件无改动。

原始证据保留在 `.vchart-statplots/box-plot/`：`unit-final.log`、`browser-complete.log`、`stability.log`、`build.log`、`eslint.log`、`counterexample-*.log`、`screenshot-stability.json`、`timings.json` 及截图。首次原生视觉构建在工作区仍在修改时触发 WORKSPACE_CHANGED，没有完成比较；该过程清理了共享 vutils-extension 的 CJS，导致当时启动的包测试缺少模块，恢复其 ESM / CJS 双格式后上述全量检查通过。首次新 hover 测试也暴露了测试坐标重复应用图元平移，修正全局坐标后真实 hover 通过；没有跳过测试或放宽断言。

原生箱线图三图报告为 `.vchart-visual/runs/1791451732479-31d8ad04/index.html`；标题报告为 `.vchart-visual/runs/1791451755857-3b4c3b1b/index.html`。两个目录的 `agent-summary.md` 均已审阅，基线为官方 develop `d169be9f3d63ed1e998dead9711dac5fb5af91fc`。这些目录比较不替代新统计契约的包级数学和浏览器验证。

本次未创建 PR；提交 PR 前仍需执行全量官方 develop 比较。最终原生视觉构建会清理共享依赖的部分格式，结束后恢复了 vutils-extension 的 ESM / CJS 双格式，保留可用的开发环境。


## ViolinPlot 原始样本重构（2026-10-08）

输入改为原始 `{category,value,series?}`，旧 density 明确拒绝；按 category + series 独立使用 vutils KDE。KDE 模型、网格和数值边界提取为共享模块，保留 kdePlot 公共类型和统计行为。Gaussian / Scott 默认与 kdePlot 一致，宽度归一化仅修改私有绘图宽度；tooltip 展示样本数、原始范围、实际带宽和采样峰值。

| 检查 | 结果 |
| --- | --- |
| TypeScript / 完整 build | 通过，生成 ESM / CJS / UMD |
| Schema / examples / catalog | 通过，28 主例、91 变体、28 反例、81 条选型意图 |
| Jest | 23 套 / 466 项通过；反例恢复后 KDE / violin 51 项再次通过 |
| Chromium 全包 | 219 项通过，包括 KDE / ECDF / boxPlot 既有回归 |
| 定向重复 | violin 3 项 × 5 轮，15 项通过 |
| 截图稳定性 | constant、epanechnikov、width、area、area-dark 各五轮字节一致，已审阅 |
| 反例检查 | 错误带宽、丢失重复样本、忽略 area 的临时修改均触发目标统计断言失败，已恢复 |
| 官方 develop 原生视觉比较 | charts/area 10/10 通过，0 差异、0 执行错误 |

数学测试使用解析 Gaussian / Epanechnikov 公式，断言 Scott / Silverman 的总体标准差规则，验证与 kdePlot 的网格和密度一致；等面积测试同时检查实际梯形积分和不同分布峰宽关系。边界包括乱序/重复观测、冻结输入、独立分类/系列、组合键、常数组显式带宽、空表、非法旧字段/参数、不可表示网格，以及稀疏采样造成零面积时的编译错误。

真实浏览器验证轮廓采样数、坐标和核尾部轴域、hover 摘要、原始值/带宽/核/采样数/归一化更新、系列颜色和位置、图例真实过滤、空表往返、theme、resize、release，以及连续 50 次更新事件不重复订阅。ESM 用自己的 VChart 引擎注册并断言原始 violin 密度，CJS 实际编译输出和浏览器 UMD 同样有效。

与 Python 的对照依据官方文档及源码，未运行 SciPy 环境或宣称与 Python 输出逐点一致。原始样本和分组 KDE 流程一致；固定带宽单位、总体/样本标准差、默认 width/area、采样数与尾部范围、实际轮廓面积归一、常数组行为等差异已在[逐图文档](plots/violinPlot.md)列明。优先保证本包 violinPlot / kdePlot 的同样配置得到同样密度。

[性能记录](../benchmarks/violin-results.json)包含 10k / 100k 单组/十组，每组 256 个绘制点，compile 暖机后九次测量；单组中位数约 10 / 101 ms，首绘和更新包含重新编译，resize 不计算 KDE。20 图表各 1000 观测，释放后 canvas=0。UMD min 370668 bytes / gzip 42656 bytes，较 boxPlot 验收记录增加 3909 / 901 bytes；没有新增依赖或改锁文件。

首次全包浏览器 218 项通过、1 项性能用例失败：从 boxPlot 沿用的更新测试新增了单样本类别却没有带宽，违反新 KDE 契约。修正为向现有组追加原始观测后定向性能用例通过，再执行全包回归；没有在实现中增加单样本自动带宽或放宽断言。

原始证据位于 `.vchart-statplots/violin/`：build.log、eslint.log、unit-final.log、browser-first.log、browser-complete.log、mutation-*.log、screenshot-stability.json、timings.json、cjs-size.json 和截图。性能归档使用定向运行结果；后续全包运行会生成自己的 timings.json。

本次未创建 PR；提交 PR 前仍需按工程规范运行原生全量官方 develop 比较。

原生面积图三图报告为 `.vchart-visual/runs/1791453548482-715e69b8/index.html`，`agent-summary.md` 已审阅。目录比较不替代新统计契约的数学和浏览器验证；原生视觉构建结束后恢复 vutils-extension 的 ESM / CJS 双格式，保留可用开发环境。

## 七类图表的原始输入重构（2026-10-09）

countPlot、confusionMatrix、rocCurve、precisionRecallCurve、calibrationCurve、qqPlot、autocorrelationPlot 已改为原始观测入口，旧统计结果直接拒绝。count 比例默认全表分母，可显式切换系列内分母；混淆矩阵补完整方阵、允许 classOrder 声明未出现类别、零分母保持 NA。ROC 合并同分、保留全部阈值并计算 AUC；PR 使用 stepBefore，AP 按召回增量计算，基线来自每组正例率。校准等宽/等频、边界相等入左箱，空箱省略。QQ 使用正态参数、i/(N+1) 位置及内部参考线；ACF 使用有偏自协方差，PACF 使用 Yule–Walker MLE，置信带围绕零。

Schema、standalone 校验器、主例/最小/分组/反例、8 个新配置变体、机器目录、中文逐图契约及 Python 交接同步迁移。固定 numpy 1.26.4 / scipy 1.13.1 / scikit-learn 1.5.2 / statsmodels 0.14.4 生成 19 组独立对照；另检查标准正态逆 CDF 尾部和分段边界，绝对误差上限 5e-8。

本地验收（Node.js 22.23.3）：

- StatPlots 全部单元：29 suites / **528 tests**；Chromium 全包：**257 passed**。覆盖真实图元、hover、图例同步过滤辅助图层、同实例更新、主题、resize、空态和 release。
- build（ESM/CJS/UMD）、Schema 一致性通过；28 主例、99 有效变体、28 反例及 28 类目录 / 89 意图预期通过。ESLint **0 errors / 747 warnings**，警告包括现有和测试代码中的 any / 非空断言，没有关闭规则。
- 七图截图各重复五轮，PNG SHA-256 一致，已审查外观。七个数学变异（拆同分、AP 梯形积分、校准边界、QQ 位置、ACF 分母、count 比例分母、NA→0）均触发断言失败，之后恢复源码。
- [性能记录](../benchmarks/raw-input-results.json)：10k/100k 各九次 compile，另测独立 validate；全部七图浏览器生命周期及 20 图表 × 1000 样本通过，释放后 canvas=0。ROC/PR 使用不同评分，QQ 保留全部点，ACF/PACF 另测 512 滞后。属于本机冒烟，不设时间阈值，不与旧预计算输入做虚假等价对比。
- 官方 develop `d169be9f3d63ed1e998dead9711dac5fb5af91fc` 的 **charts 目录 107 / 107 通过，零视觉差异和执行错误**。报告 `.vchart-visual/runs/1791512131030-62dd3e29/index.html` 与 agent-summary.md 已审阅；其余 153 个原生用例未运行。本次没有创建 PR，PR 前仍需全量比较；结束后恢复 vutils-extension 的 ESM / CJS 构建产物。

初轮全包浏览器 255 通过、2 失败：ESM 预打包缓存没有新的 normalQuantile 导出；另外工作区重建导致图库导航被中断。Vite 显式预打包根入口 vutils，恢复依赖产物，在稳定工作区完成上述全包回归。ACF 最终使用原生 line：每根竖线按内部键分段，颜色 scale / 图例 field 明确绑定原始 series，与点和置信带同步，不维护手工显隐。单个非零滞后的区间增加半滞后绘图边缘，防止面积退化。

证据位于 `.vchart-statplots/{build-raw-input.log,unit-raw-input.log,browser-all-raw-input-final.log,contracts-raw-input.log,lint-raw-input.log,counter-raw-results.json}`，截图、稳定性和生命周期记录在 `.vchart-statplots/raw-input/`。

收尾移除 ACF 未使用的 zero 字段及多余复制，修正 classOrder / normalization 的注释归属。重建、528 项单元及相关图表/ESM 的 16 项浏览器检查通过，记录为 `browser-raw-input-cleanup.log`；35 张截图再次核对一致。

### 上游发布前置项

相邻 VUtil 仓库把回归区间原有的 Acklam 实现提取为公共 normalQuantile，回归区间复用该工具；端点为 ±Infinity，非法概率为 NaN。46 suites / **206 tests**、独立 compile 和构建通过，根入口声明及运行导出均已核对；构建保留原有 Rollup TS6304 警告，源 tsc 无错误。源/test/lint 使用对应的 TypeScript 项目边界，避免测试文件位于 source rootDir 外。

当前 npm 1.0.24 尚无该公共导出。本地使用 Rush PNPM 标准 link 和明确未发布的开发版本 `1.0.24-dev.normal-quantile`，避免 TypeScript 将同版本类型重定向到旧安装包；没有深层导入、复制算法或直接编辑 node_modules。StatPlots 依赖范围及 Rush 锁文件仍指向原已发布版本，**不能把 fresh install 或可发版交付写成通过**。须先发布 VUtil API，再更新依赖下限及锁文件到实际版本并重新验收。本轮未提交、未发布。

## 混淆矩阵与相关矩阵的显示对齐（2026-10-09）

两图共用私有 MatrixLayout、matrixAxis 和 createMatrixColorBar，移除相关矩阵专属的重复布局／色条实现。混淆矩阵改为方形紧密网格、主题背景色 1 CSS px 边界和原生标签避让；色条最大值在上，计数采用整数刻度，归一化固定 0%～100%。计算结果、classOrder、灰色 NA 和原始 count Tooltip 保持原契约。主例为 30 条观测的完整三分类矩阵，对角行比例 80%、70%、70%；零分母场景留在 actual 变体，并登记验证目的。

Node.js 22.23.3 本地验收：

- 完整单元 **30 suites / 539 tests 通过**；ESM / CJS / UMD 构建、Schema、28 主例／99 有效变体／28 反例以及 28 类目录／89 意图校验通过。公开类型和 Schema 的本次样式契约未改变。
- 初轮专项浏览器 **49 项通过**。完整浏览器共执行 **266 项，265 通过、1 项 ROC 旧断言失败**：此前 ROC 示例从每模型 4 条观测增至 10 条，旧测试仍写死 5 个曲线点，实际应为 11 个。断言修正为“不同分数数量 + 起点”，同一用例复测通过。其余 265 项没有因该测试修改重新全跑；266 项用例已分别验证通过，不能把初轮全量写成零失败。
- 混淆矩阵专项覆盖 2×2、3×3、20×20，三种容器尺寸、light/dark、四种 normalization、类别反序、NA／零、真实 hover、空态往返、resize、release、自定义色板、计数上限 1／3／10、百分比刻度；新增长色条标题的窄屏截断断言，单例复测通过。
- 两种矩阵在 DPR 1／1.25／2 的色条与实际格子像素一致。相关矩阵现有三角、NA、长轴标签、密集布局及 10,000 格生命周期回归通过。重构前后 **41 张相关矩阵截图 SHA-256 完全相同**；两图各连续 **5 次**代表截图一致，已查看主例、深色 NA 和密集截图。
- 反例在本地 UMD 产物中受控注入：恢复单元格间隙触发真实格子尺寸断言，反转渐变触发色条／单元格像素断言。两例准确失败后恢复原产物，不提交故障注入。
- 混淆矩阵 **10,000 格**同实例 render、比例／类别方向／主题 update、resize、release 通过；真实格数与颜色装饰数量保持正确，释放后 canvas=0。本机一次冒烟计时：包含导航的首次渲染 329 ms、浅色 update+resize 129 ms、深色 update+resize 270 ms；不设时间阈值，不当作跨环境性能承诺。
- 原生 `charts/heatmap` 对官方 develop `d169be9f3d63ed1e998dead9711dac5fb5af91fc` 的 **1 / 1 用例通过，无差异、无执行错误**；报告 `.vchart-visual/runs/1791514780717-1433ca31/index.html` 和 agent-summary.md 已审阅。其余 259 个原生用例未运行，PR 前仍需全量。此原生用例验证 heatmap 集成，新增 StatPlots 显示由专项浏览器和重构前后截图验证。

原生视觉构建清理了 vutils-extension 的开发产物，导致并行启动的后续契约校验找不到该包的 CJS 入口；通过该包标准 `npm run build` 恢复双格式产物，再运行全部契约检查通过。没有复制入口或编辑 node_modules。ESLint 无错误，警告包括既有和测试代码的 any／非空断言，未关闭规则。

证据：`.vchart-statplots/{matrix-build.log,matrix-unit-all.log,matrix-contracts.log,matrix-lint.log,matrix-browser.log,matrix-browser-all.log,matrix-browser-roc-fix.log,matrix-browser-title.log,matrix-native-visual.log}`；截图、两图稳定性、反例报告及 10,000 格计时位于 `.vchart-statplots/matrix-style/`，相关矩阵连续五轮截图位于 `.vchart-statplots/correlation-matrix/stable-full-*.png`。

本次没有提交或创建 PR。前述 VUtil 公共导出发版前置项仍然存在，不由样式优化解决。

## 本地提交整理（2026-10-09）

用户已要求整理并提交全部本地改动，范围包括七类统计图的原始输入、ROC 对比示例、共用矩阵样式、生成的 Schema／校验器、中文文档、计划、Python fixtures 和性能记录。VChart 使用 codex/vchart-statplots，VUtil 的 normalQuantile 改动从发布分支切到 codex/normal-quantile 保存；两个仓库分别提交。

上述“未提交”是对应阶段的验收时状态；提交整理不新增发布动作或 PR。保留明确未发布的 VUtil 开发版本用于本地联调，实际发布后仍须更新 StatPlots 的依赖下限和 Rush 锁文件。提交检查复用近期 539 项单元、266 项浏览器用例的验证结果及原生视觉报告；VUtil 的源码／测试配置整理后重新执行 compile 和完整单元测试。

## 时间序列与 KDE/violin 配置优化验收（2026-10-09）

时间序列新增显式 observations/estimates，复用 pointInterval 的样本估计；原始观测按实际时刻分组、稳定排序，保留显式 null 断点。默认均值 + 95% bootstrap CI（1000 次，seed 0）；直接连线、median、SE/SD、percentile/range 和外部区间有独立契约。旧外部区间输入必须增加 input=estimates。

KDE/violin 自动带宽采用样本标准差，支持倍率与 cut。KDE 默认全体样本比例缩放；violin 默认 area，同系列跨分类共享尺度，新增 count 和全体范围。area 采用范围最大 PDF 峰值，不再用截断曲线的梯形积分二次归一化；实际 PDF 不混入 violin 样本量权重。旧默认 population/series/width/cut 可显式恢复，旧显式 area 不承诺逐点兼容。

VUtil 修改位于 `/Users/bytedance/Documents/opensource/VUtil` 的 `codex/statplots-kde-bandwidth`，从执行时最新 origin/main `929bcaf` 创建；该阶段尚未提交，随后已通过 [VUtil PR #293](https://github.com/VisActor/VUtil/pull/293) 合并。KDE 保留总体标准差默认，复用 mean/variance 与缩放中心差值；新配置在 factory 校验，倍率只乘一次；极端有限输入导致中心差值或 n×h 溢出的情况也有确定性测试。该阶段新增 KDE.md 和发布 change 记录，没有新增 Python 源码；上游整理后的实际交付以合并结果为准。

- StatPlots 全量单测 38 suites / 664 tests 通过；type、Schema、standalone 校验器、28 类目录、89 条意图、28 主例、122 变体、36 反例检查通过。ESLint 为 0 errors，原有及同风格 warnings 保留。
- VUtil 四包单测共 101 suites / 820 tests 通过，vutils 类型检查及构建通过。vdataset/vlayouts/vscale 原有 tsconfig 包含测试但 rootDir=src，标准 compile 报 TS6059；配置与 origin/main 相同，未扩大本轮修改范围，补用 `npm run compile -- --rootDir .` 全部通过。
- 固定数值参考来自 SciPy 1.13.1、Seaborn 0.13.2、NumPy 1.26.4。4 组 Gaussian 带宽/PDF，三种 violin 模式 × 两种范围的真实 Python 图形峰宽，以及时间均值/中位数/样本 SE/SD 均通过；参考 JSON 记录版本、输入与参数，不承诺和 NumPy bootstrap 的随机端点一致。
- 浏览器全量 358 项首轮 357 通过，唯一失败为 ESM 用例仍断言旧 violin cut=3；迁移断言后 ESM 入口复核通过。最终 16 项相关浏览器用例通过（包含新 VUtil 构建的性能复核），包括跨分类范围、样本权重、真实图元/hover、图例同时筛选曲线和带、null 断线、切换输入移除旧带、resize 保持统计及 release canvas=0。CJS、ESM、UMD 本地集成与隔离严格类型消费通过。
- 人工查看主例截图：UTC 缺口、不同样本量的 KDE、跨分类 violin 宽度均符合数值契约。10k 样本性能及前版同机基线见[测量记录](../benchmarks/time-kde-results.json)，bootstrap 成本单独列出；render/resize/hover 不执行统计。

当时的正式依赖限制（已由下方 1.0.27 升级解决）：npm 1.0.26 尚不包含本轮接口。联调使用真实 VUtil 分支构建的 es/cjs 副本，位于忽略目录 `.vchart-statplots/time-kde/node_modules/@visactor/vutils`，仅本地包标记为 1.0.26-kde-dev 以避免 TypeScript 把同版本正式声明与新声明合并；StatPlots 与 VChart 的本地 vutils 链接指向该构建。当时的 package.json 与 Rush 锁文件仍为 1.0.26，不能据此声称正式依赖已验收。原始链接信息保留在联调目录。

原生视觉回归仅比较已有 VChart 渲染用例，不能证明 develop 支持本轮新的 StatPlots 入口。折线 7 项、区间面积 4 项、散点 8 项（包含 StatPlots 回归/残差）与官方 develop 比较通过，共 19 项。components/legend 的完整比较被官方基线的 legend-piecewise-domain 断言阻断：期望 [-1,1]，实际 [-1,0]，随后当前阶段未运行；该用例在 HEAD 已存在，本轮未改。另做当前工作区 10 项图例自比较通过，只用于断言和稳定性验证，不代替基线比较。提交 PR 前仍需运行全量基线比较。本轮不提交或创建 PR。

## VUtil 1.0.27 正式依赖与本地提交（2026-10-10）

8 个项目的 14 处直接依赖统一升级为 `~1.0.27`，涵盖 vutils、vdataset、vscale、vlayouts；Rush 锁文件通过标准 update 生成。14 处实际安装版本均为 npm 1.0.27，StatPlots 与 VChart 的临时开发链接已替换，Rush check 通过。正式包的 KDE standardDeviation / bandwidthAdjust 接口及其数值结果已验证。

VUtil 的带宽改动已经通过 PR #293 合并，本轮检查该仓库的 release/1.0.27 工作区干净。VChart 整理范围包含此前时间序列原始观测输入、KDE/violin 带宽及归一化配置的全部源码、测试、固定参考 JSON、生成 Schema/校验器、示例、中文文档和计划，以及此次依赖升级。

Node.js 22.23.3 验收：

- 10 个 Rush 工程构建任务完成；VChart、vutils-extension 和 StatPlots 类型检查通过。构建保留既有 circular/sourcemap 和 OpenInula 类型警告；自动生成的跨端 bundle 与 VChart Schema 已恢复。
- StatPlots 38 套 / 664 项单测通过；Schema/校验器一致性、28 份主例、122 份有效变体、36 份反例及 28 类目录的 89 条意图检查通过。ESLint 0 错误、1023 条警告。
- StatPlots 浏览器全量 358 项通过，包含时间聚合、KDE/violin 参数更新、真实图元/Tooltip/图例、ESM/UMD 入口及大数据生命周期。Vite 预构建元数据确认 vutils 指向 Rush 安装的 npm 1.0.27。
- 使用本分支 VChart、vutils-extension 和 StatPlots 的全新 tarball 在独立目录安装，四个 VUtil 包直接安装自 npm 1.0.27。CJS 编译 150 份有效示例、严格类型消费、线性/多项式/LOWESS 及原始时间序列/KDE/violin 的 ESM/UMD 绘制、数值与 release 检查通过。
- charts 109 项及 data 4 项与官方 develop `d169be9f3d63ed1e998dead9711dac5fb5af91fc` 的视觉比较通过，共 113 项，无像素差异、执行错误或未完成用例。报告分别为 `.vchart-visual/runs/1791616240925-564b6d20/index.html` 和 `.vchart-visual/runs/1791616364218-ec3ea40f/index.html`；这是两个目录的比较，提交 PR 前仍须运行全量。

本轮证据位于 `.vchart-statplots/time-kde/vutils-1.0.27-*` 与 `packed/result.json`。上述 2026-10-09 的开发包依赖限制已由正式 1.0.27 验收解决；历史阶段的性能测量、失败和基线限制保留原记录。

原生视觉报告：

- [折线](../../../.vchart-visual/runs/1791544491447-8032c99a/index.html)
- [区间面积](../../../.vchart-visual/runs/1791544518105-cc731b3f/index.html)
- [散点与统计回归](../../../.vchart-visual/runs/1791544541980-6b0563ae/index.html)
- [图例基线阻断](../../../.vchart-visual/runs/1791544568797-1fc0727c/agent-summary.md)
- [当前图例自比较](../../../.vchart-visual/runs/1791544632479-f66fe18e/index.html)

中途 range-area 首次运行因修改了文档/清单而触发 WORKSPACE_CHANGED，已在工作区收敛后重跑通过。原生构建会清理 vutils-extension 的 CJS 产物，导致一轮包内检查出现 MODULE_NOT_FOUND；恢复其标准完整构建后重新检查通过，没有修改测试阈值或跳过用例。
