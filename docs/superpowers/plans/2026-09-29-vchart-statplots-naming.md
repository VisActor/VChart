# vchart-statplots 命名与配置优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.
>
> 当前会话未提供上述执行技能。实施时按本计划在当前任务逐项执行、复核即可；未经用户明确要求，不启动子代理或创建其他任务。已按用户后续授权在当前任务实施；下方复选框记录完成状态。

**Goal:** 一次完成 28 类图表名称和配置契约的审查优化，修正季节子序列语义，并交付适合 skill 生成的新名称、Schema、示例和选型目录。

**Architecture:** 保持 `StatPlotSpec → 边界校验 → 编译器 → VChart ISpec`。TypeScript 为结构契约来源，Schema 和 standalone 校验器从它生成。自然语言别名放在资料目录中，旧图表名映射仅用于图库 URL / 浏览记录，不进入核心渲染路径。

**执行状态：** 2026-09-30 已完成 T1–T7 的本地实现。测试分布与原示意步骤有调整，以最终行为和保留的日志为准；不追认未记录的逐阶段红绿过程。

**Tech Stack:** Node.js 22、TypeScript 4.9.5、Rush、现有 bundler、Jest、Playwright、内部 JSON Schema 生成器、构建期 Ajv。

## Global Constraints

- 设计依据：[图表与配置命名优化设计](../specs/2026-09-29-vchart-statplots-naming-design.md)。文档创建于 2026-09-29，跨日完成于 2026-09-30。
- 用户已确认：直接统一新名称，旧 Spec 不兼容；仅图库旧 URL 与浏览记录迁移。
- 包名仍为 `@visactor/vchart-statplots`，当前分支为 `codex/vchart-statplots`。
- Node.js 22、TypeScript 4.9.5；沿用现有 Jest、Playwright、Schema 生成器和构建期 Ajv。
- Spec 是纯 JSON、固定语义字段；不增加字段猜测、运行时别名归一化、回调或 VChart 配置透传。
- 统计结果由 Python 或调用方 JS 提供；仅进行既有显示归一化、累加、布局和颜色映射。
- 保留 VChart 原生 `light` / `dark` 主题；不增加额外主题。
- 旧 type、旧字段和旧枚举值在新接口中按结构错误拒绝；语义错误使用既有错误 code 和 JSON Pointer。
- 单位、含义、默认值和约束写入 TS JSDoc、生成的 Schema 及中文文档。
- 不新增图表类型；不改统计估计方法、完整配对要求、时间合法性、相关矩阵约束等无关契约。
- 保留当前工作区已有改动。已按用户授权实施以下步骤，不自动提交、推送或发布。
- 每个 PR 提交前运行仓库要求的默认全量视觉回归；自比较不能代替官方 develop 比较。

## 1. 范围和依赖

| 任务 | 独立交付 | 依赖 |
| --- | --- | --- |
| T1 | 21 个 type 更名、公开类型与所有引用同步，图库旧链接可恢复 | 设计表 |
| T2 | fieldLabels 契约、参考线名称和实际文字展示一致 | T1 |
| T3 | 分布、矩阵、分类观测配置优化，归一化数值含义保持 | T2 |
| T4 | 模型诊断、概率评估字段优化，保留领域常用名称 | T3 |
| T5 | cycle/phase 契约及正确的季节子序列布局 | T4 |
| T6 | 28 类机器可读选型目录、图库共享名称、skill 生成资料 | T5 |
| T7 | 生成物、全部示例、包入口、浏览器及回归验收 | T6 |

只改名的部分不追求视觉差异；季节子序列分组、缺口，以及之前未正确应用的自定义展示名是明确的行为调整。每个任务同步自己的示例和文档，避免源码进入新契约而示例仍使用旧字段。

## 2. 文件分工

下文路径默认相对仓库根目录。类型更名不移动内部图表目录，减少与行为无关的文件变动。

