# confusionMatrix 样式优化实施计划

> **For agentic workers:** 按任务顺序在当前会话执行；使用 `- [x]` 跟踪完成情况。用户已授权执行，2026-10-09 完成本地实现与验证；提交和发布仍按用户后续要求执行。

**Goal:** confusionMatrix 与 correlationMatrix 共用方形矩阵布局、紧密网格和静态色条，保留各自统计含义。

**Architecture:** 从相关矩阵提取私有 MatrixLayout、matrixAxis 和 createMatrixColorBar；两种矩阵都通过同一套显示工具编译为原生 heatmap。计数、归一化和相关系数数据处理不进入显示工具。

**Tech Stack:** TypeScript、VChart Layout / heatmap / customMark、Jest、Playwright；Node.js 22。

## 全局约束

- 输入继续是 `data: [{actual, predicted}]`；不新增样式开关，不修改公共类型、Schema 或归一化算法。
- x 为预测类别，y 为实际类别；两轴使用相同 classOrder，y 从上到下排列。未出现组合为 0，零分母为 null / NA。
- 混淆矩阵继续使用 sequential 色板；相关矩阵继续使用 diverging 色板及固定 [-1, 1] 范围。
- 只提取两种矩阵确实共用的显示逻辑，不改造 missingValueMatrix、hexbinPlot 或 VChart 核心。
- 不创建局部比例尺插值、手动 resize 监听、per-cell 尺寸兜底或 label 重建逻辑；通过原生 Layout、scale 和 label overlap 完成。
- 当前已有未提交的原始输入重构与 ROC 示例调整，不回退或混入新的提交。提交仅在用户要求后执行。

## 1. 最终显示契约

### 网格与坐标轴

- region 为正方形，标题、轴标签、轴标题和右侧色条占位完成后再确定边长；宽容器多出的空间留在矩阵外侧。
- band 轴 `paddingInner: 0`、`paddingOuter: 0`；各单元格边长为 region 边长 / 类别数。
- 有效值和 NA 两个 heatmap 共用轴、region 和尺寸；以主题背景色的 1 CSS px 边界分隔。
- 隐藏轴线、刻度短线及网格；保留类别标签。
- 混淆矩阵保留“预测类别”和“实际类别”轴标题，支持现有 fieldLabels；相关矩阵继续按现有规则显示可选轴标题。
- 小矩阵显示全部数值；密集矩阵通过原生 overlap / autoHide 避让文字，数据格和 Tooltip 不删除。

### 数值和色条

| 情形 | 单元格文字 | 色标范围 | 色条标题 | 刻度 |
| --- | --- | --- | --- | --- |
| normalization=none | 整数计数 | [0, max(1, 最大单元格计数)] | fieldLabels.count 或“计数” | 最多 5 个、不重复的整数 |
| actual / predicted / all | 一位小数百分比 | 固定 [0, 1] | fieldLabels.proportion 或“比例” | 0%、25%、50%、75%、100% |
| 零分母 | NA，灰底 | 不参与颜色映射 | 同当前模式 | 不将 NA 表示成 0 |
| correlationMatrix | 两位小数或 NA | 固定 [-1, 1] | Pearson r / Spearman ρ / Kendall τ | 沿用 -1、-0.5、0、0.5、1 |

- 色条静态不可筛选、不可拖动，无滑块端点；最大值在上、最小值在下。
- 轨道宽 12 CSS px，标题占 24 CSS px，右侧空间沿用 96 CSS px，位置与高度跟随最终 region；色条和单元格使用同一个 scale 的 domain / range。
- 归一化百分比只改变显示文字，scale 仍使用 0～1 数值。
- 计数刻度生成规则：`step = Math.max(1, Math.ceil(max / 4))`，取小于 max 的 `0, step, 2*step, ...`，最后追加 max。max=1 时仅 0、1；max=10 时为 0、3、6、9、10。不新增“漂亮刻度”算法。
- 空 data 保留“暂无可绘制数据”，不生成色条或伪计数矩阵。
- Tooltip 继续给出实际类别、预测类别、原始 count 及归一化结果；各归一化分母在中文文档和示例描述中说明。

## 2. 文件与私有接口

