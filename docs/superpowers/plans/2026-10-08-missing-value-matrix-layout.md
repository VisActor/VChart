# missingValueMatrix 紧凑布局优化计划

**Goal:** 将缺失值矩阵改为连续、紧凑的观测矩阵，突出缺失位置及共同缺失模式。

**Architecture:** 通过专用 MissingnessSeries 继承 VChart heatmap，保留两条 band 轴和原生网格、标签避让、Tooltip 与生命周期。编译器指定紧凑布局；系列在布局结束时统一量化观测行的共享边界，不增加新的 StatPlots Spec 字段。

**Tech Stack:** TypeScript、VChart、Jest、Playwright、Node.js 22。

## 约束与范围

- 用户已授权实施；沿用当前分支及已有未提交修改。
- 中文文档；不新增依赖或主题；保留公共配色、状态图例、Tooltip 和输入顺序。
- 不修改共享 categoryAxis，避免影响其余图表；优先使用 VChart 标准配置。
- 不新增 gap、padding 或 layout 公共配置，skill 继续生成现有语义 Spec。
- 不增加 missingno 的右侧完整度折线、排序、聚类或新的统计计算；这些不是当前间距问题的必要条件。
- 实施采用本会话逐项执行；用户验收效果后已要求整理并提交实现、文档和回归测试。

## 设计决策

| 项目       | 目标行为                                                | 原因                                               |
| ---------- | ------------------------------------------------------- | -------------------------------------------------- |
| x / y 类型 | 均为 band；变量与观测按首次出现顺序排列                 | 数字形式的 ID 也不是连续数值                       |
| 行间距     | 0                                                       | 连续缺失形成连续色块，减少视觉噪声                 |
| 列间距     | band 间距为 0，边界使用 1 CSS px 实线                   | 分隔宽度不再随图宽变化                             |
| 绘图区两端 | band 外侧 padding 为 0                                  | 矩阵填满数据区域；标题、轴标签所需布局空间不受影响 |
| 分隔颜色   | 当前 VChart 主题的 backgroundColor                      | 浅色为白、深色随原生主题，不能硬编码白色           |
| 轴装饰     | 隐藏轴线及刻度短线，保留轴标题                          | 避免边框与矩阵分隔叠加                             |
| 标签       | 变量名仍在底部；观测 ID 在左侧；空间不足时原生采样/避让 | 保持阅读习惯，不以隐藏数据换取整洁                 |
| 配色及图例 | 维持已观测/缺失的公共配色、顶部两类图例                 | 本轮只解决布局，不重定义颜色语义                   |

方案取舍：继续缩小比例间距实现最少，但宽图仍会出现宽缝；完全无分隔最紧凑，但同色相邻变量不易分辨。本计划选择“无行间隙 + 固定细列分隔”。

