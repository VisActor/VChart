# @visactor/vchart-statplots

以简洁的语义 JSON 描述数据科学图表，再编译为 VChart spec。覆盖 [28 类统计图](docs/catalog.md)，模型拟合与统计推断留在 Python 或调用方 JavaScript；本包负责校验、显示归一化、确定性分箱、KDE / ECDF / 箱线统计 / 小提琴轮廓、几何布局与交互。`kdePlot`、`ecdfPlot` 接受原始 `{value, series?}` 样本，复用 vutils 按系列独立计算；KDE 的核函数和带宽参与估计，ECDF 保留真实跳点及重复值权重。`boxPlot` 接受原始 `{category, value, series?}` 观测，复用 vutils 计算四分位数，默认按 1.5×IQR 判定须与异常值，可用 `whiskers.iqrMultiplier` 调整。`violinPlot` 接受原始 `{category, value, series?}` 观测，与 kdePlot 共用核密度估计，保留等宽与等面积轮廓。`histogram` 接受单变量原始 `{value}` 观测，通过可选 `binning.binCount` 计算分箱频数（默认按样本量使用 Sturges 候选数）；不支持 series 或预分箱输入。`hexbinPlot` 接受原始 x/y 散点，在编译阶段按 `binning.xBins`（默认 30）计算六边形分箱计数。`pairPlot` 只需 `variables` 与 `data.observations`，默认内部计算对角直方图，可用 `diagonal.binning.binCount` 调整箱数或 `diagonal: { type: 'none' }` 关闭对角分布。

```ts
import VChart from '@visactor/vchart';
import { compileStatPlot, registerStatPlots, validateStatPlot } from '@visactor/vchart-statplots';

registerStatPlots();
const spec = {
  type: 'rocCurve' as const,
  title: '分类器表现',
  data: [
    { fpr: 0, tpr: 0 },
    { fpr: 0.1, tpr: 0.8 },
    { fpr: 1, tpr: 1 }
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
- [总 Schema](schema/statplot.schema.json) 与 `schema/plots/<type>.schema.json`

VChart 是 peerDependency，ESM/CJS/UMD 均 external。UMD 全局名 `VChartStatPlots`，先加载同版本的 VChart。此源码包使用本仓库同步版本；尚未发布，请使用本仓库构建产物，不假定 npm CDN 已有此包。

`theme` 直接使用 VChart 原生的 `light`（默认）或 `dark`，不注册额外主题。独立的 `colors` 公共配置按 categorical / sequential / diverging 三个用途指定命名色板或自定义数组，默认 colorblind / viridis / RdBu_r。使用 `colors: { categorical: 'vchart' }` 可恢复原生分类色。边框、缺失值、警告标记等继续读取主题语义颜色。切换主题或配色时重新编译完整语义 spec，再调用 `chart.updateSpec`。

`pairPlot` 的观测 ID 联动依赖本次同步加入 VChart 的 `brushLinkDataKey`。已有 npm 2.1.7 不包含该能力；首次发布须与包含这些核心改动的 VChart 同批发版，并同步 peer 版本。

## 本地开发

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
