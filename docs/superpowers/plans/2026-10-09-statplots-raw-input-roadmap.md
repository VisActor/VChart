# StatPlots 剩余统计图原始输入重构计划

**状态：** 待审阅，尚未实施。countPlot 比例默认范围暂采用推荐方案 all；用户选择不同默认值时同步修改 countPlot 子计划。

**Goal:** 将计数、分类评估、QQ、ACF/PACF 七类图表改为接收观测或逐样本预测结果，由编译阶段完成生成图表所必需的统计变换。

**Architecture:** 公共 spec 描述输入与有效计算参数，统计模块生成私有绘图数据，compile 输出原生 VChart spec。边界校验、统计计算和图元绘制分离；模型训练、降维、SHAP 与通用统计推断仍由外部负责。

**Tech Stack:** TypeScript、VChart、vutils、JSON Schema/AJV、Jest、Playwright；Node.js 22。Python 仅用于离线生成核对结果，不是运行依赖。

## 1. 方案选择

推荐沿用 histogram / KDE / ECDF / box / violin 的原始输入重构方式，直接替换这七类图表的预计算契约，并按四个子项目独立交付。

| 方案 | 收益与成本 | 决定 |
| --- | --- | --- |
| 保留结果输入，仅提供转换函数 | 迁移较轻，但最小图表调用仍要先计算，不能解决本轮问题 | 不采用 |
| 同一 type 同时支持原始与预计算输入 | 兼容旧调用，但需要两套 Schema、校验、文档和参数语义 | 不采用 |
| 单一原始输入，内部编译计算 | 契约清晰；需要破坏性迁移及数值验证 | 采用 |

保持 type 名称、主题、颜色和展示字段标签。删除外部结果字段，不通过展开计数、反推标签或把曲线坐标冒充观测来迁移。只持有结果的调用方使用原生 VChart bar / line / scatter / heatmap / rangeArea。

## 2. 分阶段交付

| 顺序 | 子项目 | 新输入 | 交付边界 |
| --- | --- | --- | --- |
| 1 | [countPlot](2026-10-09-statplots-count-raw-input.md) | category / series? | 内部计数、重复观测、全表或系列内比例 |
| 2 | [分类评估四图](2026-10-09-statplots-classification-raw-input.md) | 真实标签与预测标签、分数或概率 | confusionMatrix、ROC/AUC、PR/AP、校准分箱；共享阈值统计 |
| 3 | [qqPlot](2026-10-09-statplots-qq-raw-input.md) | value / series? | 正态理论分布、原始样本排序、分位点及参考线；先完善 vutils 公共逆 CDF |
| 4 | [autocorrelationPlot](2026-10-09-statplots-autocorrelation-raw-input.md) | 按时间顺序的 value / series? | ACF、Yule–Walker PACF、零中心置信带；复用第 3 阶段的逆 CDF |

第 1、2 阶段不依赖 vutils 新版本，可以先完整交付。第 3 阶段需要上游标准工具的公共 API；第 4 阶段依赖该 API。每阶段完成后记录结果并单独审阅，不把七图改动混成一次不可拆分的大提交。

## 3. 全局约束

- Node.js 22；中文文档；沿用现有公开入口和自动生成 Schema 流程。
- 每行表示一条观测；重复值分别计入。输入数组、行对象和配置归调用方所有，不原地排序或修改。
- 除混淆矩阵维持单矩阵输入外，保留已有 series 分组；沿用 checkSeries，全表全部提供非空系列名或全部省略。
- 分组顺序按首次出现；统计各组独立进行，countPlot 的全表比例是明确例外。
- 空 data 沿用暂无数据行为；非空但统计不可定义时返回具有 JSON Pointer 的明确错误。有限数字、标签和计算参数在公共边界校验，不静默清洗或兜底。
- 统计只发生在 compileStatPlot，包括每次显式更新 spec 时。render、resize、hover、图例过滤和 release 不重算统计、不扫描原始观测。
- validateStatPlot 不排序样本、不生成完整阈值曲线、不执行 O(N×L) 自相关计算。编译结果的不可表示数值或奇异计算以 StatPlotValidationError 报告，不重复执行昂贵计算。
- 优先复用 vutils 的 quantileSorted、ordinaryLeastSquares 等现有工具。当前 invNorm 位于内部 regression-utils，禁止深层导入或复制实现，先提升为标准公共工具。
- 第一版不增加权重、多分类 ROC/PR、自动预测标签阈值、分布参数拟合、任意分布、bootstrap、自定义估计器、FFT、worker 或异步统计。
- 各图生成数据与指标保持私有；本轮不新增通用统计结果查询 API。

