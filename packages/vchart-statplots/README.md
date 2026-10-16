# @visactor/vchart-statplots

以简洁的语义 JSON 描述数据科学图表，再编译为 VChart spec。覆盖 [28 类统计图](docs/catalog.md)，模型拟合留在 Python 或调用方 JavaScript；本包从原始观测完成计数、混淆矩阵、ROC / PR / 校准曲线、正态 Q–Q、ACF / PACF、分箱与分布估计，并负责几何布局和交互。`kdePlot`、`ecdfPlot` 接受原始 `{value, series?}` 样本，复用 vutils 按系列独立计算；KDE 的核函数和带宽参与估计，ECDF 保留真实跳点及重复值权重。`boxPlot` 接受原始 `{category, value, series?}` 观测，复用 vutils 计算四分位数，默认按 1.5×IQR 判定须与异常值，可用 `whiskers.iqrMultiplier` 调整。`violinPlot` 接受原始 `{category, value, series?}` 观测，与 kdePlot 共用核密度估计，默认等面积，支持等宽、按样本数缩放及归一化范围。`histogram` 接受单变量原始 `{value}` 观测，通过可选 `binning.binCount` 计算分箱频数（默认按样本量使用 Sturges 候选数）；不支持 series 或预分箱输入。`hexbinPlot` 接受原始 x/y 散点，在编译阶段按 `binning.xBins`（默认 30）计算六边形分箱计数。`pairPlot` 只需 `variables` 与 `data.observations`，默认内部计算对角直方图，可用 `diagonal.binning.binCount` 调整箱数或 `diagonal: { type: 'none' }` 关闭对角分布。

`missingValueMatrix`、`correlationMatrix` 接收原始表格；`pointIntervalPlot` 支持原始分组样本与外部估计，`scatterPlot` 可从原始 x/y 内部拟合线性、多项式或 LOWESS；`residualPlot` 支持原始 x/y、真实值/预测与外部模型残差，`learningCurve` 支持各折分数与外部汇总；`timeSeriesPlot` 支持原始时间观测聚合与外部估计。多用途图以必填 `input` 明确区分用途，详见[计算契约](docs/computation-contract.md)。

```ts
import VChart from '@visactor/vchart';
import { compileStatPlot, registerStatPlots, validateStatPlot } from '@visactor/vchart-statplots';

registerStatPlots();
const spec = {
  type: 'rocCurve' as const,
  title: '分类器表现',
  data: [
    { actual: true, score: 0.9 },
    { actual: false, score: 0.4 },
    { actual: true, score: 0.6 },
    { actual: false, score: 0.1 }
  ]
};
const result = validateStatPlot(spec); // 可选；compile 内部也会校验
const chart = new VChart(compileStatPlot(spec), { dom: 'chart' });
await chart.renderAsync();
await chart.updateSpec(compileStatPlot({ ...spec, title: '更新后的分类器' }));
await chart.resize(900, 600);
chart.release();
```

## 契约

- [Spec 规则、错误路径与默认值](docs/spec.md)
- [公共配色：命名色板与自定义数组](docs/colors.md)
- [计算契约与 Python / JavaScript 交接](docs/computation-contract.md)
- [图表选型与逐图避坑](docs/catalog.md)
- [未来 skill 的生成协议](docs/skill-authoring.md)与[机器可读选型目录](docs/plot-catalog.json)
- [命名与配置迁移](docs/naming-migration.md)：旧 Spec 直接拒绝，图库旧 URL 和浏览记录自动迁移
- [实现与验收](docs/validation.md)及[性能基准](benchmarks/README.md)
- [全部 JSON 示例](examples/specs) 与 [交互示例页](examples/index.html)
- 构建生成的总 Schema `schema/statplot.schema.json` 与 `schema/plots/<type>.schema.json`（发布包内提供）

VChart 是 peerDependency，ESM/CJS/UMD 均 external。UMD 全局名 `VChartStatPlots`，先加载同版本的 VChart。此源码包使用本仓库同步版本；尚未发布，请使用本仓库构建产物，不假定 npm CDN 已有此包。

`theme` 直接使用 VChart 原生的 `light`（默认）或 `dark`，不注册额外主题。独立的 `colors` 公共配置按 categorical / sequential / diverging 三个用途指定命名色板或自定义数组，默认 colorblind / viridis / RdBu_r。使用 `colors: { categorical: 'vchart' }` 可恢复原生分类色。边框、缺失值、警告标记等继续读取主题语义颜色。切换主题或配色时重新编译完整语义 spec，再调用 `chart.updateSpec`。

