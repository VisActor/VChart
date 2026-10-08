# correlationMatrix 视觉优化实施计划

**Goal:** 将相关矩阵改为正方形、紧凑、易于比较的统计矩阵，使用明确表达正负方向及零点的静态色条。

**Architecture:** 保留两个原生 heatmap 系列，分别绘制有效相关系数和 null。通过 VChart 导出的 Layout、Factory 注册专用正方形布局；色条使用原生 customMark，在布局预留的区域内绘制，与单元格共用同一份连续色标。公共 StatPlots Spec 不变。

**Tech Stack:** TypeScript、VChart 2.1.7、Jest、Playwright、Node.js 22；不新增依赖。

## 范围和决策

- 已获用户授权在当前分支执行；随后按用户授权整理并提交，不推送。
- 只调整 correlationMatrix，不修改共享 categoryAxis、commonChart 或其他矩阵的默认外观。
- 保留完整对称输入、variableOrder、method、triangle、fieldLabels 和公共 colors。
- triangle 默认仍为 full；lower/upper 仍包含对角线，不为了匹配 Python 示例改变语义。
- 保留 RdBu_r 默认色板和固定 [-1, 1] domain。正值红、负值蓝、零点浅色；自定义色板遵循相同数值方向。
- null 保留主题适配的灰格和 NA，不替换为零，不参与连续颜色映射。
- 不新增 square、gap、cellSize、colorbar 公共字段；skill 继续生成现有语义 Spec。
- 不添加统计计算、聚类、变量重排、显著性标记或新主题；不处理图库与图表标题重复。
- 使用标准布局、图元和生命周期契约，不使用 DOM 色条、Canvas 覆盖绘制、render 后 resize 循环或私有图例节点查找。

### 根因及方案取舍

当前 compile.ts 沿用 band 默认 padding，造成与图宽成比例的间隙和更大的外围留白。原生 heatmap 分别按 x/y bandwidth 计算尺寸，宽容器因此产生矩形。slidable=false 仅禁止拖动，handler 默认仍可见；IContinuousLegendSpec 支持 handler.visible 和 inverse，但没有任意中间刻度配置。

| 方案                                          | 收益                                                               | 限制                   | 决策       |
| --------------------------------------------- | ------------------------------------------------------------------ | ---------------------- | ---------- |
| 仅改 padding，隐藏图例手柄                    | 修改最少                                                           | 仍会拉伸，缺少中间刻度 | 不满足目标 |
| 原生 heatmap + 专用布局 + customMark 静态色条 | 保留轴、Tooltip 和更新，无公共 Spec 改动（执行中另修原生尺寸缺陷） | 需补布局和色条渲染回归 | 推荐       |
| 重写矩阵系列或核心 heatmap                    | 集中管理全部图元                                                   | 扩大维护和回归范围     | 当前不采用 |

静态色条是 customMark 标准装饰图元用法；只维护一条实现，不同时保留另一条隐藏连续图例。若执行中发现标准 API 的真实缺陷，修正标准路径并补回归，不叠加兜底。

### 目标外观

| 项目     | 行为                                                                                      |
| -------- | ----------------------------------------------------------------------------------------- |
| 矩阵几何 | 扣除标题、轴标签、色条占位后取最大正方形；单元格等宽等高                                  |
| 定位     | 复用默认矩阵起点；底部轴紧贴矩阵；剩余空间在矩阵外侧，不作为格子间距                      |
| 色条占位 | 矩阵右侧预留 96 CSS px，色条距矩阵 16 px，色条宽 12 px                                    |
| 色条高度 | 矩阵边长的 60%，标题占位 24 px；整组沿矩阵垂直居中，不超过矩阵高度                        |
| 格子间距 | paddingInner=0、paddingOuter=0；主题背景色的 1 CSS px 单元格描边                          |
| 轴       | x 在底部、y 从上向下，顺序一致；隐藏轴线、刻度线及网格，保留变量名及非空 fieldLabels 标题 |
| 数值     | 两位小数、原生 smartInvert；密集时原生避让隐藏重叠文字，不删单元格                        |
| 色条方向 | 顶端 +1、底端 −1、零点居中；固定五刻度 −1、−0.5、0、0.5、1                                |
| 方法名称 | Pearson r、Spearman ρ、Kendall τ                                                          |
| NA       | 灰格及 NA，表示无法计算，不能读成弱相关                                                   |
| 空数据   | 保留现有空数据说明，隐藏色条，不产生无效尺寸                                              |

