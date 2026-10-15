# pairPlot 原始观测与对角分布重构实现计划

> **For agentic workers:** 在当前会话按任务顺序实施并复核，使用下方复选框记录进度；未经用户要求不启动子代理。用户已授权执行本计划，提交和推送遵循后续授权。

**Goal:** 用户只提供变量和原始观测，即可绘制散点矩阵与内部计算的对角直方图，直接移除 `data.diagonal`。

**Architecture:** `语义 Spec → 结构与数值边界校验 → 按变量准备共享域及分箱 → 原生直方图/散点系列 → 既有网格布局与 id 框选联动`。对角分布只在编译阶段计算，resize、hover、brush 不执行统计计算。保留现有 observation id、series、逐面板缺失排除和变量顺序。

**Tech Stack:** Node.js 22、TypeScript 4.9.5、VChart 原生 bar/scatter/grid/brush、既有 Schema/Ajv 生成链、Jest、Playwright；不新增运行依赖或 Python runner。

## 全局约束

- 在 `codex/vchart-statplots` 分支实施；文档优先中文。
- 旧 `data.diagonal` 直接拒绝，删除公开 `PairPlotBin`，不保留预计算输入、自动识别或兼容分支。
- 保留 `data.observations` 包装、`variables`、观测 `id/values/series`；不顺带改其他图表的数据结构。
- 本期只实现对角直方图和关闭对角分布。KDE、相关系数面板、上下三角配置、权重、对数轴、抽样和通用统计库不在本期范围。
- 分组不改变默认图形；同变量各组共享分箱边界，以计数叠加显示，保留不同系列的颜色。
- 不修改调用方数据，不去重坐标、不静默丢弃非法数值、不填补 null；只在公共边界校验合法性。
- 保留原生调用方式；出现布局、brush 或系列缺陷时修正标准路径，不加入私有字段操作或 render 后补布局循环。
- 本轮只负责 pairPlot。执行期间，同工作区另一个已获用户授权的任务同步重构 histogram 为原始 value 输入；双方复用 src/common/histogram.ts，除这项并行改动外，其余 26 类协议保持不变。
- 若改动 VChart 核心，补对应确定性用例并运行相关官方视觉目录；创建 PR 前运行全量官方 develop 基线，不以 StatPlots Playwright 或 self-compare 代替。

## 1. 已确定的公共协议

### 最小输入

```json
{
  "type": "pairPlot",
  "variables": ["年龄", "收入"],
  "data": {
    "observations": [
      { "id": "1", "values": { "年龄": 25, "收入": 8000 } },
      { "id": "2", "values": { "年龄": 30, "收入": 12000 } }
    ]
  }
}
```

省略 `diagonal` 默认直方图；与 `diagonal: {type:'histogram'}`、`diagonal: {}` 等价。自定义箱数与关闭分布分别为：

```json
{ "diagonal": { "type": "histogram", "binning": { "binCount": 20 } } }
```

```json
{ "diagonal": { "type": "none" } }
```

拟采用的公开类型（替换 `src/plots/pair-plot/types.ts`）：

```ts
import type { BaseSpec, SeriesRow } from '../../common/types';

export interface PairPlotObservation extends SeriesRow {
  id: string;
  values: { [variable: string]: number | null };
}
export interface PairPlotBinningSpec {
  /** 每个非恒定变量的等宽箱数；省略时按有效观测数选择。
   * @TJS-type integer
   * @minimum 1
   * @maximum 200
   */
  binCount?: number;
}
export type PairPlotDiagonalSpec = { type?: 'histogram'; binning?: PairPlotBinningSpec } | { type: 'none' };
export interface PairPlotSpec extends BaseSpec {
  type: 'pairPlot';
  variables: string[];
  data: { observations: PairPlotObservation[] };
  diagonal?: PairPlotDiagonalSpec;
}
```

