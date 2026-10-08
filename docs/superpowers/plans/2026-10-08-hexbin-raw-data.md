# hexbinPlot 原始散点输入与保形布局重构计划

> **For agentic workers:** 在当前会话按任务顺序实施并复核；未经用户要求不启动子代理。用户已授权执行本计划；不自动提交或推送。

**Goal:** 用户提供原始 x/y 散点和简洁分箱规则，库生成计数及正六边形网格，窗口变化时保持分箱结果和几何形状稳定。

**Architecture:** `原始 Spec → 结构与边界校验 → 固定坐标归一化 → 六边形分箱 → 原生多边形系列 + 专用保形布局`。分箱在编译阶段执行，渲染、resize 和 hover 只消费结果。原生数值轴仍显示原始变量单位，布局约束的是归一化网格的等比例映射。

**Tech Stack:** Node.js 22、TypeScript 4.9.5、VChart Layout/Factory 扩展、现有 PolygonMark、Jest、Playwright、现有 Schema/Ajv 生成链；不新增运行依赖。

## 全局约束与职责调整

- 本计划覆盖总计划 T10 中的预计算顶点输入及“允许非正六边形”决定；其他 27 类图表保持现有计算职责。
- 本轮只支持原始散点输入，旧 id/count/vertices Spec 不再接受，不引入 raw/precomputed 双模式或自动识别。
- 六边形分箱计数明确由本包计算。README、计算契约和 skill 目录资料必须同步这一例外，不能继续声称所有分箱都由调用方完成。
- 不实现 Python runner、权重、sum/mean 聚合、分组、对数轴、显著性、抽样、平滑、缩放交互或通用几何输入。
- 使用公开 Layout/Factory 和现有系列；不操作私有实例字段，不用 render 后 resize 循环，不单独移动顶点来修补形状。
- 所有随机演示改为确定性合成点；不修改调用方数据，不静默删除非法观测，重复坐标作为多条观测计数。
- 在当前 `codex/vchart-statplots` 分支实施；Node.js 22；保持其他图表默认样式和公共配色配置。
- 仅改 StatPlots 的情况下运行全包测试；若实际涉及原生 VChart，补标准路径回归并运行相关官方视觉目录。创建 PR 前仍运行仓库要求的全量官方基线比较。

## 1. 公共 Spec

```json
{
  "type": "hexbinPlot",
  "binning": { "xBins": 30 },
  "data": [
    { "x": 1.2, "y": 3.4 },
    { "x": 1.4, "y": 3.8 }
  ]
}
```

```ts
export interface HexbinPlotRow {
  x: number;
  y: number;
}
export interface HexbinBinningSpec {
  /** 水平方向分箱分辨率；默认 30。
   * @TJS-type integer
   * @minimum 1
   * @maximum 200
   */
  xBins?: number;
}
export interface HexbinPlotSpec extends BaseSpec {
  type: 'hexbinPlot';
  data: HexbinPlotRow[];
  binning?: HexbinBinningSpec;
  fieldLabels?: { x?: string; y?: string; count?: string };
}
```

- `binning`、`binning.xBins` 均可省略，使用 30；明确设置的非法值报错，不四舍五入或钳制。
- xBins 是归一化 x 范围内的格网间隔数，不是总箱数或非空箱数。边缘会有跨越范围的完整六边形，因此实际列数可能多一列。
- 上限 200 用于控制显示分辨率：单位方形内网格数量约为 `0.866 × xBins²`，且只生成非空箱。此上限是公共契约，不在图元热路径中反复检查。
- x/y 必填且有限；拒绝 null、数值字符串、NaN、Infinity 和未知字段。用户数据行不要求 id，不接受 count、vertices、series、weight。
- 保留 theme、colors.sequential、title、description、fieldLabels；不新增 radius、square、cellSize、normalizedAspect 等公共配置。

## 2. 固定分箱坐标空间

### 归一化与数据单位

对每个轴独立求输入最小值 a、最大值 b：非恒定轴采用 origin=a、span=b−a；恒定轴 c 采用 span=max(1, abs(c))、origin=c−span/2。原始值到归一化值的映射为 `(value−origin)/span`，恒定轴的所有观测落在 0.5。

恒定轴的扩展只用于建立可绘制坐标空间，不表示观测具有变异。空数据返回空箱，轴使用 [0,1] 占位，显示现有空状态并隐藏计数色标。