参考：[missingno 官方实现](https://github.com/ResidentMario/missingno/blob/master/missingno/missingno.py) 的连续行和列边界分隔；[Seaborn heatmap](https://seaborn.pydata.org/generated/seaborn.heatmap.html) 的默认无单元格间隙。借鉴布局，不复制全部默认样式。

## 任务 1：紧凑矩阵和固定列分隔

**文件：**

- 修改 `packages/vchart-statplots/src/plots/missingness/compile.ts`。
- 修改 `packages/vchart-statplots/__tests__/browser/missingness-layout.spec.ts`。

**接口：** 输入仍为 `MissingValueMatrixSpec`；`compileMissingness(spec)` 返回现有 common chart。数据转换、颜色 scale 和 Tooltip 接口不变。

- [x] 将当前“内外间距均为正且相等”的浏览器断言改为“所有单元格紧密铺满轴范围”；保留实际图元测量，而非只断言配置对象。对每轴内部及两端间距执行：

```ts
for (const gap of [...axis.inner, ...axis.outer]) {
  expect(gap).toBeCloseTo(0, 5);
}
```

- [x] 构建并运行该用例，确认现有 `0.1` 布局使零间距断言失败。
- [x] 在两轴覆盖 `paddingInner: 0, paddingOuter: 0`，隐藏 `domainLine` 和 `tick`；删除当前 `.map` 中统一设置 `0.1` 的逻辑。
- [x] 在 x 轴启用原生边界网格；编译器使用已有 `paletteColor`。初始配置如下，必须通过实际绘制确认网格绘制在色块之上：

```ts
grid: {
  visible: true,
  alignWithLabel: false,
  zIndex: 500,
  style: {
    stroke: paletteColor(spec.theme, 'backgroundColor'),
    lineWidth: 1,
    lineDash: []
  }
}
```

- [x] x 轴使用 `sampling: false` 保留每个列边界，配合 `label.autoHide: true` 避让文字；y 轴保持无网格。不为每个单元格绘制四边描边，不引入逐图元样式回调。
- [x] 浏览器断言实际内部列边界均存在，位置与相邻 cell 边界一致、线宽为 1、颜色随主题变化；检查 light/dark × 800×600/420×360 截图确认线未被遮挡且无水平白缝。外缘线允许被绘图区裁切，但不能造成额外 band 留白。
- [x] 若标准网格路径不能表达该行为，先定位网格位置或图层契约，修正标准路径并补相关核心回归；不直接换成 Canvas 覆盖层或逐图元补丁。

**可独立验收结果：** 4 列 × 12 行示例行间无缝，内部列分隔为固定细线，resize 不改变分隔宽度，两端无额外 band 空白。

## 任务 2：观测标签密度和数据完整性验证

**文件：** 继续修改上述编译器与浏览器用例；按需在测试文件内新增确定性数据生成函数。

**接口：** 数据仍使用 `{ observationId: string, variable: string, isMissing: boolean }`；标签减少不改变轴 domain、数据或图元数量。

- [x] y 轴显式使用 `sampling: true`，标签配置保留 `autoLimit: true` 并启用 `autoHide: true`。不新增按行数阈值切换的手工采样器。
- [x] 使用以下确定性 fixture 覆盖密集矩阵，避免随机数和外部数据：

```ts
const makeData = (rows: number, columns: number) =>
  Array.from({ length: rows }, (_, r) =>
    Array.from({ length: columns }, (_, c) => ({
      observationId: String(r + 1),
      variable: `变量${c + 1}`,
      isMissing: (r + c) % 7 === 0
    }))
  ).flat();
```

- [x] 在 12×4、300×4、1000×10 三种规模上检查图元数分别为 48、1200、10000；验证首尾观测顺序。补单行、单列、空数据，断言无异常及有效范围。
- [x] 检查实际可见 y 轴文本包围盒：800×600 的 12 行示例保留全部 ID；300 行示例显示少于 300 个标签、相邻可见标签不重叠，且全部 1200 个单元格仍然存在。
- [x] 同一 chart 从稀疏数据更新为密集数据，再 resize；断言数据数量、domain 及标签随更新变化。悬停一个已知缺失单元格，断言真实 Tooltip 包含对应 ID、变量和“缺失”。
- [x] 对 10000 单元格执行一次 render/update/resize/release 冒烟，记录耗时但不设置环境敏感的毫秒通过阈值；确认分隔线数量随列数增长，没有每个 cell 新增装饰图元。

**可独立验收结果：** 小数据易于逐行阅读，大数据标签不拥挤，标签采样不丢数据，更新和悬停正常。

## 任务 3：文档及最终验证

**文件：** 修改 `packages/vchart-statplots/docs/plots/missingValueMatrix.md`，替换上一轮“内外间距均为 0.1”的说明；在本文登记测试结果。

- [x] 文档明确两轴离散、行连续、列细线分隔、标签自动减少但数据完整，给出现有 Spec 示例，不加入新布局字段。
- [x] 在仓库根目录使用 Node.js 22 运行：

```sh
npm run build --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand second-phase.test.ts
npm run test:browser --prefix packages/vchart-statplots -- missingness-layout.spec.ts
npm run check:examples --prefix packages/vchart-statplots
git diff --check
```

- [x] 实际审阅两种主题、两种尺寸及密集数据截图；报告保存到 `.vchart-statplots/missingness-layout/`，不得用仅检查配置对象代替视觉检查。
- [x] 反例检查：临时恢复 `paddingInner: 0.1`，确认零间距断言失败；临时关闭列网格，确认分隔线断言失败；恢复后重新验证。不得将反例修改留在最终代码中。
- [x] 此任务仅修改 StatPlots 时使用其浏览器回归；若实施中修改 VChart 核心，依 AGENTS.md 补相关官方视觉用例并运行对应目录。提交 PR 前按仓库要求运行全量官方视觉比较，基线不支持的功能单独记录，不报告成通过。

## 完成标准

1. 现有 Spec 原样可用，JSON Schema、公共类型及 skill 输入要求不变。
2. 行间无空白、列间固定 1 CSS px 分隔、矩阵边缘无额外 band padding。
3. 深浅色、resize、密集标签、数据更新和 Tooltip 均有实际渲染证据。
4. 仅缺失值矩阵默认视觉发生变化，无共享轴或其他图表默认行为变更。

## 实施结果（2026-10-08）

- 完成编译器、中文图表文档及 4 项浏览器回归用例；未新增 Spec 字段、依赖或主题，未修改 VChart 核心。
- 正式构建、16 项相关单元测试、4 项浏览器测试、测试代码类型检查及修改文件 ESLint 均通过。
- 28 份主例及 67 份变体通过校验，28 份反例按预期拒绝。
- 原布局在零间距断言处失败（列间距约 17.37px）；恢复 paddingInner=0.1 的反例在几何断言处失败，关闭网格的反例因 3 条内部列分隔缺失而失败。反例修改已全部恢复，最终构建和 4 项浏览器测试重新通过。
- 已审阅 light/dark × 800×600/420×360、300 行两种尺寸及 10000 单元格截图。几何无行间隙；密集数据的非整数像素边界和亚像素行高仍受 Canvas 抗锯齿/栅格化影响，不能把完整保留图元等同于屏幕可逐行辨识；该限制已写入图表文档。
- 10000 单元格本次本地 render/update/resize/release 分别约为 69.2/41.9/36.8/3.0ms；仅记录冒烟运行耗时，不作为性能基准或通过阈值。
- 截图和耗时记录：`.vchart-statplots/missingness-layout/`。官方核心视觉全量未运行，本次未修改核心且未创建 PR；提交 PR 前仍需遵守 AGENTS.md 的全量要求。

## 补充修复：非整数行高的像素细缝

用户截图确认仅设置 band padding 为 0 仍存在细缝。原生 heatmap 的矩形符号逐个绘制，几何上相接的小数坐标在 Canvas 抗锯齿过程中分别覆盖边界像素，背景色因此混入；上一轮的几何断言未覆盖这种实际像素误差。

新增/修改文件：

- `packages/vchart-statplots/src/series/missingness/layout.ts`：以轴 domain、range、区域 y 偏移和设备 DPR 计算共享边界，返回按观测 ID 索引的中心和尺寸。
- `packages/vchart-statplots/src/series/missingness/missingness.ts`：继承原生 heatmap，onLayoutEnd 按观测行重算几何，图元编码仅查表；复用每行尺寸元组，release 清理缓存。
- `packages/vchart-statplots/src/register.ts`、`packages/vchart-statplots/src/plots/missingness/compile.ts`：通过现有注册机制使用 statplotsMissingness 专用系列；公共 Spec 与 Schema 不变。
- `packages/vchart-statplots/__tests__/unit/missingness-layout.test.ts`：7 项共享边界、设备像素、反向 range、区域偏移及亚像素密集行的几何契约测试。
- `packages/vchart-statplots/__tests__/browser/missingness-pixels.spec.ts`：真实 Canvas 像素回归，覆盖 DPR 1/1.25/1.5/2/3、两种主题、四种尺寸（含小数 CSS 尺寸）、数据/主题更新及 300 行混合缺失状态。

- [x] 先新增像素断言；旧实现五种 DPR 均失败，12 行纯色列出现 6 ～ 9 行异常像素，最大通道偏差达 59，复现背景细缝。
- [x] 对全部观测行的边界统一按设备像素取整；相邻行复用同一边界，禁止独立取整中心/高度或人为加宽重叠单元格。
- [x] 像素断言修复后通过：连续同色行保持实色，混合状态行的像素与各自颜色相符；最多允许 1 个 RGB 通道量化级的误差。
- [x] 67 项相关单元测试、14 项缺失矩阵浏览器测试、构建、修改文件 ESLint、测试代码类型检查和示例校验通过。
- [x] 已检查修复后的默认主例、300 行矩阵及非整数 DPR 的深色截图。保留亚像素密集场景的物理分辨率边界：行数大于可用设备像素数时部分行高度为零，数据仍完整保留，逐行查看需要增加高度。

新增截图：`.vchart-statplots/missingness-pixels/`；默认主例及生命周期报告仍在 `.vchart-statplots/missingness-layout/`。本次未修改 VChart 核心。

构建补充：一次最终构建生成各格式产物后进程未退出，终止该构建进程后使用 `CI=true npm run build --prefix packages/vchart-statplots` 重跑，完整构建正常退出（退出码 0）；未改构建工具。重跑产物的 14 项浏览器回归随后全部通过。