- `diagonal.binning` 和 `binCount` 均可省略；只提供 `binning` 也采用直方图。
- binCount 是每个非恒定变量的箱数；1–200 整数，拒绝 0、负数、小数和 201。上限限制每变量/系列最多 200 根柱，不限制原始观测数。
- `type:'none'` 不接受 binning，包括空对象；Schema 使用联合类型准确拒绝该组合。不引入布尔值、null、`false` 等第二套关闭写法。
- values 必须包含且仅包含 variables 的键；变量至少两个且不重复，id 唯一，缺失显式为 null，series 沿用全有或全无规则。
- title、description、theme、公共 colors 沿用现状。变量名由 variables 提供；不新增 fieldLabels、原生配置透传或统计量选项。
- 新 Schema 的 data 仅要求 observations，禁止 diagonal。无输入分箱的图表不能要求 skill 生成 bins/count。

## 2. 统计与数值规则

### 默认箱数与分组

1. 每变量独立收集范围和有效观测数 N；不采用整行 complete-case 排除。
2. 非恒定且 N>0 时，未指定 binCount 使用 `min(200, ceil(log2(N) + 1))`；采用等宽范围 `[min,max]`。Sturges 只依赖样本量，因此两遍扫描即可，不为默认箱数复制并排序数据。
3. 指定 binCount 时所有非恒定变量使用该箱数，但每变量拥有自己的数值边界；不是共享数值轴或每组单独选箱。
4. 同变量的 N、min/max 来自所有系列的有效观测，共用一份边界；各系列分别计数。组间样本量不同仍显示原始 count，不暗中归一化成密度/比例。
5. 左闭右开 `[start,end)`，最后一箱包含 max；落在内部边界的值归右箱。重复坐标按独立观测计数。
6. 同变量所有有有效观测的系列输出完整箱序列（包括零计数箱）；某系列在该变量上全部为 null 时不生成柱。总 count 等于 N，各组总 count 等于该组在该变量上的有效数。
7. 未分组输出行不添加 series 字段；分组输出使用原 series。bin 边界、计数不受输入排列影响，不以碰撞风险字符串拼接索引分组。

