# data-science-visualization 资源与图义验收（2026-10-13）

## 已完成范围

分支 `codex/vchart-statplots`。维护端从 npm 固定 `@visactor/vchart-statplots@2.1.8-alpha.0` 下载并核验 tarball integrity；从 `esm/types.d.ts` 递归收集发布声明的闭包。34 个 `.d.ts` 共 23,582 字节，保留原字节与相对 import 路径，TypeScript 严格 noEmit 验证闭包、28 类具名 Spec 与 type 判别值。未借用 workspace 的另一版本声明，也没有复制 VChart SDK 或计算实现。

技能阅读入口改为 `index.json`、所选图的 TS 声明/依赖、短指南、唯一最小 JSON。28 图指南和一份 common 指南由发布 Markdown 按明确章节/片段生成；28 份最小 JSON 保留发布原字节。删除 skill 内重复的 Schema、整套 docs、52 份变体示例。JSON Schema 仍在 statplots 包内生成并由公共 API 使用；运行 HTML 无 TS/npm 编译依赖。

原计划将所有变体内联于索引，实际第一次统计仅降低平均首读 20.5%，未达 30% 目标。因此把特殊变体移到 `variants.json`，保留名称/选项/固定发布链接，索引只用 `variantFile` 指向它。普通选图不需读变体；特殊请求才读对应条目。没有删掉统计边界来达到指标。

入口按观测粒度、问题、ID/测量、组内有效 N/常量、缺失、分母和分组需求选图。未知区间先澄清，原始高维数据转真实分析；指定 violin 不满足自动带宽条件时不猜值或静默换图。默认页面、12 类绑定、28 类规范 Spec、数据预算与按需交互继续沿用。

同步生成器可独立测试闭包、联合映射与 Markdown 提取。staging 验证后替换资源；缺声明/坏 integrity 回滚，保留原资源与 controller。`--check` 核验生成器与选择器 hash、完整文件清单、旧残留、类型闭包、索引/变体、来源与本地引用。两次同步全文件 hash 相同。共享 controller 源/副本均未改；本轮没有修改统计计算、公共 renderer 或页面 CSS/JS。

## 阅读成本

正文按同一范围比较：旧 catalog/docs/Schema/examples；新 index/variants/guides/types/examples。来源、许可、manifest、package.json 前后均单列；不把元数据计入普通必读正文。入口 SKILL.md 另从 6,837 字节降到 3,834 字节。

| 范围 | 旧字节 | 新字节 | 减少 |
| --- | ---: | ---: | ---: |
| 全部参考正文 | 467,558 | 138,084 | 70.5% |
| 五种常用图平均首次参考阅读 | 44,122.6 | 21,106.2 | 52.2% |
| 来源/许可等元数据 | 74,641 | 73,507 | 单列，不参与正文指标 |

首次阅读保守计入**完整** index.json（13,746 字节）、common、所选指南/声明依赖/最小例子；没有只算索引一行。新正文为 34 声明、29 指南、28 最小例子及 index/variants，共 93 文件。字节不是 token，也不是模型质量或命中率。

下表所有路径相对 `skills/data-science-visualization/references/statplots`；每行还读 `index.json`、`guides/common.md`、`guides/<type>.md`、`examples/specs/minimal/<type>.json`、`types/common/types.d.ts`。

| type | 额外声明文件 | 旧必读字节 | 新必读字节 |
| --- | --- | ---: | ---: |
| histogram | types/plots/histogram/types.d.ts | 43,072 | 20,589 |
| boxPlot | types/plots/box-plot/types.d.ts | 42,793 | 20,483 |
| violinPlot | types/plots/violin/types.d.ts、types/common/kde-types.d.ts | 48,163 | 22,905 |
| correlationMatrix | types/plots/correlation-matrix/types.d.ts、types/common/observation-table-types.d.ts | 42,138 | 20,378 |
| pairPlot | types/plots/pair-plot/types.d.ts | 44,447 | 21,176 |