`pairPlot` 的观测 ID 联动依赖本次同步加入 VChart 的 `brushLinkDataKey`。已有 npm 2.1.7 不包含该能力；首次发布须与包含这些核心改动的 VChart 同批发版，并同步 peer 版本。

## 本地开发

公开 TS 类型与 `scripts/build-schema.ts` 是 Schema 的来源。`schema/` 与 `src/generated/` 不进入 Git；编译、开发服务、单测、浏览器测试及示例检查会先生成这些资源。也可单独运行 `npm run build:schema`，随后用 `npm run check:schema` 核对生成物与类型的一致性。逐图文档中的相对 Schema 链接在本地构建和发布包内有效。

使用 Node.js 22，在仓库根目录：

```sh
node common/scripts/install-run-rush.js install --ignore-hooks
node common/scripts/install-run-rush.js build --to @visactor/vchart-statplots
npm run start --prefix packages/vchart-statplots
```

也可以在子包目录执行：

```sh
cd packages/vchart-statplots
rushx start
```

默认使用 `4180` 端口并自动打开 `/examples/index.html`。访问根路径 `/` 也会自动跳转到图库，并保留查询参数和 URL 锚点，例如 `/?type=pairPlot`。端口被占用时 Vite 自动选择下一个可用端口，以终端显示的地址为准；可用 `rushx start --port 4181` 指定端口。通过左侧分组导航切换 28 类图表，可编辑 JSON、查看校验错误、切换主题和导出 PNG。自动化浏览器测试使用 test 模式和独立端口，不自动打开浏览器。

支持 `/examples/index.html?type=violinPlot` 直接打开指定图表，`type` 使用[图表目录](docs/catalog.md)中的值。切换会同步 URL，支持浏览器前进、后退和复制链接。进入页面时依次使用：有效的 URL 类型 → 同源浏览器中上次成功查看的类型 → 默认 `violinPlot`。无效类型会回退并修正 URL；浏览器禁用本地存储时仍可通过 URL 切换。仅记忆图表类型，不保存编辑过的 JSON 或主题。

```sh
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm run eslint --prefix packages/vchart-statplots
```

统计图需要原始统计意义正确的输入；Schema 只能保证结构，跨字段规则由 `validateStatPlot` 补充。输入不修改，编译后的 series/data ID 和辅助字段不构成公共承诺。更新应重新编译完整语义 spec。

## 构建与发布

标准 `build` 与单独 `build:umd` 都先生成资源。`npm pack` / `npm publish` 通过 `prepack` 执行完整构建，按当前版本生成 Schema 并打包；release workflow 继续使用现有 Rush 构建入口。发布包保留 Schema 和 ESM/CJS/UMD 中的 standalone 校验器，运行时不依赖 Ajv，也不在浏览器动态编译 Schema。

## 统计工具依赖

本包使用 `@visactor/vutils ~1.0.28` 根入口的公共 `normalQuantile`、`mean`、`correlation` 和 `bootstrapEstimate`。这些 API 自 npm `1.0.25` 起提供；仓库依赖和 Rush 锁文件已同步。执行标准 Rush 安装即可使用。

已发布依赖的隔离安装、类型、构建与回归结果见[验收记录](docs/validation.md)。这项升级解决统计工具的依赖阻断；VChart 核心改动及其他发布要求仍须按验收记录核对。

散点/残差图的内部回归使用 vutils 自 1.0.26 起提供的稳定回归与成对 bootstrap；当前依赖下限为 `~1.0.28`。正式包验证与发布验收状态见[验收记录](docs/validation.md)。

VUtils 1.0.28 将 LOWESS 公共默认参数恢复为 `span=0.3`、`iterations=2`，并保留算法正确性修复。StatPlots 继续显式传入 `span=2/3`、`iterations=3`、`delta=0`；业务默认行为保持不变，用户仍可显式覆盖。

KDE/violin 默认对齐 Seaborn 的样本标准差带宽；KDE 默认全体样本归一化，violin 默认等面积、同系列跨分类归一化。旧默认可显式配置，见对应逐图文档。此项使用 npm VUtil 1.0.27 提供的 standardDeviation/bandwidthAdjust 公共接口；相关依赖和 Rush 锁文件已同步。