以下路径相对 `packages/vchart-statplots/`。

| 文件 | 操作与职责 |
| --- | --- |
| src/layout/matrix.ts | 从 layout/correlation-matrix.ts 迁移方形布局及色条占位常量，注册私有 MatrixLayout |
| src/common/axes.ts | 新增 matrixAxis，统一两种矩阵的 band 轴显示契约 |
| src/common/matrix-colorbar.ts | 从 plots/correlation-matrix/colorbar.ts 提取通用静态色条，只接收 scale、标题、刻度和命名前缀 |
| src/plots/correlation-matrix/compile.ts | 接入共用布局、轴和色条，保留现有数据与显示语义 |
| src/plots/confusion-matrix/compile.ts | 接入共用布局、轴和色条，统一有效格与 NA 格的边界和标签避让 |
| src/register.ts | 将 registerCorrelationMatrixLayout 收敛为 registerMatrixLayout，继续统一注册 customMark |
| src/layout/correlation-matrix.ts、src/plots/correlation-matrix/colorbar.ts | 迁移完成后删除，不保留重复实现或内部兼容别名 |
| __tests__/unit/matrix-display.test.ts | 新增两种矩阵的显示编译契约测试 |
| __tests__/unit/correlation-matrix.test.ts | 保留现有系数、三角、NA、自定义色板及空态断言 |
| __tests__/browser/confusion-matrix.spec.ts | 新增真实单元格几何、色条、Tooltip 与生命周期测试 |
| __tests__/browser/correlation-matrix.spec.ts、colors.spec.ts | 共用工具重构回归；颜色测试同时读取两种矩阵的静态 customMark 色条 |
| __tests__/browser/semantics.spec.ts、raw-input.spec.ts | 回归现有真实 Tooltip、计算结果与更新检查 |
| examples/specs/confusionMatrix.json | 三类完整主示例，不再把空类别作为首屏内容 |
| examples/specs/variants/confusionMatrix-actual.json | 保留当前 classOrder 额外类别与 NA 场景 |
| examples/specs/index.json、docs/plot-catalog.json | 显式登记、准确描述已有主例和变体的验证目的 |
| docs/plots/confusionMatrix.md、docs/plots/correlationMatrix.md、docs/validation.md | 显示契约、共用布局说明及实际验收结果 |

建议接口：

```ts
// src/layout/matrix.ts
export const MATRIX_COLORBAR_SPACE = 96;
export class MatrixLayout extends Layout {
  static type = 'statplotsMatrix';
  protected _layoutRegionItem(regions: ILayoutItem[], width: number, height: number) {
    const side = Math.max(0, Math.min(width - MATRIX_COLORBAR_SPACE, height));
    return super._layoutRegionItem(regions, side, side);
  }
}
export function registerMatrixLayout(): void;

// src/common/axes.ts：基于现有 categoryAxis 设置零 band 间距和矩阵轴样式。
export function matrixAxis(
  orient: 'bottom' | 'left', title: string, domain: string[]
): ICartesianAxisSpec;

// src/common/matrix-colorbar.ts
export interface MatrixColorBarOptions {
  name: 'correlation-colorbar' | 'confusion-colorbar';
  title: string;
  ticks: readonly number[];
  formatTick: (value: number) => string;
}
export function createMatrixColorBar(
  spec: BaseSpec,
  scale: ReturnType<typeof continuousColorScale>,
  options: MatrixColorBarOptions
): ICustomMarkGroupSpec;
```

通用色条的数学关系：`min = scale.domain[0]`，`max = scale.domain[last]`；颜色停靠点 offset=`(domain[i]-min)/(max-min)`，刻度 y=`24+(max-value)/(max-min)*barHeight`。背景渐变沿用 `y0: 1, y1: 0`，不用相关系数专属的 `(value+1)/2`。

相关矩阵调用方传入原有标题、5 个刻度及负号格式，保留 `correlation-colorbar-*` mark 名称，现有浏览器断言继续检查同一套实际图元。混淆矩阵使用 `confusion-colorbar-*`。私有工具不从 spec.type 推测统计语义。

## 3. 执行任务