在校验边界拒绝无法以有限数值表示的 span、origin 或完整格网轴范围，以及逆变换后顶点因数值精度不足而塌缩的输入，报告 INVALID_RANGE /data，说明数值范围无法建立有效坐标轴。不要把不可表示结果留到逐图元兜底。数据单位相差很大但计算可表示的正常输入必须通过。数值范围校验仅扫描原始极值和固定格网步长，不调用 binHexagons 计数；采用归一化 [-2R,1+2R] 的安全包络检查逆变换有限性，并检查该范围端点增加/减少 span×R/2 后仍可区分，避免顶点因机器精度塌缩。编译后的实际轴域仍取已生成完整顶点的精确范围，不使用这一校验包络扩张绘图区。

### 格网与归属

采用平顶六边形，六个顶点角度为 `kπ/3`。固定原点 (0,0)，半径 `R=2/(3×xBins)`，水平相邻列中心间距 `1.5R=1/xBins`；轴向格网坐标 (q,s) 的中心为：

```ts
const u = 1.5 * radius * q;
const v = Math.sqrt(3) * radius * (s + q / 2);
const qFloat = (2 * pointU) / (3 * radius);
const sFloat = pointV / (Math.sqrt(3) * radius) - qFloat / 2;
```

对 qFloat、sFloat、tFloat=−qFloat−sFloat 做 cube rounding。使用 Math.round；若三个舍入误差中最大值相等，修正顺序固定 q、s、t。每个点恰好分到一个箱，不按多个边界分别累加，不添加与输入顺序相关的 epsilon。

```ts
let q = Math.round(qFloat);
let s = Math.round(sFloat);
let t = Math.round(-qFloat - sFloat);
const dq = Math.abs(q - qFloat);
const ds = Math.abs(s - sFloat);
const dt = Math.abs(t + qFloat + sFloat);
if (dq >= ds && dq >= dt) q = -s - t;
else if (ds >= dt) s = -q - t;
else t = -q - s;
```

箱 id 为 `q:s`，整数负零统一写作 0。用 Map 累计非空箱，结束后按数值 q、s 排序，输出与输入排列无关。满足 count 为正整数、sum(count)=data.length，不生成零计数箱，不改变每个箱的面积来表达 count。

生成顶点时先在归一化空间构建完整六边形，再逆变换为原始 x/y。原始数据单位不同会使数据坐标边长不同，这是合法映射；验收正六边形必须测量实际显示坐标。

### 保形与 resize

根据已生成的完整顶点求归一化范围 U、V，绘图区宽高比为 `U/V`；两条原始数值轴范围来自逆变换后的完整顶点，nice=false，避免轴自动取整改变比例。

```ts
const factor = Math.max(0, Math.min(availableWidth / normalizedAspect, availableHeight));
const regionWidth = factor * normalizedAspect;
const regionHeight = factor;
```

复用默认 Layout 的标题、色标、轴测量、autoIndent 和底部轴定位，仅约束 region 尺寸。绘图区不固定为正方形；根据真实网格范围保形，剩余空间留在绘图区外。

默认范围来自当前输入，更新 data 可能改变归一化范围及格网归属；首期不承诺不同数据集逐箱对应，也不承诺复刻 Matplotlib 默认分箱结果。规则是本包公开的确定性定义。

resize 不进入分箱函数，不能改变 q/s/id/count 或原始顶点；更新 theme/colors 也不改变统计结果。修改 data 或 xBins 时调用 `compileStatPlot(nextSpec)` 重算；同样 data 和规则必须得到同样结果。

Tooltip 显示 count 及原始单位下的 x/y 范围，范围明确是六边形包围盒，不能解释为矩形分箱的归属条件。计数色标保留现有 viridis/自定义顺序色、0 到最大计数映射及 VChart 原生组件，本轮不另做色条体系。

## 3. 文件与内部接口

以下路径除总计划外均相对 `packages/vchart-statplots`。