## 4. 本轮保留的职责

correlationMatrix、pointIntervalPlot、residualPlot、screePlot、embeddingPlot、featureImportancePlot、learningCurve、shapBeeswarmPlot 保持结果输入。missingValueMatrix 的原始表格入口、seasonalPlot 的日期拆分入口另行设计。

本轮修正 scatterPlot、stripPlot、pairedComparisonPlot、timeSeriesPlot、seasonalPlot 等接口中误写的“预计算统计结果”模板注释：描述实际观测输入；保留可选拟合线和区间的外部计算职责。不能删除所有 method / interval 元数据或暗中改变这些图表的含义。

## 5. 每阶段共同的同步清单

工作路径相对 packages/vchart-statplots：

- 对应 plots/* 的 types / validate / compile，以及子计划列出的统计模块；src/types.ts 继续按已有方式导出公开类型。
- scripts/build-schema.ts 生成 schema/statplot.schema.json、对应 schema/plots/*.schema.json 和 src/generated/validate.*；禁止手改生成文件。
- examples/specs/<type>.json、minimal/<type>.json、已有 grouped/<type>.json、invalid/<type>.json；有目的的新变体登记到 examples/specs/index.json 与 docs/plot-catalog.json。
- README.md、docs/spec.md、docs/computation-contract.md、docs/catalog.md、对应 docs/plots/<type>.md；替换计算契约中的旧 Python ROC 交接示例。
- __tests__/unit/schema.test.ts、second-phase.test.ts、third-phase.test.ts、roc.test.ts、field-labels.test.ts 及浏览器 semantics.spec.ts、variants.spec.ts、catalog.spec.ts 中的旧输入迁移。搜索整个包确认旧字段仅用于生成结果或负例。
- docs/validation.md、性能记录及迁移说明：标明破坏性变更、Python 支持范围和实际差异。

## 6. 统一验收

- [ ] 先运行每阶段有明确预期的数学反例，再实施对应行为；不得用绘图点自我核对代替原始输入的独立预期。
- [ ] 固定 Python 版本，离线生成 sklearn / SciPy / statsmodels 对照 JSON，记录版本、参数、输入、输出及容差；提交 fixture，JS 测试无需 Python。
- [ ] 包级 build、eslint、check:schema、check:examples、check:catalog、全部单元测试与 Chromium 测试通过。
- [ ] 浏览器检查真实图元、轴域、hover 值、图例过滤、同实例 updateSpec、resize、主题、空数据往返和 release。交互断言实际状态变化。
- [ ] 使用确定性 10k / 100k 输入记录 compile、render、update、resize、release；另记录 20 图表页面。记录绘图规模，不能只测高度压缩的输入。
- [ ] 新增截图重复五轮，审查外观改变及反例。开发完成后依据影响运行相关原生视觉目录；若修复公共渲染、布局、数据或状态路径，扩展范围或运行全量。
- [ ] 创建 PR 前运行官方 develop 的全量原生视觉比较；self-compare 只验证稳定性。审查 HTML / agent-summary.md，记录基线不支持新功能或执行阻断；不跳过用例、放宽阈值或写成通过。

```sh
npm run build --prefix packages/vchart-statplots
npm run eslint --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
node packages/vchart/scripts/visual-test.mjs
```

此文档及四份子计划仅用于审阅；本次不改源码、不运行实现验收、不提交或发布。确认执行后按顺序在当前会话推进，不默认创建独立聊天或委派代理。

## 执行记录

用户已确认执行，七类原始输入代码、契约迁移和本地验收完成，详见[验收记录](../../../packages/vchart-statplots/docs/validation.md)。第 1/2 阶段可独立交付；第 3/4 阶段按计划仅完成明确记录的本地联调，VUtil 公共 API 发版与消费者依赖/锁文件更新仍待执行，不视为可发版交付。未自动提交或发布。