### Task 1：提取共用显示工具，保证相关矩阵无回归

- [x] 在 `matrix-display.test.ts` 中加入显示边界断言，先确认当前实现没有共用布局：

```ts
const native = compileStatPlot(correlationExample);
expect(native.layout).toEqual({ type: 'statplotsMatrix' });
for (const axis of native.axes!) {
  expect(axis).toMatchObject({
    paddingInner: 0, paddingOuter: 0,
    domainLine: { visible: false }, tick: { visible: false }
  });
}
```

- [x] 实现上述三个私有接口；从原色条保留 region 测量、主题字体、12 px 轨道、24 px 标题和动态位置。长色条标题使用原生文本宽度限制及省略，不扩大矩阵占位或增加二次布局。
- [x] 更新 correlation compile 和 register，删除迁移后的旧私有文件。
- [x] 运行相关矩阵单元及浏览器测试；检查 full/lower/upper、主题、自定义色板、常量 NA、空态及 resize。有效显示与重构前一致，不能用修改预期图形来掩盖回归。

### Task 2：混淆矩阵接入共用显示契约

- [x] 在单元测试中覆盖 none / actual / predicted / all 四种模式：原 count 与 value 不变；正常值、零值、零分母 NA 分层正确；布局一致、轴标题正确、色标端点正确。

```ts
const native = compileStatPlot({
  type: 'confusionMatrix', normalization: 'actual', classOrder: ['A', 'B'],
  data: [{ actual: 'A', predicted: 'A' }]
});
expect(native.layout).toEqual({ type: 'statplotsMatrix' });
expect((native.series![1] as any).data.values.map((r: any) => r.value)).toEqual([null, null]);
expect((native.series![0] as any).data.values.map((r: any) => r.value)).toEqual([1, 0]);
expect(native.customMark).toHaveLength(1);
```

- [x] 有效值和 NA 两层都增加主题背景色的 1 px stroke，接入共用 matrixAxis / MatrixLayout。
- [x] 标签沿用相关矩阵 fontSize=11、boundsPadding=0、smartInvert 及 overlap 规则；计数整数、比例一位小数百分比、NA 保持独立格式。
- [x] 以 createMatrixColorBar 替代原 colorLegend；非空时生成，空态不生成。编译结果显式关闭原 legends，避免 updateSpec 合并遗留旧图例。
- [x] 按上文规则生成整数或比例刻度；count/proportion 自定义 fieldLabels 同时进入色条与 Tooltip。
- [x] 更新 colors.spec.ts 的色条读取方式，检查静态轨道 stops 与单元格 scale 一致；其余使用原生 colorLegend 的图表继续走原路径。

### Task 3：主示例与中文文档

- [x] 主例继续 `normalization: "actual"`，类别顺序 A、B、C。提供 30 条原始观测，各实际类别 10 条；计数分布如下，生成完整 JSON，不把计数表作为公共输入：

| 实际 / 预测 | A | B | C |
| --- | --- | --- | --- |
| A | 8 | 1 | 1 |
| B | 2 | 7 | 1 |
| C | 1 | 2 | 7 |

```ts
const classes = ['A', 'B', 'C'];
const counts = [[8, 1, 1], [2, 7, 1], [1, 2, 7]];
const data = counts.flatMap((row, i) => row.flatMap((count, j) =>
  Array.from({ length: count }, () => ({ actual: classes[i], predicted: classes[j] }))
));
```

- [x] 主例描述明确“按实际类别归一化，每行合计 100%”；保留当前 actual 变体中的无实际 C 样本与 NA，用于零分母回归。
- [x] 在现有示例 manifest / catalog 中确认该变体已登记并写明验证目的；不添加同义重复示例，不为独立用例填写 BugServer ID。
- [x] 中文文档说明方形格、静态色条、四种归一化分母、NA 与零的区别、空态和密集标签避让；相关矩阵文档说明共用显示工具，统计语义不变。
- [x] `docs/validation.md` 只在完成验证后写实际命令、结果、截图位置及阻断，不能预先填写通过。

### Task 4：真实图元、更新和视觉回归