旧五图路径为完整 docs/plot-catalog.json、各图 docs、Schema、最小 JSON。实际逐题读取清单另外记录在独立执行 report.json：均读取技能入口、选择/协议、索引及选中资源；相关矩阵额外读取了 missingValueMatrix 指南；没有读取全部联合声明或全部指南。完整指标与基线见忽略目录 `.vchart-statplots/dsv/resources/{baseline,size-report}.json`。

## 真实需求与浏览器证据

独立评估只获得技能、11 个普通需求和确定性合成原始数据，未获得父任务计划、预期图型或已有结论。原始字段含 ID、明确单位、0、缺失、重复、长尾、常量和不等组 N；密集数据为固定种子 5000 行。结果不代表业务结论。

| 请求 | 实际处理与证据 |
| --- | --- |
| 收入分布 | histogram 保留 `[0,1000,1000,2000,5000,20000]`，有效 6/省略 1；柱计数 4/1/0/1，真实 Tooltip 显示元与边界 |
| 少量/常量部门收入 | stripPlot/swarm 显示 6 个真实点，保留个体 ID 和重复值，未编造密度 |
| 不超过 2000 元的比例 | ECDF 真实悬停显示 4/6，右连续 stepAfter，末尾概率 1；缺失不入分母 |
| 密集关系且保留分组 | scatterPlot 保留全部 5000 点、A/B 两组和 mm/ms 单位；真实 Tooltip 分别命中两组，没有默认拟合/采样/截断 |
| 身高/体重/常量评分，编号为标识 | 仅三个测量变量；身高/体重配对 N=5、r=1；常量对应 5 个 NA 单元，真实 Tooltip 解释不可计算 |
| 已有 UMAP | 原有 4 个坐标、method=umap、外部来源保持；不生成解释方差；A/B 图例可见，真实 Tooltip 保留 ID 与 UMAP 轴 |
| 东区箱线改小提琴 | 两份请求均保留全部 8 行、ID、单位和固定东区条件，实际显示 4 条；移除固定条件后恢复 8 条。两条非恒定组可使用公共默认带宽，图注明确平滑不能推断总体密度 |
| 汇总人数 | 转通用柱图工作流，未展开 150 个假观测 |
| 未知 lower/upper | 澄清区间含义，未猜 95% CI |
| 原始 20 维想看 PCA | 请求真实结果或转分析工作流，未伪造坐标/解释率 |
| 指定单样本/常量组 violin | 说明无法自动估计正带宽，需有依据的固定带宽或讨论替代图；未生成伪成功 HTML |

7 个可渲染需求产生 8 份最终 HTML（含改图前后），独立浏览器验证 rendered、实际图元和鼠标 Tooltip。其余四个是正确澄清/转交，不能称为渲染成功。正式实际请求已保存为 `packages/vchart-statplots/__tests__/fixtures/skill-meaningful-requests.json`，密集数据用同一固定种子 recipe 重建以避免存储重复 5000 行；七项浏览器测试锁定数据、N/概率、单位、Tooltip、简洁 DOM 和重放。

独立报告曾把 UMAP 误判为无图例，但它保存的初始截图和 hover 截图都明确有 A/B。父任务复核实际图例 `legendItemLabel` 的文字/非零 bounds、真实 Tooltip 与两张截图均通过，已纠正报告；未用本地图例兜底更改发布 API。测试最初的两项断言也纠正为公共契约：NA Tooltip 是中文原因，violin Spec 的聚合输入不保证携带观测 ID；ID 在完整可重放 request 中核验，而不是新增兼容承诺。

证据目录：`.vchart-statplots/dsv/resources/forward/independent-20261012-180322/`，含逐题读取、参数、实际请求、HTML 和截图。最终复核图例截图在 `resources/screenshots/umap-legend.png`。实际请求回归不等于每次新模型执行均作出同样选择，也没有计算选图命中率。

## 回归结果

Node 22.23.3；Python 3.11.16 / 3.12.14；Chromium Playwright。下列均为本轮实际运行；前轮 447/664 未沿用充当本轮结果。

