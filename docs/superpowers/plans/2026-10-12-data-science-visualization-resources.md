# Data Science Visualization Resource Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.
>
> 上述执行技能不可用时按任务顺序在当前会话执行并记录结果，不自行安装工具或创建其他任务。用户已授权执行；实施与验收结果见本文末尾执行记录。

**Goal:** 精简技能参考为同版本 TS 声明、必要统计语义和唯一最小示例，让技能按问题与数据条件生成有意义的简洁图表。

**Architecture:** 维护端从固定 npm 包生成 Spec 类型闭包、精简指南与本地索引，替换当前 Schema/完整手册/变体快照；模型按需读取，运行端仍复用 statplots validate/compile 和共享控制器。选图规则仅保留会改变图义的判断，用真实需求检查结果。

**Tech Stack:** Node 22、仓库现有 TypeScript AST/tsc、Python 3.11+ 标准库、固定 VChart/statplots 2.1.8-alpha.0、现有 Node test/unittest/Playwright/Jest。TypeScript 仅维护/开发端使用。

**Design:** [设计](../specs/2026-10-12-data-science-visualization-resources-design.md)。实施起点为 `codex/vchart-statplots` 的 `83eb8f7ce`。

## Global Constraints

- 保留 12 类表格绑定、28 类规范 Spec 和简洁默认页面；不新增统计方法、科学计算依赖、全量自动分析或 profiler。
- npm/UMD 固定 2.1.8-alpha.0，不从 workspace 源码或另一个版本填补发布声明；完整性失败终止同步。
- `.d.ts` 保留发布原字节/相对路径，从 esm/types.d.ts 闭包读取；不复制运行实现/VChart 类型树，不手写第二套联合类型。
- JSON Schema 继续在 statplots 包内生成与运行验证；只从 skill 快照移除，不改公共 validateStatPlot/compileStatPlot 或默认容错行为。
- 指南保留默认值、统计口径、必要范围和小样本/常量/缺失边界。不能认为 `.d.ts` 的 number 覆盖有限数和整数约束。
- 每类一个本地最小 JSON；变体仅保留选项与同版本链接。不得把多个图义合并成伪通用输入。
- 默认仅标题、图表、单位与 Tooltip；交互按需；数据不补零/展开/采样/截断，改图保留使用行/ID/范围/单位。
- 8 图、10 MiB、pair 4 变量/120000 点、矩阵 20 变量、missing 200000 格、KDE/violin 20 组预算不变。
- 参考正文体积下降目标至少 40%；五种常见图平均首次必读字节下降至少 30%。真实列出必读文件，不宣称字节等于 token，不删除图义以达指标。
- 文档优先中文；维护逻辑修在同步源，生成文件不手改。无全局安装、跨仓库修改、发布、push 或部署。

---

## 文件与接口

| 文件 | 职责 |
| --- | --- |
| `packages/vchart-statplots/scripts/sync-visualization-skill.mjs` | 固定下载/完整性、类型闭包、索引/指南生成、staging 与 --check |
| `packages/vchart-statplots/scripts/visualization-skill-resources.json` | 本版本各图保留章节选择器，不包含重复类型或统计说明 |
| `skills/data-science-visualization/references/statplots/index.json` | 新本地索引，替代 docs/plot-catalog.json 的消费者定位 |
| `skills/data-science-visualization/references/statplots/variants.json` | 特殊变体的选项与固定发布链接；普通选择无需读取 |
| `skills/data-science-visualization/references/statplots/types/` | 发布 Spec 声明闭包 |
| `skills/data-science-visualization/references/statplots/guides/` | 从发布 Markdown 提取的精简图义/默认/边界，共同约束单处维护 |
| `skills/data-science-visualization/references/statplots/examples/specs/minimal/` | 28 个唯一可执行最小例子 |
| `skills/data-science-visualization/references/statplots/manifest.json` | 原源文件和生成物 hash、生成器/选择器版本、controller 来源 |
| `skills/data-science-visualization/references/chart-selection.md` | 替代 intent-routing.md，集中实际选图决策 |
| `skills/data-science-visualization/SKILL.md`、`references/input-and-interaction.md` | 精简入口和独立 request 协议 |
| `skills/data-science-visualization/scripts/visualization_io.py` | 从新 index 读取支持 type，其余输入/预算逻辑不变 |
| `packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs` | 类型闭包、来源、引用、失效资源和失败同步 |
| `packages/vchart-statplots/__tests__/browser/skill-catalog.spec.ts`、`skill-minimal.spec.ts` | 新索引消费，不依赖删除路径 |
| `docs/superpowers/validation/2026-10-12-data-science-visualization-resources.md` | 实际阅读量、行为产物、回归和限制 |