| 文件/目录 | 责任 |
| --- | --- |
| `packages/vchart-statplots/src/plots/*/types.ts` | type、Row、Spec、字段注释；逐图列表在设计第 2、4 节 |
| `packages/vchart-statplots/src/types.ts`、`src/index.ts` | 新公开类型，StatPlotSpec 判别联合，稳定公共函数入口 |
| `packages/vchart-statplots/src/compile.ts`、`src/validate.ts` | 按新 type 分派，不添加旧别名解析 |
| `packages/vchart-statplots/src/plots/*/compile.ts`、`validate.ts` | 新字段的编译、数值语义校验和错误路径 |
| `packages/vchart-statplots/src/common/tooltip.ts`、`marks.ts` | 字段展示名的传递和默认值优先级 |
| `packages/vchart-statplots/scripts/build-schema.ts` | 生成新 Schema / 校验器，清理过期的分图 Schema，检查生成文件集合 |
| `packages/vchart-statplots/schema/`、`src/generated/` | 仅工具生成，不手改 |
| `packages/vchart-statplots/examples/specs/` | 主例、minimal、grouped、variants、invalid 以及 index.json 同步迁移 |
| `packages/vchart-statplots/examples/gallery.js`、`index.html` | 新名称导航，旧 URL / 浏览记录恢复，后续加载资料目录 |
| `packages/vchart-statplots/examples/legacy-types.js`（新建） | 仅图库加载的 21 项旧 type 映射 |
| `packages/vchart-statplots/docs/plot-catalog.json`（新建） | 28 类选型资料及变体，不参与核心解析 |
| `packages/vchart-statplots/scripts/check-catalog.ts`（新建） | 选型资料、Schema、示例的一致性检查 |
| `packages/vchart-statplots/__tests__/fixtures/chart-intents.json`（新建） | 自然语言选型的预期结果和必要选项 |
| `packages/vchart-statplots/docs/naming-migration.md`（新建） | 完整 type、字段、枚举变更表与手工迁移示例 |
| `packages/vchart-statplots/docs/spec.md`、`catalog.md`、`skill-authoring.md`、`computation-contract.md`、`plots/`、`README.md` | 当前可执行契约、计算边界、选型与使用说明 |
| `packages/vchart-statplots/__tests__/unit/`、`__tests__/browser/` | 扩展现有语义和真实渲染测试；新测试文件在任务中列出 |
| `packages/vchart-statplots/benchmarks/run.mjs`、`.github/workflows/statplots-test.yml` | 使用新名；接入目录一致性检查 |

## 3. 实施准备

- [x] 查看 `git status --short`、当前分支和根 `AGENTS.md`；确认不覆盖已有实现、主题、导航及 VChart 核心改动。
- [x] 使用 Node 22。当前本机可用：`export PATH=/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH`；其他环境使用已安装的 Node 22。
- [x] 保存本轮前的同环境数据：运行现有单测和 Node 基准，日志保存到 `.vchart-statplots/naming-before/`；不修改已记录的历史测试结果。

```sh
npm test --prefix packages/vchart-statplots -- --runInBand
node packages/vchart-statplots/benchmarks/run.mjs
```

如果既有基准脚本覆盖 results.json，先将该文件复制到上述日志目录，后续比较使用同一次任务的前后样本。既有失败先定位原因，不通过放宽断言消除。

## T1：统一 type、公开类型和引用

**Files:** 修改 src/types.ts、所有更名图的 types.ts、src/compile.ts、src/validate.ts；修改 scripts/build-schema.ts、examples/specs 全目录及 index.json、gallery.js、index.html、全部测试和 benchmark 的公共 type 引用；重命名 docs/plots 与示例 JSON 文件；新增 examples/legacy-types.js、docs/naming-migration.md；扩展 __tests__/unit/schema.test.ts、__tests__/browser/gallery.spec.ts。

**Interfaces:** 输入为设计第 2 节完整 28 行映射；输出为仅含新名称的 StatPlotSpec、公开 Spec / Row 类型、同名分图 Schema 和示例路径。`compileStatPlot` 等函数签名职责保持。

- [x] 在 naming.test.ts 添加公共契约断言；已保存新名未识别时的失败日志。至少覆盖旧 type 拒绝、28 个新例接受、Schema 文件集合精确一致。新名完整列表从设计表一次录入测试，不从正在测试的 Schema 推导期望值。

```ts
test('new public type is accepted and legacy type is rejected', () => {
  const data = [{ category: 'A', count: 3 }];
  expect(validateStatPlot({ type: 'countPlot', data })).toEqual({ valid: true, errors: [] });
  expect(validateStatPlot({ type: 'count', data }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/type' })])
  );
});
```