| 文件                                                                                              | 责任                                                                            |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 新增 src/plots/hexbin/binning.ts                                                                  | 固定坐标变换、cube rounding、计数、完整顶点及轴范围；纯函数，不依赖 VChart 实例 |
| 修改 src/plots/hexbin/types.ts、validate.ts                                                       | 新公共原始散点协议、分辨率和数值范围边界校验                                    |
| 修改 src/plots/hexbin/compile.ts                                                                  | 编译时分箱；适配内部系列、轴范围、配色、Tooltip 和专用布局                      |
| 新增 src/layout/hexbin.ts，修改 src/register.ts                                                   | 原生 Layout 专用保形扩展及幂等注册                                              |
| 保留 src/series/hexbin/hexbin.ts 的 PolygonMark 路径                                              | 消费内部六个数据顶点；不在 render/hover 中分箱                                  |
| 生成 schema/plots/hexbinPlot.schema.json、schema/statplot.schema.json、src/generated/validate.js  | 通过 build:schema 生成，不手写生成物                                            |
| 新增 `__tests__/unit/hexbin-binning.test.ts`、`__tests__/unit/hexbin.test.ts`                                      | 计数守恒、边界归属、浮点/恒定轴及协议回归                                       |
| 新增 `__tests__/fixtures/hexbin.ts`、`__tests__/browser/hexbin.spec.ts`                           | 确定性散点、实际六边形几何、Tooltip、更新与性能                                 |
| 修改既有 fourth-phase.test.ts、colors.spec.ts、semantics.spec.ts                                  | 移除旧顶点公共输入要求；保留 SHAP 等独立断言，加强真实保形验收                  |
| 修改示例及 README、docs/spec.md、docs/computation-contract.md、docs/plots/hexbinPlot.md、目录资料 | 统一原始输入和本包分箱职责，帮助 skill 生成                                     |

内部结果接口在 binning.ts 定义，不从包入口导出：

```ts
export interface HexbinBin {
  id: string;
  q: number;
  s: number;
  count: number;
  x: number;
  y: number;
  vertices: { x: number; y: number }[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
export interface HexbinResult {
  bins: HexbinBin[];
  xDomain: [number, number];
  yDomain: [number, number];
  normalizedAspect: number;
}
export function binHexagons(points: readonly { x: number; y: number }[], xBins: number): HexbinResult;
```

空结果 normalizedAspect=1，domains=[0,1]。布局的原生内部配置为 `{type:'statplotsHexbin', normalizedAspect:number}`，仅在原生 ILayoutSpec 扩展边界做类型断言，不把整份 chart 转成 any。HexbinLayout.layoutItems 每次从 chart.getSpec().layout 读取最新 normalizedAspect，再调用 super.layoutItems；避免仅在构造时缓存比例导致 updateSpec 后布局失效。

## 任务 1：独立分箱引擎与确定性统计回归

**文件：** 新增 binning.ts、unit/hexbin-binning.test.ts、fixtures/hexbin.ts。暂不替换公共 Spec，因此现有图表仍可编译。

**输入/输出：** `binHexagons(points,xBins): HexbinResult`；按上文固定规则实现，邻接分箱的边界来自同一格网，不计算逐箱独立半径。

- [x] 写并运行失败测试。数据包含 (0,0)、(1,1) 范围锚点；xBins=2 时中心 (0.5,√3/6) 属于 1:0，中心 (0,√3/3) 属于 0:1。重复中心追加三次必须增加同箱计数，而非唯一点计数。
- [x] 边界反例：中心 0:0 与 1:0 的中点 (0.25,√3/12)，中点预期属于 0:0；沿中心连线负/正方向移动该连线向量的 1e−8 倍，分别归属 0:0/1:0。边、顶点和最大值全部只计数一次，不能丢端点；固定浮点运算顺序并登记预期键。
- [x] 实现两遍数据扫描、固定归一化、cube rounding、Map 计数、q/s 数值排序和每箱一次六顶点生成。空间 O(B)，计数 O(N)，输出排序 O(B log B)，不生成整个空格网或每点六顶点。
- [x] 检查空数组、单点、全部重合、单轴恒定、负数、不同单位、原点附近极小但可表示范围及大偏移；归一化后每条观测只有一个箱，原始坐标不被改写。
- [x] 检查逆序/固定乱序相同结果、深冻结输入、sum(count)=N、所有输出有限；六边形顶点经归一化还原后边长相等、内角 120°。非法数值范围由公共边界校验负责，内部函数不重复做逐行宽泛校验。

独立验收示例：

```ts
const points = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 0.5, y: Math.sqrt(3) / 6 }
];
const result = binHexagons(points, 2);
expect(result.bins.find(bin => bin.id === '1:0')?.count).toBe(1);
expect(result.bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(3);
expect(binHexagons(points.slice().reverse(), 2)).toEqual(result);
```

**Run：** `npm test --prefix packages/vchart-statplots -- --runInBand hexbin-binning.test.ts`；从初始缺少引擎的失败到通过；记录真实测试结果后才进入任务 2。

## 任务 2：原始输入协议与端到端保形渲染

**文件：** types.ts、validate.ts、compile.ts、src/layout/hexbin.ts、register.ts、Schema 生成物；新增 unit/hexbin.test.ts、browser/hexbin.spec.ts；迁移三个现有 hexbinPlot 示例及 fourth-phase/semantics/colors 测试。