索引与 manifest：

```text
PlotEntry {
  type, name, useWhen, avoidWhen,
  typeName, typeFile, guide, example,
  variantFile?, fullDocsUrl
}
VariantEntry {type, variants: [{name, aliases, options, exampleUrl}]}
ResourceManifest {
  package, version, integrity, tarball,
  formatVersion: 2,
  generator: {source, sha256, selectorsSha256},
  files: {target: {sha256, source?, sourceSha256?, sources?, transform?}},
  workspaceAssets, supportedTypes
}
```

直接副本使用 source/sourceSha256；生成索引/指南使用 sources（来源 URL/hash 数组）与 transform（规则标识/章节选择器）。路径相对 references/statplots；不在运行产物中引入本仓库绝对路径。

同步模块新增可独立测试的纯函数：`collectTypeFiles(entry, readText) → Map<archivePath, string>`；`buildPlotIndex(catalog, typeFiles) → PlotEntry[]`；`buildPlotGuide(sourceText, selectors, links) → string`。readText 读取已核验 tarball 文件；links 包含 typeFile/example/fullDocsUrl。旧 syncResources(root)/checkResources(root)、CLI --check/--root 保留。

## Task 1：发布类型闭包与索引

**Files:** 修改同步脚本、runtime 资源测试；生成 types/index/manifest；暂不切换消费者，Task 2 完成后一次切换整套快照。

**Interfaces:** 消费固定 tarball 的 esm/types.d.ts 和 catalog；产生 collectTypeFiles/buildPlotIndex；索引与声明来源同版本。

- [x] 在临时 fixture 写两图联合、相对 import/export 和共享 BaseSpec；测试递归解析及同文件去重、28 图实际映射的判别值、缺文件/路径逃逸/外部依赖拒绝。不要通过读取当前 workspace src 让测试虚假通过。

```js
const files = new Map([
 ['esm/types.d.ts',"export type {A} from './plots/a/types';"],
 ['esm/plots/a/types.d.ts',"import type {Base} from '../../common/types'; export interface A extends Base {type:'a';data:number[];}"],
 ['esm/common/types.d.ts','export interface Base {title?:string;}']
]);
const result = collectTypeFiles('esm/types.d.ts', name => {
  if (!files.has(name)) throw new Error(`Missing declaration: ${name}`);
  return files.get(name);
});
assert.equal(result.size, 3);
assert.equal(result.get('esm/common/types.d.ts'), files.get('esm/common/types.d.ts'));
```

- [x] 运行 `node --test packages/vchart-statplots/__tests__/runtime/skill-resources.test.cjs`，确认缺失纯函数/新契约导致失败。
- [x] 用 TypeScript AST 遍历 import/export，规范化相对路径到 `.d.ts`；解析 StatPlotSpec 的具名联合与 type 判别值，匹配 catalog 的 28 类。保存到 types/ 下保持 esm 内部目录；源字符不重写、不把无关编译 API 的 index.d.ts 当闭包入口。
- [x] buildPlotIndex 生成短索引：新 typeFile/typeName/guide/最小 example 本地路径，变体 exampleUrl 和 fullDocsUrl 固定同版本。不保留指向已删除本地 schema 的属性。
- [x] 用发布闭包生成一个 tsc noEmit 检查（开发端 types=[]、skipLibCheck=false）；统计类型覆盖与来源。原 npm 元数据仅作来源，不把 skill 快照当可安装 SDK。
- [x] 执行 fixture 与实际发布检查，提交 `refactor(skills): reference published statplots types`。消费者切换前不删除旧支持路径。

## Task 2：精简语义、示例去重及完整同步

**Files:** 新增章节选择器 JSON；修改同步脚本与资源测试；生成 guides/28 最小例子/index/manifest；修改 visualization_io.py 与 browser skill-catalog/skill-minimal 读取 index；删除旧 references/statplots/docs/、schema/、examples/specs/variants/、README.md。保留 package.json、LICENSE、THIRD_PARTY_LICENSES.md。

**Interfaces:** 消费 Task 1 类型映射，产出 buildPlotGuide、formatVersion=2 快照；生成器与测试只从新 index 定位。