描边是有意的单元格边界；像素验收需区分边界抗锯齿与意外背景缝，不照搬 missingValueMatrix 的无横线标准。正方形缩小产生的外部留白是正确结果，不应再拉伸矩阵填满容器。

参考：[Seaborn 相关矩阵官方示例](https://seaborn.pydata.org/examples/many_pairwise_correlations.html) 使用 square=True、细分隔线和缩短色条；[heatmap 文档](https://seaborn.pydata.org/generated/seaborn.heatmap.html) 明确 square 默认 false、缺失值自动遮罩。本计划借鉴阅读方式，保留本包 NA 和三角语义，不声称复刻 Python 的统一默认样式。

## 任务 1：正方形布局和紧凑单元格

**文件：** 新增 `src/layout/correlation-matrix.ts`、`__tests__/unit/correlation-matrix.test.ts`、`__tests__/browser/correlation-matrix.spec.ts`；修改 `src/register.ts`、`src/plots/correlation-matrix/compile.ts`。以上路径均相对 packages/vchart-statplots。

**接口：** compileCorrelationMatrix 保留现有 CorrelationMatrixSpec 输入及原生 common chart 输出。新增 CorrelationMatrixLayout、registerCorrelationMatrixLayout，由 registerStatPlots 调用。类型断言只放在原生 layout.type 扩展边界，不把整份 chart 转成 any。

- [x] 通过现有浏览器 page.html 渲染 5×5 完整矩阵及 3×3 主例，检查实际 region 和 cell 等宽等高及完整 domain；先确认旧宽矩形实现失败。
- [x] 只覆盖导出 Layout 的 region 尺寸计算，复用标题、轴测量、autoIndent、底部轴定位，不重写 layoutItems。初始实现如下，随后通过长标签和 resize 检查契约：

```ts
import { Layout, Factory } from '@visactor/vchart';
import type { ILayoutItem } from '@visactor/vchart';

export const CORRELATION_COLORBAR_SPACE = 96;
export class CorrelationMatrixLayout extends Layout {
  static type = 'statplotsCorrelationMatrix';
  protected _layoutRegionItem(regions: ILayoutItem[], width: number, height: number) {
    const side = Math.max(0, Math.min(width - CORRELATION_COLORBAR_SPACE, height));
    return super._layoutRegionItem(regions, side, side);
  }
}
export function registerCorrelationMatrixLayout(): void {
  Factory.registerLayout(CorrelationMatrixLayout.type, CorrelationMatrixLayout);
}
```

- [x] 编译器指定专用 layout；两轴覆盖 paddingInner/Outer=0，domainLine/tick/grid.visible=false，label.autoLimit/autoHide=true。空标题不占位，有效 fieldLabels 标题保留。
- [x] 保留两系列主题背景色描边、线宽 1、smartInvert 和 Tooltip；通过原生 label.overlap 配置避让密集文字，不增加按行数硬编码阈值。文字 boundsPadding=0，按完整边界计算，并设置 overlapPadding=4；浏览器断言可见文字之间至少保留 2 CSS px 空隙。
- [x] 检查 light/dark × 800×600/420×360/1000×420，覆盖 full/lower/upper；遮罩后的空白仍占完整矩阵坐标，不压缩 domain。
- [x] 裸几何宽高差小于 1e-5 CSS px，测 graphic.attribute，不把含描边 AABB 当裸边界；截图确认底部轴紧贴矩阵且无额外 band 外侧留白。

**验收：** 宽容器中矩阵仍正方形；有效值和 NA 共用网格，顺序、配色和遮罩含义不变。

## 任务 2：共享映射的静态完整色条

**文件：** 新增 `src/plots/correlation-matrix/colorbar.ts`；修改上述编译器、注册和测试。

**接口：** createCorrelationColorBar(spec, scale) 返回 ICustomMarkGroupSpec；scale 类型为 ReturnType<typeof continuousColorScale>。图元回调读取 context.chart.getAllRegions()[0] 的最终起点和尺寸；本图一个 region 是内部契约，无逐图元兜底。

- [x] 先断言画布上没有色标手柄、有五个真实刻度，+1 高于 0 高于 −1；旧图例没有五刻度且包含手柄，与目标不符。
- [x] 编译时只生成一次 continuousColorScale(spec, 'diverging', 'correlation', -1, 1)，同时供 chart.scales 和色条使用；移除旧连续图例。
- [x] customMark group 包含一个渐变 rect、五个短线、五个文字和一个标题；registerCustomMark 确保按需注册。装饰不可交互，不阻挡 Tooltip。
- [x] 渐变停靠点来自相同 domain/range，不重复写 RdBu_r 色号，不按当前数据范围归一化：

```ts
const stops = scale.range.map((color, i) => ({
  offset: (scale.domain[i] + 1) / 2,
  color
}));
const gradient = {
  gradient: 'linear' as const,
  x0: 0,
  y0: 1,
  x1: 0,
  y1: 0,
  stops
};
const ticks = [-1, -0.5, 0, 0.5, 1];
const tickY = (value: number, top: number, height: number) => top + ((1 - value) / 2) * height;
```

- [x] 色条 x=region.x+region.width+16，宽 12，短线长 4，文字间隔 6。高度为 min(region.height×0.6, max(0, region.height−24))，整组居中；文字使用主题 primaryFontColor。空数据不生成色条。
- [x] 420×360 及以上验收尺寸显示五刻度；超小容器不承诺全部文字可读，但无负尺寸、NaN、溢出布局循环。不为超小尺寸放宽正常标准。
- [x] 默认及自定义三色/五色数组，在 +0.5、0、−0.5 比较色条和相同系数格子的真实像素，避开描边/文字，最多 2 个 RGB 量化级误差。
- [x] resize、主题、colors 更新后位置尺寸颜色同步，无旧色条残留；装饰固定 12 个，不随 n² 增长。

**验收：** 色条方向、零点、方法名称明确，无手柄，颜色与单元格一致。

## 任务 3：语义、密集标注及生命周期回归

**文件：** 补强两份 correlation-matrix 测试，保留已有 interval-matrix.test.ts、colors.test.ts。

**接口：** 不改公共类型、Schema、校验器或计算；使用有效完整对称输入，不固化只有三角数据的非标准输入。

- [x] 确定性 5×5 fixture 覆盖正值、负值、零、常量列，专用于显示契约，不宣称为估计结果：

```ts
const names = ['A', 'B', 'C', 'D', '常量'];
const coefficients = [
  [1, 0.5, -0.5, 0, null],
  [0.5, 1, 0, -0.5, null],
  [-0.5, 0, 1, 0.5, null],
  [0, -0.5, 0.5, 1, null],
  [null, null, null, null, null]
];
const data = names.flatMap((row, r) =>
  names.map((column, c) => ({
    row,
    column,
    correlation: coefficients[r][c]
  }))
);
```

- [x] full/lower/upper 格子数分别 25/15/15（含 NA）；对角位置正确，常量对角仍 null；反向 variableOrder 后两轴共同反序，遮罩成立。
- [x] 小矩阵显示两位小数及 NA；30×30 密集矩阵可见数值不重叠，900 个 cell 不变。轴避让不得减少 cell 或色条刻度。
- [x] 真实鼠标悬停有效值和 NA，断言 Tooltip 的行、列、方法与系数/缺失语义，不只调用内容函数。
- [x] 覆盖单变量有效值/NA、全 null、空数据、长中文变量名、非空 fieldLabels 标题及 description；全 null 仍有格子及完整色条，不误判为空数据。
- [x] 同实例 full→lower→upper、5→30→5 个变量、light→dark、自定义 colors、resize 后重复检查；release 无残留。
- [x] 100×100 确定性对称数据做 10k cell render/update/resize/release 冒烟，记录耗时但无环境敏感毫秒阈值；装饰数量为常量。

**验收：** 统计含义、数据完整性及真实更新正常，小矩阵数值可读，密集时自动避让。

## 任务 4：示例、文档及最终检查

**文件：** 修改 `docs/plots/correlationMatrix.md` 和 `examples/specs/index.json`；保留现有 `examples/specs/correlationMatrix.json` 作为 NA 下三角主例，新增 `examples/specs/variants/correlationMatrix-upper.json` 和 `correlationMatrix-signed.json`；在本文登记结果。

- [x] signed 变体使用上述确定性显示 fixture，标题/description 明示合成数据，展示正负零。不得称为真实统计估计。最小示例继续简洁。两份变体登记到 index.json 的 valid 清单并在逐图文档链接，用户可复制到现有图库编辑器预览；不额外开发图库变体切换功能。
- [x] 文档解释正方形及外部留白、细描边、固定色标、自定义配色方向、NA、对角线、三角语义和密集时文字减少不丢数据；给现有 Spec 示例，不加入未实现字段。
- [x] Node.js 22 下从仓库根目录运行：

```sh
CI=true npm run build --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand correlation-matrix.test.ts interval-matrix.test.ts colors.test.ts
npm run test:browser --prefix packages/vchart-statplots -- correlation-matrix.spec.ts
npm run check:examples --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
packages/vchart-statplots/node_modules/.bin/tsc -p packages/vchart-statplots/tsconfig.test.json --noEmit
npm run eslint --prefix packages/vchart-statplots
git diff --check
```

- [x] 保存并审阅 light/dark × full/lower/upper、宽/窄容器、密集数据、自定义配色和 NA 截图；产物放 `.vchart-statplots/correlation-matrix/`，不提交构建或截图。
- [x] 像素至少覆盖 DPR 1、1.25、2，以及 823.5×599.25 小数 CSS 尺寸；几何、像素、视觉结果分别记录，不能互相替代。
- [x] 反例：恢复 band padding、移除专用布局、反转色条停靠点，各自必须使对应断言失败；恢复后重跑，不扩大像素容差掩盖色标不一致。
- [x] 运行 StatPlots 全套浏览器测试，确认缺失矩阵、图库及其他统计图未回退。若改核心，补显式清单的官方视觉用例并跑相关目录；创建 PR 前按 AGENTS.md 全量比较 develop。基线不支持或执行错误如实记录，不报告成通过。
- [x] 完成后展示截图和实际结果；提交/推送按届时用户授权，不自动执行。

## 完成标准

1. 现有合法 Spec 原样可用，公共类型和 Schema 不新增布局字段。
2. 矩阵正方形、零 band 间距、细边界，两系列网格一致。
3. 静态五刻度色条，正值在上、零点居中、方法明确，无手柄，与公共配色同步。
4. 深浅色、尺寸/DPR、三角、密集标签、更新及 Tooltip 均有实际渲染证据。
5. 改动聚焦相关矩阵及专用内部扩展，另修复验证中暴露的原生尺寸缓存缺陷；不重新计算数据或增加 Spec 复杂度。

## 执行记录（2026-10-08）

### 实现与必要的计划调整

- 已实现专用正方形布局、零 band 间距、五刻度静态色条及密集标签避让；公共 Spec、Schema、默认色板、数值和 NA 语义保持不变。
- 新增上三角及正负零合成示例；同步中文说明、示例清单和原有配色/语义浏览器测试，使其检查真实静态色条。
- 真实悬停测试暴露原生 VChart 的尺寸缓存缺陷：手动 resize 后添加 customMark 触发 updateSpec 重建，chart 使用旧 `_currentSize`，stage 保留新尺寸，导致布局和实际画布不一致。修复 `_beforeResize` 保存当前宽高，增加两个核心单元测试，并补强已登记的 `update-resize` 视觉用例。新增显式 Spec 尺寸仍可覆盖手动尺寸。
- 密集截图复核发现原生标签默认负 boundsPadding 会缩小文字边界。相关矩阵显式使用完整边界和 4 px 避让距离，真实文字边界至少间隔 2 px；未添加按变量数硬编码阈值。

### 验证结果

| 检查                                             | 结果                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| StatPlots 构建、源码和测试 TypeScript 检查       | 通过                                                                  |
| StatPlots 全部单元测试                           | 14 个测试文件，271 项通过                                             |
| VChart resize 重建及既有 update-effects 单元测试 | 2 个测试文件，110 项通过                                              |
| 相关矩阵、配色、语义浏览器测试                   | 26 项通过                                                             |
| StatPlots 全套浏览器测试                         | 157/157 通过（包含 9 项新增相关矩阵浏览器测试）                       |
| 示例、Schema、目录                               | 28 主例、69 变体通过；28 非法示例按预期拒绝；78 条意图预期通过        |
| StatPlots ESLint                                 | 0 errors，402 warnings（现有规则中的 any / 非空断言等告警未另行清理） |
| VChart 修改文件 ESLint、源码编译                 | 通过                                                                  |
| `git diff --check`                               | 通过                                                                  |

几何直接检查实际 graphic 属性及完整离散 domain；五刻度、方法文字、位置和装饰数量取自真实图元。颜色读取 Canvas 像素，覆盖 DPR 1、1.25、2，小数 CSS 尺寸 823.5×599.25、深浅色和默认/三色/五色配色，色条与格子误差不超过 2 个 RGB 量化级。真实指针验证有效值及 NA Tooltip。已审阅主例、上下三角、深浅色、宽窄容器、长标签、密集数据及小数 DPR 截图，产物在 `.vchart-statplots/correlation-matrix/`。

10k 单元格在本机 Node 22 / Chromium 冒烟中 render 约 162 ms、update 约 135 ms、resize 约 138 ms、release 约 3 ms；数据始终为 10000 格，色条装饰恒为 12 个。记录仅用于本次观察，不作为跨环境性能阈值，详细数据见该目录的 `lifecycle-timing.json`。

反例检查均通过：恢复 band padding、移除专用布局、反转色条方向分别超出正常几何/像素验收容差；原生 update-resize 用例在不执行真实操作时拒绝验证，执行真实更新、resize 和重建后通过。最初宽矩形实现及旧原生尺寸状态分别被新增几何和核心单元测试识别。

### 官方视觉回归及限制

- 与官方 develop（`d169be9f3d63ed1e998dead9711dac5fb5af91fc`）比较 layout 目录：2/2 通过。[报告](../../../.vchart-visual/runs/1791432695843-0991c862/index.html)。
- API 目录与官方基线比较：baseline 的 `update-resize` 真实状态断言复现旧尺寸缺陷，工具中止 current 阶段，其他 9 项 current 未运行。该次结果为 error，不能报告通过。[报告](../../../.vchart-visual/runs/1791432550064-70f9c094/agent-summary.md)。
- 当前 API 目录自比较：10/10 通过，仅证明当前实现稳定，不替代官方基线比较。[报告](../../../.vchart-visual/runs/1791432625386-0b8a0c46/index.html)。
- `update-resize` 当前实现连续 5 次自比较通过。[最后一次报告](../../../.vchart-visual/runs/1791432997365-c4fd5328/index.html)。
- 未执行 259 项全量基线比较；创建 PR 前仍须按 AGENTS.md 运行并记录旧基线断言限制。用户随后授权整理并提交；核心尺寸修复与相关矩阵优化分别提交，未推送。