**接口：** 公共使用 HexbinPlotRow/HexbinBinningSpec/HexbinPlotSpec；compileHexbin 调用任务 1 的 binHexagons，输出原生 chart；HexbinLayout 与 registerHexbinLayout 使用 Layout/Factory。

- [x] 先写协议失败测试：原始点通过，旧 id/count/vertices、未知字段、null/字符串/非有限值拒绝；xBins 省略/1/30/200 通过，0/负数/小数/201 拒绝。错误指向 /binning/xBins 或对应 /data/i/x、/data/i/y；无法表示的数值范围指向 /data。
- [x] 原子替换公共类型、校验和编译器；取消凸多边形/上游 count/id 校验。保留所有重复观测，编译器每次一次调用分箱引擎，不在系列内或 Tooltip 内计算。
- [x] 使用原生完整顶点 PolygonMark 路径和内部 id/count/范围；轴采用 HexbinResult domains，隐藏空数据色标，Tooltip 将 xMin/xMax/yMin/yMax 映射为对应原始变量展示名。公共配色和 theme 沿用现有配置。
- [x] 注册 HexbinLayout，按 normalizedAspect 约束 region；每次布局读取当前原生 spec，空数据比例为 1，超小容器使用非负尺寸。公共 JSON 不暴露布局参数。
- [x] 迁移主例与 minimal 为原始散点，invalid 使用 xBins=0；修改既有旧顶点输入的单元测试，保留相邻 SHAP 重复键断言。已有颜色测试仍检查实际内部 count、实际颜色和原生色标，不改为静态 Spec 对比。
- [x] 运行 build:schema 生成类型对应 Schema/校验器，确认 xBins 为 integer 且 minimum=1、maximum=200；type 仍是 hexbinPlot，其他 27 类 Schema 无语义变化，不手工删校验器分支。
- [x] 初始宽容器、420×360、1000×420、DPR 1/1.25/2、小数 CSS 尺寸 823.5×599.25，读取实际 polygon.points；六边长最大差 <1e−5 CSS px、角余弦与 −0.5 差 <1e−7，相邻非空箱共享边一致。先让旧独立轴拉伸实现失败。
- [x] 同实例 resize 后逐箱 id/count/原始顶点与初始一致；data 更新使 count 按预期改变，xBins=8→30 改变分箱，normalizedAspect 改变后仍保形。切换 theme/colors 不改变归属计数。
- [x] 真实指针悬停箱中心，检查 Tooltip 计数和原始单位范围；保留范围锚点，新增点到已知箱后再次悬停检查新计数。空数据无无效图元、无色标；单点和恒定轴六边形可绘制。

**Run：** Node.js 22 下 `npm run build --prefix packages/vchart-statplots`，随后 `npm test --prefix packages/vchart-statplots -- --runInBand hexbin fourth-phase.test.ts colors.test.ts`、`npm run test:browser --prefix packages/vchart-statplots -- hexbin.spec.ts colors.spec.ts semantics.spec.ts`。每一失败先确认是否真实回归，不能保留旧几何断言而跳过该测试。

## 任务 3：示例、skill 资料及全包验收

**文件：** README.md、docs/spec.md、computation-contract.md、plots/hexbinPlot.md、catalog.md、plot-catalog.json、`__tests__/fixtures/chart-intents.json`、examples/specs/index.json；新增 variants/hexbinPlot-coarse.json、hexbinPlot-fine.json、hexbinPlot-constant.json、hexbinPlot-different-units.json；迁移说明写入逐图文档。