- [x] 按设计表修改公共 type、Spec 与 Row 名称、导入导出、编译和校验分派。内部目录与非公开函数名保留。逐处区分语义输入和原生输出，不能将原生 `type: 'scatter'` 改为 scatterPlot，也不能将行内 count 字段改为 countPlot。
- [x] 迁移所有主例、minimal/grouped/invalid/variants 的内容、文件名和 index.json；修改测试、Python/文档示例、benchmark 中对应引用。此任务只更名 type，字段仍按现有契约，后续任务逐步修改。
- [x] build-schema.ts 收集预期分图文件集合；构建模式删除该生成目录内不属于集合的 `*.schema.json`，检查模式对多余或缺失文件报错，不删除文件。具体集合检查：

```ts
const stale = fs.readdirSync(plotDirectory)
  .filter(name => name.endsWith('.schema.json') && !expectedPlotFiles.has(name));
if (check && stale.length) {
  throw new Error(`存在过期图表 Schema：${stale.join(', ')}`);
}
if (!check) {
  stale.forEach(name => fs.unlinkSync(path.join(plotDirectory, name)));
}
```

在现有生成循环中定义 `expectedPlotFiles = new Set<string>()`，每次输出前加入 `${type}.schema.json`；`plotDirectory = path.join(root, 'schema/plots')`。缺失文件仍由现有 output 检查，不导入旧映射用于 Schema 构建。

- [x] examples/legacy-types.js 保存完整 21 项映射，以 `window.statPlotLegacyTypes = Object.freeze({...})` 暴露给仅示例页使用；index.html 在 gallery.js 前加载。gallery.js 的入口解析使用：

```js
function canonicalGalleryType(value) {
  if (labels.has(value)) return value;
  const mapped = window.statPlotLegacyTypes[value];
  return labels.has(mapped) ? mapped : undefined;
}
```

URL → localStorage → violinPlot；旧 URL 用 replaceState，保留其他 query/hash；仍只在成功绘制后保存新 type。JSON 编辑器继续直接走 validateStatPlot。

- [x] 扩展真实浏览器测试：21 个旧 URL 均落到新 type；旧浏览记录恢复；有效旧 URL 优先于已存新值；unknown 仍按既有优先级恢复；旧 Spec 在编辑器显示 /type 错误。旧 URL 示例：

```ts
await page.goto('/examples/index.html?type=count&source=shared#preview');
await expect(page).toHaveURL(/\?type=countPlot&source=shared#preview$/);
await expect(page.locator('#chart-nav [aria-current="page"]'))
  .toHaveAttribute('data-type', 'countPlot');
```

- [x] 重新生成、构建并验证。不要手工修改 generated 文件，检查输出恰为 28 份分图 Schema；迁移后原有测试继续覆盖冻结输入和结构化错误。

```sh
npm run build --prefix packages/vchart-statplots
npm run build:umd --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots -- gallery.spec.ts
```

## T2：明确字段展示名和参考线配置