- [x] 为 28 类逐图审查发布文档，选择明确章节：输入语义、默认值、统计口径、必要边界。公共约束集中 common.md；迁移/性能/构建/库对比不在指南。声明可能已丢失注释，所有统计默认和必要数值约束须在指南保留。
- [x] 写指南提取测试：源语义正文保留、JSON 示例只链接、缺章节失败、源/生成 hash 区分、全部本地链接存在。代表性检查选择 histogram 等宽边界/密度分母、violin 单样本正带宽、correlation 逐对 null/NA、pointInterval 原始/外部区间模式。

```js
const source = '# 图\n简介\n\n## 输入\n每行是真实观测。\n```json\n{"type":"a"}\n```\n\n## 边界\n常数组需要明确带宽。\n\n## 迁移\n旧版历史。\n';
const guide = buildPlotGuide(source, ['输入','边界'], {
  typeFile:'../types/plots/a/types.d.ts', example:'../examples/specs/minimal/a.json', fullDocsUrl:'https://unpkg.com/@visactor/vchart-statplots@2.1.8-alpha.0/docs/plots/a.md'
});
assert.match(guide, /真实观测/);
assert.match(guide, /明确带宽/);
assert.doesNotMatch(guide, /```json|旧版历史/);
```

- [x] 生成短指南而非人工重写参数说明；章节选择器不存在时硬失败，保持完整手册固定链接。最小 JSON 从发布物原字节复制；52 个变体副本删除，索引仍记录选项与固定链接，不伪称变体不支持。
- [x] staging 中验证闭包/所有链接/清单后替换资源；失败保留旧目录和 controller。--check 同时发现改文件、缺依赖、断链接、旧文件残留和过期转换选择器，不能只比文件 hash。
- [x] 所有消费者统一读取 index.json；测试 fixtures 从真实 entry.example 定位。更新安全转义、复制目录和 Python 生成检查，防止删掉旧 catalog 后生成器失效。
- [x] 实际 sync 两次应生成相同字节；运行 --check、Node/Python、28 类发布 HTML 定向测试。确认 controller 内容/数学与 renderer 未改；提交 `refactor(skills): trim duplicate statplots references`。

## Task 3：入口与有意义的选图

**Files:** 精简 SKILL.md、input-and-interaction.md；新增 chart-selection.md 并移除 intent-routing.md；保留 agents/openai.yaml 简洁默认；必要时改六个已有示例标题/图注。

**Interfaces:** 普通问题 → 数据条件与问题对应的 PlotEntry → 图义指南/TS/唯一最小例子 → 现有 JSON request；不新增运行端类型编译或绘图计算。

- [x] 入口只保留目的、选择、生成、真实验收、对话改图与资源导航。28/12 能力集合放 index/协议，不在入口再枚举整套图；控件细节只在协议，不与 chart-selection 重复。
- [x] chart-selection 以问题表达组织分布/阈值/分组/关系/缺失/已有结果，加入组 N/常量、观测粒度、ID、分母、缺失、密集点/分组保留条件。不要用固定 N 阈值或唯一性自动识别 ID，也不加入强制数据审计报告。
- [x] 普通组比较在少量/常量观测时考虑展示个体；明确指定 violin 的请求不静默换图或猜带宽。只持有汇总频数不展开样本，未知区间/原始高维模型结果不伪造。保留纯散点不默认拟合、相关不解释因果。
- [x] 导航默认只读 selected type 的指南、`.d.ts` 与实际 import 依赖、最小 JSON；特殊变体才读外部固定手册。删除所有指向已移除 schema/docs/variant 的本地引用。
- [x] 交付文字只说明直接回答的问题、数据范围/单位和影响解释的限制；标题含变量/对象/固定条件。没有问题时给一张有依据的图或澄清关键字段，不自动生成 dashboard。
- [x] 协议仍集中保持预算、来源、按需交互、三项输出和对话条件。新增字段视角从原 CSV 按真实 ID 补回；回放只有使用列，不假装完整数据备份。
- [x] 运行 quick_validate、链接检查、六例实际生成；提交 `docs(skills): focus chart selection on data meaning`。

## Task 4：真实问题的行为验收

**Files:** 新增 `packages/vchart-statplots/__tests__/fixtures/skill-meaningful-data.json`（确定性原始数据及题目）；新增 `__tests__/browser/skill-meaningful.spec.ts`（目录均在 package 内）；记录模型实际生成的请求与浏览器产物到忽略目录 `.vchart-statplots/dsv/resources/`。

**Interfaces:** 原始数据/普通需求 → 实际 request/HTML；评估图义和输入，不把有图元当有意义、不把目录预期当模型命中率。

- [x] 构造原始字段含明确 ID、单位、缺失、长尾、重复值、大小不同/常数组的数据。密集点数据使用固定种子；模型结果 fixture 明确方法/来源；汇总频数与未知区间作为独立反例。
- [x] 执行下列普通请求，允许合理替代图型；记录为什么能回答问题，以及是否读取不必要资源：

| 请求 | 必须成立的结果 |
| --- | --- |
| 看收入分布，含 0/缺失/长尾 | 保留 0、重复与长尾，明确有效 N/省略，单位元，不默认平滑或截断 |
| 各部门的收入有什么差别，组内仅少量/常量 | 展示真实个体或明确摘要限制，不编造密度/任意带宽 |
| 看工资不超过某阈值的比例 | 累计口径正确，重复值计入分母，不把密度高度当概率 |
| 密集的两个指标是什么关系，含分组需求 | 表达密集关系同时保留分组，不能把 series 硬塞到 hexbin 或丢掉分组 |
| 看三个测量指标的关系，另含数字 ID/常量/缺失 | 不默认把 ID 当测量，逐对 n 正确，常量/不足显示 NA，不给因果结论 |
| 这是已有 UMAP 坐标 | 不重新拟合、不生成解释方差，真实方法/字段/来源正确 |
| 只看东区，箱线改为小提琴/新增真实字段 | 固定条件、完整使用行/ID/单位保留；新增字段回到真实源，不添加未请求控件 |
| 只有类别与汇总 count | 不展开假样本、不把行数当频数；选择受支持的展示路径或说明边界 |
| lower/upper 的区间意义未知 | 澄清区间含义，不填 confidence/0.95 |
| 只有原始 20 维数据，想看 PCA | 获取真实降维结果或使用分析工作流，不伪造坐标 |
| 指定 violin，但各组仅单样本 | 不把无法自动估计带宽称为成功，讨论实际参数/替代图 |

- [x] 将实际生成请求用于浏览器断言（校验、数据集合、N/分母、单位、真实 Tooltip、默认 DOM、固定范围重放）。例如 ECDF 阈值基准由完整 fixture 手工核对，缺失/重复要进入预期；不只匹配 plot type。

```ts
await openGenerated(page, generate(actualRequest));
await expectRendered(page);
const result = await page.evaluate(chartId => {
  const c = (window as any).__DSV_CONTROLLERS__.get(chartId);
  return {data:c.spec.data, state:(window as any).__DSV_STATUS__.charts[0]};
}, actualRequest.charts[0].id);
expect(result.data.map((r:any)=>r.value)).toEqual([0,1000,1000,2000,5000,20000]);
expect(result.state.inputN).toBe(6);
expect(result.state.omittedN).toBe(1);
await expect(page.locator('button,select,input,.toolbar')).toHaveCount(0);
```

示例要求 fixture 的 income 行为上述六个真实值及一处 null，ID 唯一；请求由实际执行产生，不手写为模型选图命中结论。按需交互场景另显式声明，不套用零控件断言。

- [x] 条件允许且有适用技能授权时，用独立评估者仅给新技能和原始需求/数据，不给期望图型；在忽略目录生成。评估者无法打开/运行时记录限制，不用静态关键词评分冒充正向成功。
- [x] 复核反例与受限场景：正确澄清/拒绝也算正确行为，但不算渲染成功。记录实际产物和不足，针对观察到的问题修技能；提交 `test(skills): verify meaningful data science charts`。

## Task 5：阅读成本、回归与维护记录

**Files:** 新增验收文档，更新 package docs/validation.md 与本文执行状态；需要时新增维护端 `packages/vchart-statplots/scripts/check-visualization-skill-resources.mjs`，若 --check 已能覆盖则不另建重复 CLI。

**Interfaces:** 实际完整资源/常见首次读取清单、真实行为/浏览器证据、固定版本回归与限制。

- [x] 保留本轮旧资源统计。新正文统计 index/types/guides/examples，基线统计旧 catalog/Schema/docs/examples；来源/许可元数据前后同规则单列。五个常见图计算指南+声明依赖+最小例子必读集合；索引访问量计入实际读取记录，不能排除一个仍必须完整读取的大索引来美化指标。
- [x] 正文参考总字节下降至少 40%，五图平均首次必读字节下降至少 30%；无重复 inline JSON/本地例子，也无同一默认/口径三处维护。逐图抽查 histogram/violin/pointInterval/pair/correlation 的重要含义仍完整；指标未达标先审查资源，不删除含义或放宽验收值。
- [x] 运行如下检查，先完成读本地 UMD 前的构建准备，浏览器与核心构建串行：

```sh
node packages/vchart-statplots/scripts/sync-visualization-skill.mjs --check
node --test packages/vchart-statplots/__tests__/runtime/*.test.cjs skills/data-science-visualization/tests/*.test.cjs
python3 -m unittest discover -s skills/data-science-visualization/tests -p 'test_*.py' -v
npm run build --prefix packages/vutils-extension -- -f cjs
npm run compile --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
DSV_PYTHON=python3 npm run test:browser --prefix packages/vchart-statplots
git diff --check
```

- [x] tsc 对新发布 Spec 闭包单独验证；广泛 tsconfig.test.json 的既有错误另记，不因它失败宣称新类型闭包不可用，也不伪称全项目类型通过。
- [x] 28 类固定发布 HTML、12 类绑定、六份复制目录例子、最小页面/按需交互/重放与图库继续通过。声明资源没有执行时依赖；删除 Schema 后的复制技能仍实际渲染。前次 447/664 不沿用为本轮结果。
- [x] 若实施只改参考/同步/索引消费，无核心 renderer 改动，聚焦上述回归；若扩大到公共 render/update/state 路径则按 AGENTS 做相关正式视觉比较，PR 前仍执行全量。既有官方基线四项与扩展 tsc 错误如复现，记录实际 SHA/阶段，不跳例或调阈值。
- [x] 验收文档包含资源来源、减少量、实际读取列表、合理选择/反例、图表/Tooltip与限制、回归命令/结果；明确未测的宿主发现/预览。提交 `test(skills): record lean resource and semantic acceptance`。

## 完成定义

模型不再读取冗长 Schema 和重复手册；使用同版本 TS 声明、短统计语义、一个最小例子即可完成普通请求。实际产物能回答问题，输入与分母/单位/范围真实，明确不具备的模型结果或区间不伪造；现有 statplots 的资源来源、公共校验/编译与简洁默认页面继续复用，维护者能重复生成和核验整套参考。

本轮状态：2026-10-13 已完成实施与本轮验收，分支 `codex/vchart-statplots`。仅参考/同步/索引消费与测试变更，公共计算/渲染未改。既有扩展 tsc 与前轮官方基线阻断、未测宿主行为另记，不作为本轮已通过项。

## 执行记录（2026-10-13）

| 阶段 | 提交/实际结果 |
| --- | --- |
| Task 1 | `06aa116e1`：发布声明闭包/联合映射、strict noEmit 与 fixture 失败/通过验证 |
| Task 2 + 3 | `223f7b7bd`：为保持资源契约一致，一次迁移生成快照、消费者、入口与选图；指南/最小例子保留同版本来源，Node/Python/定向浏览器通过 |
| 首读指标修正 | `461f672f9`：初次内联全部变体仅减少首读 20.5%；改为 variants.json 按需读取后减少 52.2%，完整正文仍包括全部变体元数据 |
| Task 4 | `61b1ad31f`：独立执行 11 题及实际请求七项语义回归；两项最初测试假设改为有效公共契约，图例误判被真实截图/元素纠正 |
| Task 5 | 资源正文 467,558 → 138,084 字节（−70.5%）；五图平均必读 44,122.6 → 21,106.2（−52.2%）；两次同步 hash 一致；Python 两版本各 23、Node 19、Jest 664、完整 Playwright 454 通过 |

开发依赖与核心/Statplots UMD 使用已准备的本地产物，在浏览器运行期间未并行构建清理。七项新测试补充类型注释后，扩展 tsc 无新 skill 错误；原有 confusion-matrix/raw-input/build-schema 错误仍在，不能称全项目类型通过。未重跑核心官方全量视觉、未创建 PR；PR 前全量要求仍适用。未全局安装、发布、push、部署或跨仓库修改。

完整命令、逐题图义/阅读清单、字节统计、实际浏览器证据及未测范围见 [验收记录](../validation/2026-10-12-data-science-visualization-resources.md)。