- [x] 主例使用确定性的合成双簇散点，明确合成来源，不声称真实调查或随机统计估计。coarse/fine 使用同一批点且 xBins=8/50；constant 全部同一轴取值；different-units 展示两轴量级不同仍保形。只改变分辨率时两份示例都保留全部观测，计数总和一致。
- [x] 更新示例 valid 清单、计算元数据和目录 variants，修正 hexbin 文档链接为 plots/hexbinPlot.md。主目录选型改为“汇总大量二维散点的局部分布”，删除“只有原始散点”这一禁用条件；新增边界为需要单个观测细节、分类轴或其他聚合统计。
- [x] 同步两条既有 hexbin 意图 fixture 和 skill 资料，保持 28 类目录；说明用户只提供 x/y，xBins 默认 30，count/vertices 内部生成。文档与当前原始点 Spec 一致，不保留旧可运行顶点示例。
- [x] README/Spec/计算契约明确本包承担 hexbin 分箱这一例外，其余图表职责保持不变。记录旧 Spec 迁移：原始观测可迁移；只有旧计数和顶点无法还原散点，不能伪造重复中心来“还原”原始分析数据。
- [x] 增补 10k 和 100k 原始点的 compile/render/update/resize/release 冒烟，固定数据、记录各阶段耗时及非空箱数，不设环境敏感毫秒阈值。update 保持总数守恒；resize 不重建分箱，release 后无 canvas 残留。
- [x] 保存并审阅深浅色、粗细网格、不同单位、恒定轴、宽窄容器和边界箱截图，产物放 .vchart-statplots/hexbin/，不提交构建或截图。区分刻意的 0.5 px 描边与意外错位；不要求消除所有分箱边界。
- [x] 反例检查：恢复独立填满 region 的布局应使正六边形断言失败；故意漏最大值/按唯一点计数应使总数断言失败；禁止实际更新应使 Tooltip 新计数断言失败。恢复正确实现后重跑，不放宽阈值。
- [x] 运行下方最终检查，记录实际结果；若原生 API 出现缺陷，按 AGENTS.md 修正标准路径并增加相应用例。没有核心改动时不为本次重构修改官方 VChart 用例。

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

生成或清理依赖产物的构建与浏览器测试串行执行，避免加载正在写入的 bundle。官方视觉构建若清理了依赖 CJS，先通过该包标准 build 恢复，再运行 StatPlots Jest；不改测试配置绕过缺失产物。

## 完成标准与执行边界

1. 一份原始 x/y JSON 即可生成 hexbinPlot，xBins 省略仍可绘制，用户不准备顶点或计数。
2. 重复点计数、总数守恒、边界不重复或丢失，固定输入/规则和输入排列得到同样结果。
3. 各单位和宽高比下实际图元为正六边形；完整边界、相邻网格、坐标轴与 Tooltip 原始单位一致。
4. resize/配色/主题只改变显示；修改原始点/分辨率才改变分箱结果，无热路径统计计算。
5. Schema、类型、示例、目录、中文文档和旧接口迁移一致；其他 27 类回归正常。
6. 本轮实现已按用户授权完成；保持当前分支，不自动提交、推送、发布或启动子代理。

## 执行结果（2026-10-08）

- 原始散点协议、确定性分箱、边界校验和原生保形布局已完成，无旧 Spec 兼容分支；原 PolygonMark 路径保留。
- 先运行缺少引擎及旧公共类型下的新用例，分别因模块不存在和旧接口类型不符失败；实现后分箱专项 14 项通过，最终单元测试 16 套 / 310 项通过。
- 全包 Chromium 回归 169 项通过，含 8 项 Hexbin 专项及 4 份新变体。实际屏幕边长差小于 1e−5 CSS px，内角余弦误差小于 1e−7，邻箱共享两顶点；resize/主题/配色保留原始箱数据，真实 hover 计数更新为 3。
- 构建、TypeScript（含测试）、Schema 一致性、28 主示例 / 73 有效变体 / 28 反例、28 类目录 / 78 条意图预期、JavaScript 语法与 git diff --check 通过。ESLint 0 errors / 427 warnings，未禁用规则。
- 总 Schema 仅变更 HexbinPlotRow、HexbinPlotSpec 并新增 HexbinBinningSpec；其他 27 份图表 Schema 未改动。
- 粗/细分箱是目录中的配置变体；恒定轴和不同单位是数据案例，登记在 valid 清单而不发明额外公共选项。目录校验和图库识别支持嵌套 binning 选项；既有配色用例直接消费新的内部计数，无需改写。
- 反例检查均按预期失败：独立填满 region 导致角度误差约 0.167；去重使重复点计数 2 变 1；漏最大端点破坏总数守恒；禁止 updateSpec 后真实 tooltip 应为 3 却显示 2。反例修改已全部恢复，再跑完整回归通过。
- 额外检查安全包络跨度的有限性，防止两端坐标均有限但 max−min 溢出的轴域；错误仍在公共边界报告 INVALID_RANGE /data。
- 已审阅主例、粗细分箱、不同单位、恒定轴、深浅主题、宽窄窗口和小数 DPR 截图。报告、反例日志、截图位于 .vchart-statplots/hexbin/，不提交；性能记录保存到 packages/vchart-statplots/benchmarks/hexbin-results.json。
- 本轮未改 VChart 核心；运行的是 StatPlots 全包回归，未将其称为官方 develop 全量视觉基线比较。本次未创建 PR、提交或推送。