**Files:** 修改所有已有 labels 的 src/plots/*/types.ts、compile.ts，common/tooltip.ts、marks.ts；estimate-interval/types.ts、compile.ts、validate.ts，qq/types.ts、compile.ts；新增 __tests__/unit/field-labels.test.ts；扩展 __tests__/browser/semantics.spec.ts；同步全部对应示例、docs/spec.md、逐图文档及迁移表。

**Interfaces:** 公共 `fieldLabels` 为原 labels 允许键的对应集合；pointIntervalPlot、qqPlot 使用 `referenceLine`，对象内部结构保持。输出原生 VChart 的 label、axis.title 等仍用原生名称。

- [x] 增加 countPlot 轴标题和 tooltip 名称断言，以及 referenceLine 结构检查；重点验证新增 proportion 展示名。此阶段未单独保留先红后绿的执行记录，下方为原计划中的示意用例。

```ts
const spec = {
  type: 'countPlot' as const,
  fieldLabels: { category: '客户类型', count: '客户数' },
  data: [{ category: 'A', count: 3 }]
};
test('fieldLabels names the actual axis and tooltip quantity', () => {
  const chart = compileStatPlot(spec) as any;
  expect(chart.axes[0].title.text).toBe('客户类型');
  expect(chart.axes[1].title.text).toBe('客户数');
  const keys = chart.series[0].tooltip.mark.content.map((item: any) => item.key);
  expect(keys).toEqual(['客户类型', '客户数']);
  expect(validateStatPlot({ ...spec, labels: { count: '旧字段' } }).errors)
    .toEqual(expect.arrayContaining([expect.objectContaining({ path: '/labels' })]));
});
```

- [x] 逐图修改 labels → fieldLabels 的 TS 声明和读取路径，维持各图允许键的集合；处理 histogram 中已允许的 count/density 展示名未传入 tooltip 的路径，按对应统计量统一使用自定义文案。
- [x] reference → referenceLine，校验器错误路径同步至 /referenceLine/value 等。局部 referenceLine.label 保留。valueScale、fit、estimation、dimensions 的结构保留。
- [x] 公共 tooltip helper 的形参可改为 fieldLabels，但 VChart 输出的 label 不能更名。默认字段名称与用户配置按 `{...defaults, ...spec.fieldLabels}` 的优先级处理；不新增每个图元的 resolver。
- [x] 浏览器测试真实 hover 并检查 tooltip 文字，同时检查实际轴文本。验证 embedding 的 fieldLabels 覆盖 dimensions 展示但不影响 explainedVarianceRatio 元数据。
- [x] 更新全部受影响示例及文档，重新生成 Schema，再执行以下检查。

```sh
npm run build:schema --prefix packages/vchart-statplots
npm run compile --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand field-labels.test.ts interval-matrix.test.ts third-phase.test.ts
npm run build:umd --prefix packages/vchart-statplots
npm run test:browser --prefix packages/vchart-statplots -- semantics.spec.ts
```

## T3：分布、矩阵与分类观测的配置统一

**Files:** 对 count、histogram、missingness、ecdf、box-plot、violin、strip-plot、paired、correlation-matrix、confusion-matrix 这十个既有目录，修改其 types.ts、compile.ts、validate.ts；扩展 unit/distributions.test.ts、violin.test.ts、interval-matrix.test.ts、second-phase.test.ts；修改相关 browser/first-phase.spec.ts、semantics.spec.ts、variants.spec.ts 的输入与断言；同步对应示例和 docs。

**Interfaces:** 采用设计第 4 节对应十行。两个 statistic 选项默认 count；proportion 同一系列内总和为 1；density 使用面积。correlationMatrix、confusionMatrix 的约束分别保持。

- [x] 先增加独立数值预期，避免测试只检查字段替换。以两个系列 30/70、20/20 验证 countPlot 比例为 0.3/0.7、0.5/0.5；默认仍是 30/70、20/20。
- [x] histogram 用 count=4/4、宽度=1/2 验证 density 高度 0.5/0.25、面积和为 1。等宽箱使用 proportion 时高度和为 1。不等宽使用 proportion 应继续按契约拒绝。

```ts
test('density uses bin width after statistic rename', () => {
  const compiled = compileStatPlot({
    type: 'histogram', statistic: 'density',
    data: [
      { binStart: 0, binEnd: 1, count: 4 },
      { binStart: 1, binEnd: 3, count: 4 }
    ]
  }) as any;
  const heights = compiled.series[0].data.values.map((row: any) => row.height);
  expect(heights).toEqual([0.5, 0.25]);
  expect(heights[0] + 2 * heights[1]).toBeCloseTo(1);
});
```

- [x] confusionMatrix 使用 A→A=8、A→B=2、B→A=1、B→B=9：actual 模式分别为 0.8/0.2、0.1/0.9；predicted 模式 A 列为 8/9、1/9，B 列为 2/11、9/11；all 总和为 1，零分母仍 NA。旧 true 枚举报 /normalization 结构错误。
- [x] 修改十类字段：statistic、observationId/isMissing、cumulativeProbability、whiskerLower/Upper、densityNormalization、jitterRatio、categoryOrder、correlation/variableOrder，以及 normalization=actual。更新字段展示名对应键，增加已定义的 proportion 展示名。
- [x] 保留统计逻辑：width/area 计算、ID 稳定抖动、同一对象配对、ECDF 单调、完整对称矩阵与空状态；所有报错路径使用新字段。
- [x] 验证 jitterRatio=0、0.5 及越界、非 jitter 布局的拒绝；fieldLabels.proportion 实际用于轴和 tooltip；densityNormalization 的 width/area 保持既有轮廓预期。通过乱序观测确认抖动仍按 ID 确定。
- [x] 每个更名字段准备一个有效新例和一个旧字段反例；拒绝路径落在旧属性或缺失的新属性，统计关系错误必须落到新字段。同步 index.json 中原先指定的 invalid path。
- [x] 所有更名留在一次边界校验和编译访问中，不增加先遍历全部行做兼容转换的步骤。重新生成和验证。

```sh
npm run build:schema --prefix packages/vchart-statplots
npm run compile --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand distributions.test.ts violin.test.ts interval-matrix.test.ts second-phase.test.ts field-labels.test.ts
npm run build:umd --prefix packages/vchart-statplots
npm run test:browser --prefix packages/vchart-statplots -- first-phase.spec.ts variants.spec.ts semantics.spec.ts python-handoff.spec.ts
```

## T4：模型诊断与概率评估字段

**Files:** 修改 autocorrelation、residual、qq、precision-recall、calibration 五个既有目录的 types.ts、compile.ts、validate.ts；扩展 unit/third-phase.test.ts、second-phase.test.ts、roc.test.ts；扩展 browser/semantics.spec.ts；同步相关 JSON、文档与迁移表。对未更名的模型配置补齐 types.ts 注释。

**Interfaces:** value→correlation（ACF/PACF）、fitted→fittedValue、theoretical/observed→theoreticalQuantile/sampleQuantile、prevalence→positiveRate、meanPredicted→meanPredictedProbability。fieldLabels 键同步。T2 已完成 referenceLine。

- [x] 写统计边界断言：ACF lag=1、correlation=1.2 仍可表示原支持的无偏估计；不能复用相关矩阵的 [-1,1] 校验。负特征重要性仍有效。
- [x] Q–Q 用理论分位数 -1/0/1、样本分位数 1/3/5、referenceLine slope=2/intercept=3，断言坐标方向与参考线端点。样本和理论分位数仍分别非递减，错误路径指向新字段。

```ts
test('QQ fields preserve the theoretical-to-sample direction', () => {
  const chart = compileStatPlot({
    type: 'qqPlot', distribution: 'normal',
    referenceLine: { method: 'given fit', slope: 2, intercept: 3 },
    data: [
      { theoreticalQuantile: -1, sampleQuantile: 1 },
      { theoreticalQuantile: 0, sampleQuantile: 3 },
      { theoreticalQuantile: 1, sampleQuantile: 5 }
    ]
  }) as any;
  expect(chart.series[0].xField).toBe('theoreticalQuantile');
  expect(chart.series[0].yField).toBe('sampleQuantile');
  expect(chart.markLine.coordinates).toEqual([
    { theoreticalQuantile: -1, sampleQuantile: 1 },
    { theoreticalQuantile: 1, sampleQuantile: 5 }
  ]);
});
```

- [x] PR 的 positiveRate=0.2 仍绘制 y=0.2 参考线，0 和 1 是有效边界，越界拒绝；averagePrecision 不改为 AUC。校准 meanPredictedProbability 必须在自身箱内，observedRate 的意义与上下界校验保持。
- [x] 实施新名称，修改所有校验字段枚举、checkAscending 参数、tooltip、referenceLine 坐标和 invalid path。保留 fpr/tpr、auc、trainSize、split、metric、residualKind、dimensions、fit 的既有名称和行为。
- [x] 浏览器断言实际 Q–Q 参考线、ACF stem 与新字段 tooltip；PR 基线数值和 0/1 边界由单测锁定，浏览器验证曲线整体渲染。补齐逐图文档中的单位、所需预计算结果和排除条件。

```sh
npm run build:schema --prefix packages/vchart-statplots
npm run compile --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand third-phase.test.ts second-phase.test.ts roc.test.ts
npm run build:umd --prefix packages/vchart-statplots
npm run test:browser --prefix packages/vchart-statplots -- semantics.spec.ts
```

## T5：修正季节子序列与配置含义

**Files:** 修改 src/plots/seasonal/types.ts、compile.ts、validate.ts；新增 __tests__/unit/seasonal.test.ts；修正 browser/semantics.spec.ts 的季节断言；修改 examples/specs/seasonalPlot.json、minimal/seasonalPlot.json、grouped/seasonalPlot.json、invalid/seasonalPlot.json、variants/seasonalPlot-overlay.json、index.json；更新 docs/plots/seasonalPlot.md、docs/spec.md 和迁移表。

**Interfaces:** 输入采用设计第 6 节 SeasonalPlotSpec。输出 overlay 的横轴为 phase；subseries 的横轴为 cycle，每个 phase 一个面板；按显式数组排序，缺口断线。

- [x] 写 4 季度 × 3 年、无分组的测试；早期失败日志因旧 TS 类型不接受新字段而失败，不将其记作独立运行时拒绝验证。对每个 phase 取数验证，而非只断言面板数。

```ts
test('seasonal subseries groups phases and orders cycles', () => {
  const phaseOrder = ['Q1', 'Q2', 'Q3', 'Q4'];
  const cycleOrder = ['2024', '2025', '2026'];
  const data = cycleOrder.flatMap((cycle, yearIndex) =>
    phaseOrder.map((phase, quarterIndex) => ({ cycle, phase, value: yearIndex * 10 + quarterIndex }))
  ).reverse();
  const chart = compileStatPlot({
    type: 'seasonalPlot', layout: 'subseries', phaseOrder, cycleOrder, data
  }) as any;
  expect(chart.region).toHaveLength(4);
  chart.series.forEach((series: any, index: number) => {
    expect(series.xField).toBe('cycle');
    expect(series.data.values.map((row: any) => row.phase)).toEqual(Array(3).fill(phaseOrder[index]));
    expect(series.data.values.map((row: any) => row.cycle)).toEqual(cycleOrder);
    expect(series.data.values.map((row: any) => row.value)).toEqual([index, 10 + index, 20 + index]);
  });
});
```

- [x] 添加顺序校验：数组非空、元素不重复、必须覆盖输入标签；允许额外声明无观测的标签；重复 `(series,cycle,phase)` 拒绝。数据为空保留原空状态。使用非字典序 cycleOrder=['2026','2024','2025'] 验证显式顺序。
- [x] 新类型使用 cycle/phase、cycleOrder/phaseOrder；fieldLabels 包含 cycle、phase、value。校验路径使用 /cycleOrder、/phaseOrder、/data/i/cycle、/data/i/phase。
- [x] 重写局部分组：overlay 按 `(series,cycle)` 分线并按 phaseOrder 输出；subseries 按 phaseOrder 创建 region、按 series 分线并按 cycleOrder 输出，所有 region 复用同一 y 域。
- [x] 为实际存在的每条线建立键到值的 Map，按对应顺序数组生成点，缺少位置时输出 `value: null` 的显示记录。设置原生 line 的 invalidType='break'，不向输入添加记录。工具函数仅放在 seasonal 编译模块，不扩散为通用数据清洗。

```ts
// 以一条已确定 series、phase 的子序列为例；构造内部显示记录，不改变公共 value 类型。
const byCycle = new Map(rows.map(row => [row.cycle, row.value]));
const displayRows = cycleOrder.map(cycle => ({
  cycle, phase, series: seriesName, value: byCycle.get(cycle) ?? null
}));
```

上述 rows 为同一 phase/series 的输入行，phase、seriesName 来自分组键。overlay 使用同样的显式顺序原则，以 phase 为查找键；不生成输入完全不存在的 series/cycle 组合。

- [x] 修改既有错误测试：semantics.spec.ts 中旧季节示例期望 3 个面板，应变为 4 个，并断言每个面板的实际横轴 domain、点数据和共享 y 域。删除 Q2 的 2025 点后检查 line.points 中间 defined=false，不能把前后两年连成无缺口线。
- [x] 验证 grouped、overlay、subseries、空数据、缺口、resize、深浅色和输入乱序；审阅新的季节截图。其他图形不应因本任务改变。

```sh
npm run build:schema --prefix packages/vchart-statplots
npm run compile --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand seasonal.test.ts third-phase.test.ts schema.test.ts
npm run build:umd --prefix packages/vchart-statplots
npm run test:browser --prefix packages/vchart-statplots -- semantics.spec.ts variants.spec.ts theme.spec.ts
```

## T6：统一选型资料、图库名称和 skill 生成规则

**Files:** 新增 docs/plot-catalog.json、scripts/check-catalog.ts、__tests__/fixtures/chart-intents.json；修改 package.json、.github/workflows/statplots-test.yml、examples/gallery.js、docs/catalog.md、skill-authoring.md、spec.md、computation-contract.md、README.md；完成 docs/naming-migration.md；在 docs/naming-review.md 添加后续设计链接；扩展 browser/gallery.spec.ts。

**Interfaces:** 目录包含恰好 28 个规范 type，与 Schema 集合相等；变体携带 options 和有效 example。图表编译和校验入口不读取目录。文件链接相对包根目录解析。

- [x] 创建资料目录，以以下记录结构为准，每类包含中文任务说明与排除条件，不只堆砌名称别名：

```json
{
  "type": "stripPlot",
  "name": "条带图",
  "englishName": "Strip plot",
  "group": "概览与分布",
  "aliases": ["strip plot", "stripplot", "条带图"],
  "useWhen": "查看类别内每条观测的数值与分布。",
  "avoidWhen": ["只有组内汇总统计", "需要展示 SHAP 贡献"],
  "schema": "schema/plots/stripPlot.schema.json",
  "example": "examples/specs/minimal/stripPlot.json",
  "variants": [
    {
      "name": "蜂群图",
      "aliases": ["swarm plot", "swarmplot", "beeswarm", "蜂群图"],
      "options": { "layout": "swarm" },
      "example": "examples/specs/variants/stripPlot-swarm.json"
    }
  ]
}
```

- [x] 目录中的主 example 使用真正的最小默认语义示例；显式非默认变体（如图库当前 stripPlot 的 jitter、seasonalPlot 的 subseries）移入相应 variants。28 个图库主例可继续展示有代表性的变体，但状态标题必须按实际 spec 选择变体名称。
- [x] 将 ACF/PACF、jitter/swarm、比例、violin area、季节 overlay/subseries、PCA/t-SNE/UMAP 写成携带 options 的条目，并给每个条目提供真实 JSON 文件。不支持的“任意 bar 图”“epoch loss”“完整森林图”列为边界，不生成错误类型。
- [x] scripts/check-catalog.ts 读取目录与逐图 Schema，检查唯一性、恰好 28 类、中文名称、文件存在；对主例和每个变体运行 validateStatPlot、compileStatPlot，验证 example 的 type 和声明 options 实际匹配。新增 package script：`"check:catalog": "ts-node scripts/check-catalog.ts"`。
- [x] 图库使用一个异步初始化函数读取 `/docs/plot-catalog.json`，建立 groups 和 labels 后才生成导航、解析 URL 和调用 choose。加载失败写到现有 #error，保持控件禁用；不维护第二份内置目录。legacy-types.js 仅用于浏览入口解析。

```js
async function loadCatalog() {
  const response = await fetch('/docs/plot-catalog.json');
  if (!response.ok) throw new Error(`图表目录加载失败（${response.status}）`);
  return response.json();
}
```

由初始化过程先 await loadCatalog，再初始化现有导航与 draw/choose 依赖的 labels。统计状态、URL、Schema 链接始终使用规范 type；展示名称按声明 options 与当前 spec 精确匹配最具体的变体。default 布局缺省值依设计文档解析，不通过字符串模糊匹配。

- [x] chart-intents.json 至少包含每类 1 条中文任务和 1 条英文名称，共 56 条正例，再加变体和混淆对：蜂群/SHAP、配对/散点矩阵、计数/均值柱形、训练样本数/epoch、PCA 得分/碎石/含糊 PCA。记录 `{prompt, expected: {type, options}}`；需要澄清或不支持时为 `{prompt, expected: null, reason}`。check-catalog 验证预期引用与目录一致，不将此检查冒充 LLM 评测。
- [x] 文档同步：迁移表写全 21 个 type 和设计第 4 节每个字段/枚举；skill-authoring 给出“选 type 与变体 → 读取 Schema → 计算输出 → 校验 → 编译”的顺序；明确代码片段使用新 type，旧 Spec 只出现在标注为旧例的迁移说明或反例中。
- [x] CI 在 check:examples 后运行 check:catalog；浏览器验证目录失败、全部 28 个导航名、变体标题、URL / 历史 / 存储 / 快速切换。运行以下检查。

```sh
npm run check:catalog --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run compile --prefix packages/vchart-statplots
npm run test:browser --prefix packages/vchart-statplots -- gallery.spec.ts
```

## T7：整体验收与交付记录

**Files:** 验证全部变更；修改 docs/validation.md，必要时更新 benchmarks/results.json 并说明测量日期；记录 `.vchart-statplots/naming-after/` 的日志、截图、包清单与性能样本，不将报告当作发布资产。

**Interfaces:** 一份可以由 Python / JS 生成、经新 Schema 验证、在 ESM/CJS/UMD 使用的最终契约；所有生成资源、目录、示例及旧导航恢复一致。

- [x] 运行全套检查。构建必须先于浏览器，Schema 检查必须能发现过期文件，而不只确认内容。

```sh
npm run build --prefix packages/vchart-statplots
npm run build:umd --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm run eslint --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
git diff --check
```

- [x] 检查 28 类默认/深色/空状态，以及全部已有分组和变体；关注 fieldLabels、比例轴/tooltip、QQ 方向、实际季节面板与断线、图库旧名恢复。测试不以单纯“有 canvas”作为语义通过。
- [x] 保存新旧等价 Spec 的代表性截图：纯名称调整应维持图形；明确记录 fieldLabels 生效与季节修复带来的预期差异。审阅截图，不放宽像素阈值掩盖差异。
- [x] 运行更新后的 Node 基准，并比较同环境前后样本；现有浏览器性能套件包含大散点、蜂群、多图与 Pair Plot，已在全套中运行，不无理由重复。确认新目录和旧名映射未导入核心 runtime。

```sh
node packages/vchart-statplots/benchmarks/run.mjs
npm pack ./packages/vchart-statplots --dry-run --json
```

- [x] 检查打包清单中旧命名的 Schema、示例和类型声明不存在，新 plot-catalog.json 存在；历史审查/迁移文档可以包含旧文字。生成实际 tarball 到临时目录，沿用现有 entrypoints.spec.ts 对 ESM/UMD 的验证方式，使用 CJS 无 DOM 调用 validate/compile；不把开发目录内的成功当作安装包成功。
- [x] 新公开 TS 类型通过编译，旧公开类型不继续导出；compileStatPlot 仍返回原生 VChart spec。Python histogram 交接例使用 statistic，新 JSON 在浏览器绘制和更新均通过。
- [ ] **提交 PR 前条件项**：执行根 AGENTS.md 要求的默认官方全量回归，审阅报告、三图与执行错误。本次未提交 PR、未新增核心源码改动，未重跑核心全量；既有官方结果与基线限制保留在 validation.md。

```sh
node packages/vchart/scripts/visual-test.mjs
```

本轮预期只改 statplots 和资料，不新增 VChart 核心功能；若实施发现必须修改核心，先说明根因并增加相应确定性用例。旧 develop 不具备当前分支既有功能时如实记录基线限制；不把当前自比较写成官方回归通过。

- [x] docs/validation.md 追加本轮日期、最终命名与字段范围、测试实际结果、季节修复截图、包入口和性能对照。保留旧验收记录，说明旧“subseries 已支持”结论的具体纠正。
- [x] 最后用本设计第 9 节逐条验收：类型/Schema/目录一一对应，字段不混用，真实图形正确，资料可供 skill 使用。只报告实际运行结果，不预填通过数目。

## 4. 计划自查

- [x] 覆盖全部 28 类名称与配置审查，包括 7 个保留 type 的图表。
- [x] 21 个 type 更名和字段/枚举映射在设计中明确，无待选命名。
- [x] 已纳入用户确认的旧 Spec 不兼容策略及图库迁移。
- [x] 将季节图的行为修复独立于纯命名调整。
- [x] 保留统计计算边界、原生主题和输入不可变契约。
- [x] 定义了 Schema 清理、错误路径、示例/文档同步、实际渲染和打包验收。
- [x] 区分结构一致性检查与尚未执行的模型意图命中率评测。

本地实现已完成。实际验证证据与执行差异见 [验收记录](../../../packages/vchart-statplots/docs/validation.md)；提交 PR 前的核心全量回归仍作为条件项保留。本轮未创建其他任务、未使用并行代理、未提交或发布。
