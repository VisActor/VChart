# 实现与验收记录

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

- 独立统计预期：不等宽直方图面积、ECDF 单调、箱线五数次序、零分母、对称相关矩阵、区间种类、时间合法性、分箱逐箱计数、凸六边形和蜂群碰撞。
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