| 检查 | 本轮结果 |
| --- | --- |
| 资源离线 check、发布声明 strict noEmit | 通过；类型/链接/清单/来源一致 |
| 同步确定性及完整性/缺声明回滚 | 通过；两次同步全文件 hash 一致 |
| skill-creator quick_validate | 通过；只说明结构合规，不能证明决策正确 |
| Node runtime + data binding | 19 项通过 |
| Python 3.11、3.12 | 各 23 项通过，包含 openpyxl 分支，无跳过 |
| Statplots compile、Schema、catalog、examples | 通过；28 类/89 条目录意图，28 最小/122 有效变体/36 无效输入 |
| Jest | 38 套 / 664 项通过 |
| 28 类发布 HTML + 最小页面定向 | 47 项通过 |
| 真实问题定向 Playwright | 7 项通过 |
| 完整 Playwright | 454 项通过，5.5 分钟；含七项真实问题、28 类发布 HTML、12 类绑定、六份复制技能示例、真实 CDN、交互/失败与规模场景 |
| 新浏览器测试 ESLint | 0 errors / 32 warnings，主要为动态浏览器 API 的 any/non-null |
| 扩展 tsconfig.test.json | exit=2；剩下既有 confusion-matrix.spec.ts/raw-input.spec.ts 隐式 any 和 build-schema.ts DefinitionOrBoolean 错误，新 skill 测试无类型错误，不能声明全项目类型通过 |
| git diff --check | 通过 |

日志均在 `.vchart-statplots/dsv/resources/`：`node.log`、`python311.log`、`python312.log`、`compile.log`、`schema.log`、`catalog.log`、`examples.log`、`jest.log`、`catalog-browser.log`、`meaningful-browser.log`、`full-browser.log`、`test-types.log`。

本轮仅参考/同步/索引与测试变更，未修改公共 render/update/state 路径，未重跑 VChart 官方核心全量视觉。前轮基线 `e5426efe9e363ad4c71757aa4702baa877ead0da` 的 band-axis-update-spec、legend-piecewise-domain、brush-link-data-key、update-resize 四项仍是已记录阻断，不声称正式全量视觉比较通过；PR 前仍须按工程要求执行。详情见 [前轮正式比较](2026-10-12-data-science-visualization-simplification.md#正式视觉比较阻断)。

未验证宿主自动发现/安装、宿主 file 预览、无网络的 CDN 启动或其他浏览器。独立执行使用固定发布 UMD 的核验缓存，并未测试实时公网 CDN；完整回归中不拦截 CDN 的用例实际通过，360px 亮/暗主题布局也通过。没有 push、PR、npm 发布、全局安装或跨仓库修改。

## 维护者可重复测试

从仓库根目录执行，Node 22、Python 3.11+；CSV/TSV/JSON 仅依赖标准库，XLSX 用例需要可选 openpyxl。技能使用者只需生成 HTML，无需运行维护测试或同步资源。

```sh
# 资源与结构
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
python3 /实际skill-creator目录/scripts/quick_validate.py skills/data-science-visualization

# 输入、资源、绑定与生成
node --test packages/vchart-statplots/__tests__/runtime/*.test.cjs skills/data-science-visualization/tests/*.test.cjs
python3 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py' -v

# 实际需求与浏览器交互；DSV_PYTHON 指向 Python 3.11+
DSV_PYTHON=python3 npm run test:browser --prefix packages/vchart-statplots -- skill-meaningful.spec.ts
DSV_PYTHON=python3 npm run test:browser --prefix packages/vchart-statplots

# 公共统计计算、结构及声明
npm run compile --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
```

完整浏览器回归还需已有核心/Statplots 本地 UMD 构建；依赖准备见 [基础验收复现](2026-10-12-data-science-visualization.md#复现命令)。先准备构建，再运行浏览器，避免构建清理与测试同时读取产物。Playwright 的 HTML 报告为 `.vchart-statplots/report/index.html`，失败 trace 可用包内 Playwright `show-trace` 打开。更新技能后还应给独立执行者普通需求及原始数据，核验实际产物与必要澄清；结构校验与固定请求回归不能替代这个步骤。