默认规则是本包的明确取舍，不声称复制 Seaborn/NumPy 的 `bins='auto'`。大样本、长尾、多峰分布可能需要显式 binCount；本期不新增算法名称枚举。Sturges 的公式及大样本限制见 [NumPy 官方分箱文档](https://numpy.org/doc/stable/reference/generated/numpy.histogram_bin_edges.html)。

### 缺失、恒定与浮点数

- N=0：域 `[0,1]`，bins=[]，不制造零计数柱。对角面板保持槽位和变量名，计数轴说明 `n=0`；整个图无可绘制数据时沿用 commonChart 的“暂无可绘制数据”。
- 单个有效值或全部相等 c：使用一个箱，即使显式 binCount>1；域为 `c ± max(1,abs(c))/2`，避免原实现 c±0.5 在大偏移处塌缩。文档说明恒定变量只有一个可解释分箱。域须有限、严格递增且跨度有限，否则报告 INVALID_RANGE。
- 非恒定域须有有限的正跨度；使用同一边界数组，第一/最后边界直接取 min/max，中间边界为 `min + (max-min)*(i/k)`。不分别计算相邻柱的两端。
- 自动箱数下，浮点舍入产生的重复边界按严格递增顺序合并，这是默认算法的一部分；有效箱数可能低于 Sturges 候选数。明确指定箱数时重复边界报错，不能静默改成另一个箱数。
- 域不可表示，错误指向 `/data/observations`，指出变量并建议先转换单位/平移；指定箱数不可表示，错误指向 `/diagonal/binning/binCount`。有限值仍可能构成溢出跨度，不只检查单值有限性。
- `type:'none'` 仍验证散点轴域；不创建边界/计数数组，也不因未使用的默认箱数拒绝数据。
- 计数通过共享边界二分查找，使用 upper-bound 的边界归属规则；max 单独归最后箱。最多 200 箱，无需对每个系列重新遍历全部观测。

### 面板与交互

- 对角直方图使用 bar 的 binStart/binEnd/count，关闭 stack；分组用重叠柱和现有 0.45 透明度，避免原生自动分组并排后挤窄箱宽。按原生文档设置分组/宽度相关参数，以实际柱边界验证。
- 对角 y 轴从 0 起，名称为“计数 · n=N”；Tooltip 显示变量、箱下界、箱上界、计数和可选系列，明确最后一箱的闭区间规则。
- 同变量在所有对角/非对角面板共享同一域，nice=false；对角计数 y 轴独立，不参与变量域共享。
- `none` 保留完整矩阵的对角槽位和 x/y 变量标题，隐藏该槽位的 tick/label/grid，不生成直方图或自变量对自身的散点；关闭配置含义稳定。
- 非对角只排除当前 x/y 任一为 null 的观测，继续显示真实面板 n；刷选只链接散点的 observation id，不把聚合柱当作单条观测。
- 分组颜色沿用公共配色。图例仍仅说明颜色、不过滤数据，覆盖所有实际出现的原始 series，包括只在对角面板有有效值的系列；使用原生系列/图例配置保证同名组跨面板同色。
- resize/hover/brush 不重新分箱；data、variables、binCount 更新后经 compileStatPlot 重算。theme/colors 经现有 compile/updateSpec 路径可重新编译，但不能改变计数和边界，不新增复杂缓存。

## 3. 文件结构与内部接口

下表路径均相对 `packages/vchart-statplots/`，总计划文档例外。

| 文件                                                                                                              | 责任                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 修改 src/plots/pair-plot/types.ts                                                                                 | 原始观测协议与可选 diagonal 展示配置；删除公开 PairPlotBin    |
| 新增 src/plots/pair-plot/binning.ts                                                                               | 域、有效数、共享边界、分组计数；只服务 pairPlot               |
| 修改 src/plots/pair-plot/validate.ts                                                                              | 保留观测合法性；删除预计算 bins 校验；检查可表示域与指定箱数  |
| 修改 src/plots/pair-plot/compile.ts                                                                               | 消费内部结果、可选对角系列、共享轴和完整图例；保留 brush/grid |
| 生成 schema/plots/pairPlot.schema.json、schema/statplot.schema.json、src/generated/validate.js                    | 使用 build:schema，禁止手改生成物                             |
| 新增 **tests**/unit/pair-binning.test.ts、pair-plot.test.ts                                                       | 数学计数与公共协议/编译回归                                   |
| 修改 **tests**/unit/fourth-phase.test.ts、schema.test.ts                                                          | 移除旧逐箱输入校验和空数据 diagonal 构造                      |
| 新增 **tests**/fixtures/pair-plot.ts、**tests**/browser/pair-plot.spec.ts                                         | 独立期望值数据、真实柱几何、hover、更新、分组缺失             |
| 修改 **tests**/browser/semantics.spec.ts、pair-performance.spec.ts                                                | 保留真实 id 联动；性能输入移除旧 diagonal，补统计断言         |
| 修改主例、minimal/grouped/invalid 示例和 examples/specs/index.json                                                | 新最小协议、显式反例及计算元数据                              |
| 新增 variants/pairPlot-histogram.json、pairPlot-none.json、pairPlot-missing-constant.json                         | 显式箱数、关闭、缺失和恒定数据的可审阅案例                    |
| 修改 README.md、docs/spec.md、computation-contract.md、plots/pairPlot.md、skill-authoring.md、naming-migration.md | 默认值、算法、迁移和计算职责                                  |
| 修改 docs/plot-catalog.json、docs/catalog.md、**tests**/fixtures/chart-intents.json                               | 图表选型、配置变体和 skill 命中                               |
| 新增 benchmarks/pair-diagonal-results.json，修改 benchmarks/README.md                                             | 新协议测量记录，历史结果保持来源清晰                          |
| 修改仓库 docs/superpowers/plans/2026-09-29-vchart-statplots.md 的 T12                                             | 标明本计划覆盖预计算 diagonal 的旧决定，保留历史上下文        |

执行时已收敛到同工作区新增的 src/common/histogram.ts：histogramDomain、makeHistogramEdges 和 histogramBinIndex 是共享实现；pairDomain/makePairEdges 为内部导入别名，不复制算法。binning.ts 内部类型不从包入口导出，删除公开类型后检查 src/types.ts 的星号导出生成声明：

```ts
import type { PairPlotObservation } from './types';

export interface PairVariableExtent {
  variable: string;
  sampleSize: number;
  min: number;
  max: number;
}
export interface PairHistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
  series?: string;
}
export interface PairVariableDistribution {
  variable: string;
  domain: [number, number];
  sampleSize: number;
  bins: PairHistogramBin[];
}
export interface PairVariableEdges {
  domain: [number, number];
  edges: number[];
}
export function collectPairExtents(
  observations: readonly PairPlotObservation[],
  variables: readonly string[]
): PairVariableExtent[];
export function makePairEdges(extent: PairVariableExtent, binCount?: number): PairVariableEdges | null;
export function pairDomain(extent: PairVariableExtent): [number, number] | null;
export function preparePairDistributions(
  observations: readonly PairPlotObservation[],
  variables: readonly string[],
  diagonal: { enabled: boolean; binCount?: number }
): PairVariableDistribution[];
```

collectPairExtents 按 variables 顺序返回，N=0 时 min/max 存为 0/1。makePairEdges 只因不可表示返回 null，正常空变量返回 domain=[0,1]/edges=[]；pairDomain 用于 none 和共同域。校验复用域/边界生成函数但不生成计数；编译对有效输入只准备一次完整结果，不在 n² 面板循环里统计。内部非法状态不加逐图元兜底。

额外统计空间 O(V×G×B)，扫描 O(N×V)，计数 O(N×V×log B)，B≤200。不构造整份完整案例观测副本；既有非对角散点物化规模 O(N×V²) 保留，不在这次增加抽样或渲染抽象。

## 任务 1：域与共享分箱引擎

**文件：** 新增 binning.ts、unit/pair-binning.test.ts、fixtures/pair-plot.ts。独立实现上述内部接口，不替换公共协议。

**Consumes / Produces：** PairPlotObservation 与 variables → PairVariableDistribution[]；函数签名采用上文定义。

- [x] 写并运行失败测试，初始因缺少模块失败。用 x=[0,1,2,3,4,null]、binCount=2 锁定 edges=[0,2,4]、counts=[2,3]，验证 2 归右箱、4 不丢失。
- [x] 写分组独立期望：A 的 x=[0,1]，B 的 x=[2,3,4]；两组均为 [0,2,4]，counts 分别 [2,0]/[0,3]。同时 y 的 null 位置与 x 不同，验证逐变量有效数而非整行排除。
- [x] 实现 collectPairExtents、pairDomain、makePairEdges；空变量、恒定变量、默认 Sturges、显式整数箱数和自动重复边界合并按第 2 节规则执行。
- [x] 实现分组 Map 和一次有效值计数扫描。数组只按变量/系列/箱分配；二分查找调用共享 edges，输出每组有序 bins，保留零计数箱。
- [x] 补重复点、负值、大偏移、单点、全缺失、全恒定、同值异 id、深冻结、逆序/固定乱序的统计回归；比较按 series 标识整理后的输出，避免将输入首次出现的分组颜色顺序误当统计契约。
- [x] 锁定 [1,1+Number.EPSILON]：自动重复边界合并后一个箱且 count=2；显式 binCount=2 返回不可表示。锁定 [-Number.MAX_VALUE,Number.MAX_VALUE] 域不可表示；普通 1e12 常量域可表示，不因 c±0.5 固定尺度失效。

失败测试核心内容：

```ts
import { preparePairDistributions } from '../../src/plots/pair-plot/binning';
test('right bin owns internal edges and final bin includes maximum', () => {
  const observations = [0, 1, 2, 3, 4, null].map((x, i) => ({
    id: String(i),
    values: { x, y: i === 0 ? null : i }
  }));
  const [x, y] = preparePairDistributions(observations, ['x', 'y'], {
    enabled: true,
    binCount: 2
  });
  expect(x.sampleSize).toBe(5);
  expect(x.bins).toEqual([
    { binStart: 0, binEnd: 2, count: 2 },
    { binStart: 2, binEnd: 4, count: 3 }
  ]);
  expect(y.sampleSize).toBe(5);
});
```

**Run：** `npm test --prefix packages/vchart-statplots -- --runInBand pair-binning.test.ts`。确认断言统计行为，期望值不调用同一分箱实现生成。

## 任务 2：公共协议与原生编译原子迁移

**文件：** types.ts、validate.ts、compile.ts、Schema 生成物、unit/pair-plot.test.ts、fourth-phase.test.ts、schema.test.ts、现有四份 pairPlot 示例、pair-performance.spec.ts。

**Consumes / Produces：** 任务 1 内部结果；公开 PairPlotSpec → ICommonChartSpec。同一提交候选中迁移全部旧调用，避免类型/Schema/示例暂时互相矛盾。

- [x] 先写新最小 Spec 成功、旧 data.diagonal 拒绝、none+binning 拒绝和非法 binCount 的失败测试；锁定错误 JSON Pointer 和 compile 抛出的 StatPlotValidationError。
- [x] 替换 types，移除公开 PairPlotBin；保留观测唯一性、变量键匹配和 checkSeries，删除 validateHistogram/预分箱逐箱一致性校验。复用任务 1 的域/边界函数作数值边界检查；values 键不正确时不继续依赖那些值计算域。
- [x] 编译开头调用 preparePairDistributions 一次；domain/sampleSize/bins 用 Map 按变量取值。保留 scatter id/panel id/dataKey 和 brushLinkDataKey，不在双面板循环扫描分箱。
- [x] histogram 分支替换 data.diagonal 消费；none 分支不生成 diagonal 系列并保留标题槽位。y 轴计数与 n、Tooltip 中文键名、分组完整图例按第 2 节落地。
- [x] 移除主例、minimal/grouped/invalid 的 data.diagonal；minimal 缩为 2 变量/3 条观测（包含一处 null），主例保留用于真实框选的 id/观测位置。invalid 改为 diagonal.binning.binCount=0，不再复制大份旧分箱数据。
- [x] schema.test.ts 的空数据改为 `{observations:[]}`；fourth-phase 中旧“逐箱 count 错误”用例改成旧输入拒绝，保留相邻 swarm/SHAP 测试。性能输入只移除外部分箱计算，保留原始观测生成算法，便于比较。
- [x] 运行 build:schema 和完整 unit；确认联合分支 additionalProperties:false、默认空 diagonal 通过、binCount 为 integer/1–200。仅 pairPlot 的分图 Schema 和总 Schema 对应类型定义变化。

公共协议核心断言：

```ts
const spec = {
  type: 'pairPlot' as const,
  variables: ['x', 'y'],
  data: {
    observations: [
      { id: '0', values: { x: 0, y: null } },
      { id: '1', values: { x: 2, y: 3 } }
    ]
  }
};
expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
expect(validateStatPlot({ ...spec, data: { ...spec.data, diagonal: [] } }).errors).toEqual(
  expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/data/diagonal' })])
);
expect(validateStatPlot({ ...spec, diagonal: { type: 'none', binning: {} } }).valid).toBe(false);
expect(validateStatPlot({ ...spec, diagonal: { binning: { binCount: 0 } } }).errors).toEqual(
  expect.arrayContaining([expect.objectContaining({ path: '/diagonal/binning/binCount' })])
);
```

**Run：** `npm run build:schema --prefix packages/vchart-statplots`、`npm run compile --prefix packages/vchart-statplots`、`npm test --prefix packages/vchart-statplots -- --runInBand`；修改完成后按当前构建链生成供浏览器使用的 bundle。

## 任务 3：真实渲染、更新与交互验收

**文件：** browser/pair-plot.spec.ts、fixtures/pair-plot.ts、semantics.spec.ts。截图和日志放 `.vchart-statplots/pair-diagonal/`，不提交截图。

**Consumes / Produces：** 新公共 Spec、已构建 bundle、既有测试页 window.renderStatPlot → 实际系列数据/图元/轴/Tooltip/brush 状态断言。

- [x] 写并运行浏览器失败用例：分组两箱的柱边界必须对应原生 xScale 的 0/2/4，同箱不同组共享 x1/x2；柱高度对应实际 count。若原生自动并排缩窄柱，该断言先失败，再使用文档化配置修正。
- [x] 检查实际各面板 x/y scale domains，同变量域一致；逐对缺失后点数为手工期望值，轴上的 n 和 Tooltip 面板有效数一致；不是只比较编译 JSON。
- [x] 真实鼠标悬停已知非零柱，检查箱边界、计数、变量名和系列；添加一条落入该箱的观测，经同实例 updateSpec 后再次 hover，计数从 2 变 3。
- [x] update binCount=2→4，使用 [0,1,2,3,4] 锁定 count=[1,1,1,2]；histogram→none→histogram 真实图元删除/恢复，非对角点数、id 联动与域保持正确。
- [x] 深浅主题、公共配色、初始宽容器、720×540 resize、小数 CSS 尺寸与 DPR 1/2，检查无重叠错位、边界覆盖范围和 count 总和不变。截图审阅变量标题、计数轴、分组图例和空槽位。
- [x] 全缺失变量只留下 n=0 槽位且无柱；恒定变量一个非零柱；某系列只在一个变量有效时仍出现在图例并与相应柱同色；none 没有自变量对自身的点或计数轴。
- [x] 保留 semantics.spec.ts 中真实两次框选及 resize 后按 id 跨面板状态变化断言；释放后 canvas=0。使用正确几何等待策略，不用固定 sleep 掩盖交互生命周期问题。
- [x] 反例检查并恢复：改为整行缺失排除应破坏逐变量计数；各组独立边界应破坏共享箱断言；最后端点遗漏应破坏总数；禁用实际 update 应使新计数 Tooltip 失败；恢复正确实现后重跑。

真实图元读取骨架（继承现有测试页，不建立第二个运行环境）：

```ts
await page.goto('/__tests__/browser/page.html');
await page.evaluate(async spec => {
  await (window as any).renderStatPlot(spec);
}, spec);
const bins = await page.evaluate(() => {
  const series = (window as any).chart
    .getChart()
    .getAllSeries()
    .find((s: any) => s.userId === 'diagonal-0');
  return series
    .getSeriesMark()
    .getGraphics()
    .map((g: any) => ({
      datum: g.context.data[0],
      x: g.attribute.x,
      x1: g.AABBBounds.x1,
      x2: g.AABBBounds.x2
    }));
});
expect(bins.reduce((sum: number, bin: any) => sum + bin.datum.count, 0)).toBe(5);
```

**Run：** 构建完成后串行运行 `npm run test:browser --prefix packages/vchart-statplots -- pair-plot.spec.ts semantics.spec.ts`；不并行清理/生成测试正在加载的构建产物。

## 任务 4：示例、目录与 skill 资料

**文件：** 第 3 节所列中文文档、目录、意图 fixture、示例清单、三个 variants、总计划 T12。

**Consumes / Produces：** 第 1/2 节固定协议 → 人工可读说明及机器可读变体；不产生新公共选项。

- [x] 写 docs/plots/pairPlot.md：两条原始数据示例、缺失/分组规则、默认箱数、显式箱数、none、恒定/全缺失、浮点和计数限制；移除要求用户构造 diagonal/bins/count 的段落。
- [x] README/spec/computation-contract/skill-authoring 将 pairPlot 加入明确的内部计算例外，同步并行 histogram 的原始 value 输入；独立 KDE 仍为外部密度输入。列出默认值与 binCount 范围；说明描述字段不会执行拟合。
- [x] naming-migration 写明 data.diagonal 被移除、PairPlotBin 不再导出；保留原 observations 即可迁移，单独的旧 bins 不能替代原始观测。不保持旧可运行协议。
- [x] 新增三份确定性变体：histogram 使用 [0,1,2,3,4]、binCount=2；none 使用相同原始数据；missing-constant 包含一列全 null、一列常量和一列有缺失变化值。清单全部登记，计算元数据明确由库生成分箱。
- [x] 目录 variants 登记 histogram/none 的配置；missing-constant 作为数据案例进入 valid 清单，不发明公共 missing/constant 选项。沿用现有嵌套配置匹配；若字段深度需要支持，先补 check-catalog/gallery 的目的明确回归再修改标准匹配函数。
- [x] 意图 fixture 补“原始观测查看两两关系”“关闭对角分布”“控制直方图箱数”的预期；保持 28 类目录，不将 histogram 与 pairPlot 混同。
- [x] 总计划 T12 标注本计划覆盖旧 diagonal 预计算要求；历史内容明确标识为已替代，当前文档/示例不能再指向过期输入。

变体 Spec 核心：

```json
{
  "type": "pairPlot",
  "variables": ["x", "y"],
  "diagonal": { "type": "histogram", "binning": { "binCount": 2 } },
  "data": {
    "observations": [
      { "id": "0", "values": { "x": 0, "y": 4 } },
      { "id": "1", "values": { "x": 1, "y": 3 } },
      { "id": "2", "values": { "x": 2, "y": 2 } },
      { "id": "3", "values": { "x": 3, "y": 1 } },
      { "id": "4", "values": { "x": 4, "y": 0 } }
    ]
  }
}
```

**Run：** `npm run check:examples --prefix packages/vchart-statplots`、`npm run check:catalog --prefix packages/vchart-statplots`、`npm run check:schema --prefix packages/vchart-statplots`；rg 搜索 PairPlotBin/data.diagonal/observations+diagonal，只有明确迁移说明、历史覆盖标记和拒绝测试可以保留。

## 任务 5：性能与最终验收

**文件：** pair-performance.spec.ts、benchmarks/pair-diagonal-results.json、benchmarks/README.md、本计划执行结果。

**Consumes / Produces：** 新原始观测协议 → 固定规模生命周期实测与统计守恒；不修改既有历史 benchmark 的测量来源。

- [x] 原有 4/8 变量 × 1k/10k 观测用默认对角计算，记录 compile/render/update/brush/resize/release。补独立 4/8 变量 × 10k 的 preparePairDistributions 时间，分辨统计成本和 n² 散点渲染成本。
- [x] 在性能用例中断言每变量 sum(count)=有效 N、非对角点数正确；update 仅把 id='501' 的 v1 改为 0.1，保持范围锚点和观测数；检查 v1 原所在箱 −1、0.1 所在箱 +1，其余变量箱不变。用未修改的 id='500' 继续真实框选；resize 后箱数据不变、brush 断言至少两个散点面板的真实状态一致，release 后 canvas=0。
- [x] 沿用已有 90s 性能用例超时，不设环境敏感的毫秒阈值。8 变量/10k 仍可能产生 56 万散点，报告不得声称本次对角重构解决了全矩阵的大规模交互成本。
- [x] 将真实测量保存新结果文件，记录环境、样本规模、分组数、有效箱数、warmup 与单次/重复测量方式；和历史结果比较时指出旧数据边界/输入协议的差异。
- [x] 运行全包检查，审阅截图与反例记录。若改了核心，追加相关官方视觉回归并记录真实结果；阻断和预期变化单独列出，不写成通过。
- [x] git diff 自审，只包含本重构相关源码、生成物、示例、测试和文档；不提交 build/esm/cjs、截图或临时日志。本轮执行完成后等待用户明确提交指令。

```sh
export PATH=/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH
CI=true npm run build --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
packages/vchart-statplots/node_modules/.bin/tsc -p packages/vchart-statplots/tsconfig.test.json --noEmit
npm run eslint --prefix packages/vchart-statplots
git diff --check
```

## 完成标准

1. 只提供 variables 与 data.observations 即可绘制；用户不准备分箱，旧 data.diagonal 被明确拒绝。
2. 默认始终直方图；binCount 可选；none 只关闭对角分布，不改变非对角散点语义。
3. 按变量、按组计数守恒，共享边界、端点归属、恒定/缺失/浮点规则均有确定性测试。
4. 原生实际柱边界和共享域正确，真实 hover/update/brush/resize/release 回归通过。
5. 类型、Schema、生成声明、示例、目录、中文文档和 skill 指引一致；除同工作区并行的 histogram 重构外，其余 26 类协议保持不变。
6. 没有渲染/交互热路径分箱；统计成本与全矩阵渲染成本分别记录，测试和基线状态如实说明。

## 调研依据与取舍

- [Seaborn pairplot](https://seaborn.pydata.org/generated/seaborn.pairplot.html) 与 [Pandas scatter_matrix](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.plotting.scatter_matrix.html)：原始观测和对角图形配置分离。本包采用稳定直方图默认值，避免添加 series 后默认变为 KDE。
- [Plotly scatter matrix](https://plotly.com/python/splom/)：支持显式隐藏对角。本包 none 明确为空槽位，不绘制自身对自身的散点。
- [GGally ggpairs](https://ggobi.github.io/ggally/reference/ggpairs.html)：上下三角/对角独立配置更灵活，本期保留未来扩展位置，不引入这整套复杂度。
- [NumPy 分箱](https://numpy.org/doc/stable/reference/generated/numpy.histogram_bin_edges.html)：Sturges 公式及共享边界的参考。选择轻量规则是本期的工程取舍，显式箱数用于用户控制分布分辨率。

执行结果见下方记录；本轮不自动提交或推送。

## 执行结果（2026-10-08）

- 已移除 data.diagonal 与公开 PairPlotBin；默认内部直方图，支持省略 diagonal、显式 binCount、none。生成 Schema/standalone 校验器与声明同步，无兼容分支。
- 共享分箱的域、边界和 upper-bound 查箱已由并行 histogram 任务抽取到 src/common/histogram.ts；pairPlot 复用，不维护第二套算法。对角按变量/系列计数，非对角按变量对排除缺失，原始输入不变。
- 分箱专项 12 项、pairPlot 协议/编译专项 26 项通过；最终全包 20 套 / 383 项单元测试通过（包含同工作区 histogram 重构）。首轮缺少引擎/旧公共类型的新测试先失败，类型补全后修正 Jest 参数化测试的数组展开，统计与协议断言全部通过。
- 全包 Chromium 191 项通过，包含 8 项 pairPlot 专项、既有 id 框选回归和 3 份新变体。核验实际柱区间/高度、共享轴、分组同色及完整图例、真实 hover 更新为 3、四箱 [1,1,1,2]、none 删除/恢复、DPR 1/2 和小数 resize。200 箱使用原生 barMinWidth='0%' 保持真实箱宽，不修改核心。
- 新的最小示例只含两变量/三条观测，invalid 改为 binCount=0 并同步预期路径；目录增加直方图/none 变体、3 条意图，gallery 与目录类型支持递归嵌套选项。28 主例、79 有效变体、28 反例和 81 条意图预期一致。
- 反例在独立 VM 副本或临时浏览器测试注入中完成：整行缺失排除破坏 count=5；遗漏最大端点破坏计数；组独立边界将 A 的 [2,0] 错算为 [1,1]；禁止 update 后 Tooltip 保持 2 而非 3；移除最小柱宽配置使首箱左边界偏移 −0.625 px。全部达到断言失败，注入已恢复，随后正确实现全包通过。
- 独立 4/8 变量 × 10k 统计经一次暖机/十次测量，中位数约 1.10/1.94 ms。4/8 变量 × 1k/10k 原生生命周期全部通过计数守恒、实际更新、resize 不改计数、跨面板真实框选及 release canvas=0。8 变量/10k 仍绘制 56 万散点，update/resize 为秒级，不声称解决矩阵渲染瓶颈。记录在 benchmarks/pair-diagonal-results.json。
- build（ESM/CJS/UMD）、源代码与测试 TypeScript、Schema 一致性、目录/示例、gallery.js 语法、git diff --check 通过。最终 ESLint 0 errors / 556 warnings，未禁用规则。性能记录与计划收尾为文档变更。
- 已审阅 grouped、none、missing/constant、深浅主题和小数尺寸截图。大数值标签的实际边界没有交叉，因此保留既有轴样式，不引入额外格式化规则。
- 为避免同工作区 histogram 任务争用测试端口，全包验收复用原 Playwright 配置，仅使用独立 4199 端口、显式原包 cwd 和独立报告目录；测试清单/阈值/超时不改。覆盖并行 histogram 时未覆盖其业务代码；共享文档已按两个原始输入协议同步。
- 本轮未修改 VChart 核心；运行的是 StatPlots 全包回归，不是官方 develop 全量视觉基线。本次没有创建 PR、提交或推送。创建 PR 前仍须执行 AGENTS.md 的官方全量基线。
- 原始日志、截图、反例与独立配置在 .vchart-statplots/pair-diagonal/，不提交。新计划、新源码、测试和示例保持待提交状态。