- [x] 新浏览器用例进入既有 Playwright `*.spec.ts` 执行清单；使用固定样本，读取实际 heatmap graphics 与 region，不用编译配置代替显示验证。
- [x] 检查 2×2、3×3 和 20×20；800×600、1200×600、420×360；light/dark。断言 region.width≈height、每格 size[0]≈size[1]、相邻格中心间距等于格边长，两层总格数保持 K²。
- [x] 色条刻度按 y 排序时从大到小，0 在底部；所有 stops 与实际 scale 一致。计数 max=1/3/10、全零声明类别、归一化 NA、自定义 sequential 色板均覆盖。
- [x] 密集矩阵可隐藏文字，但实际格数不减少；通过真实 hover 查看单元格 count / 比例 / NA，检查字体对比度和轴标签避让。
- [x] 同一个 chart 执行 normalization 切换、classOrder 反转、主题更新、非空→空→非空、resize、release；检查值、方向、刻度和色条真实变化，无重复装饰、旧 colorLegend 或遗留空态。
- [x] 两种矩阵的代表用例各连续 5 次截图，校验稳定并人工查看；受控反例在本地 UMD 产物恢复 paddingInner>0，触发无缝网格断言；反转渐变方向，触发色条与单元格颜色关系断言；完成后恢复原产物，源码不含故障注入。
- [x] 正式 native 视觉清单已登记 `heatmap-correlation`（`charts/heatmap/heatmap-correlation.mjs`）。本次没有 VChart 核心修改，StatPlots 的新功能主要由专用浏览器验证。运行原生 heatmap 用例作集成回归，并记录官方 develop 对新增 StatPlots 工具的覆盖边界，不把稳定性截图当官方基线通过。

执行命令（先设置 Node.js 22；其余命令在 `packages/vchart-statplots`）：

```sh
export PATH=/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH
npm run test -- --runInBand matrix-display correlation-matrix classification field-labels colors
npm run build
npm run check:schema
npm run check:examples
npm run check:catalog
npm run test:browser -- correlation-matrix.spec.ts confusion-matrix.spec.ts colors.spec.ts semantics.spec.ts raw-input.spec.ts
npm run test -- --runInBand
npm run eslint
```

原生视觉命令从仓库根目录执行：

```sh
node packages/vchart/scripts/visual-test.mjs --list
node packages/vchart/scripts/visual-test.mjs --dir charts/heatmap
```

`charts/heatmap` 目录和 `heatmap-correlation` 用例已从清单确认。PR 前按项目要求运行默认全量官方 develop 比较，检查三图 HTML / agent-summary.md；无法运行或基线不支持时如实记录，不跳过用例或放宽阈值。

## 4. 完成标准与风险

- confusionMatrix 在宽屏和窄屏均为紧密方形网格；灰色 NA 与有效格完全对齐。
- 静态色条与 correlationMatrix 结构一致，高值在上；计数和百分比单位准确。
- 现有 raw input、classOrder、统计计算及 Tooltip 契约不变，公开 Schema 不变。
- correlationMatrix 的三角、NA、色标和现有布局测试全部保持正确。
- 主示例展示完整三分类矩阵，空类别变体仍能验证 NA；实际图元、交互和生命周期检查通过。
- 主要风险是轴标题占位、updateSpec 清理旧图例/色条、密集百分比标签及共用工具对相关矩阵的回归；通过上述真实图元与更新场景逐一验证，不在运行时加入宽泛 guard。
- 本计划不新增外部依赖；整个工作区既有的 VUtil normalQuantile 发版依赖仍按原重构验收记录处理，本次样式调整不解决或掩盖该发布前置条件。

## 执行验收

实现及验证完成，详见 [验收记录](../../../packages/vchart-statplots/docs/validation.md#混淆矩阵与相关矩阵的显示对齐2026-10-09)。539 项单元通过；266 项浏览器用例已分别验证通过（初轮全量 265 通过，ROC 旧样本数断言修正后单例通过），另补强并通过窄屏长色条标题检查。相关矩阵 41 张前后截图一致，两图各五次截图稳定；两个视觉反例被实际断言检出，10,000 格生命周期通过，原生 heatmap 官方 develop 比较 1/1 无差异。未提交，未运行 PR 前原生全量。
