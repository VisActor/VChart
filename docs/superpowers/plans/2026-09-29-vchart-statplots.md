# vchart-statplots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 本会话未提供上述两个执行技能；本文是实施计划，执行时可在当前会话按任务顺序完成和复核，不将缺少这些技能作为功能开发的前置条件。未经用户要求，不额外启动子代理或创建其他任务。

**Goal:** 在当前仓库新增 `@visactor/vchart-statplots`，以简洁的语义 spec 分四期实现 28 类专业数据科学图表，并提供未来 skill 可直接使用的契约与示例。

**Architecture:** `StatPlotSpec → 边界校验 → 编译器 → VChart ISpec`。复用 VChart 实例生命周期和标准系列；小提琴、蜂群、Hexbin 使用必要的专用系列。大部分统计计算由调用方完成，本包负责显示归一化和布局；hexbinPlot 按 2026-10-08 重构计划改为原始散点输入，由本包完成固定六边形分箱。

**Tech Stack:** Node.js 22、TypeScript 4.9.5、Rush 5.148.0、pnpm 10.7.0、仓库 bundler、Jest 26、Playwright 1.63.0、内部 JSON Schema 生成器、Ajv 8.12 系列的构建期 standalone 生成。

## Global Constraints

- 设计依据：[vchart-statplots 设计](../specs/2026-09-29-vchart-statplots-design.md)。用户已授权创建分支并执行，当前在 `codex/vchart-statplots` 实施；实际结果见 [验收记录](../../../packages/vchart-statplots/docs/validation.md)。
- 目录为 `packages/vchart-statplots`，包名为 `@visactor/vchart-statplots`。
- 采用 `vchartMain` lockstep，当前版本 2.1.7；实施时以 `common/config/rush/version-policies.json` 为准。
- VChart 为 peerDependency、开发时为同版本 workspace devDependency；打包 external，不重复包含渲染引擎。
- 公共 spec 使用固定语义字段、JSON 数据和 lowerCamelCase 类型名称；不引入字段推断、回调或通用 VChart 配置透传。
- 仅导出已实现并验收的类型，未来类型只保留在路线图中。
- 不实现 Python runner、统计 provider、后端服务、完整报告系统或 skill；不改动 multivariate-analysis。
- 采用现有公开扩展机制，禁止外部访问 VChart 私有实例字段；验证在输入边界，避免逐图元防御分支。
- 文档优先中文；测试固定数据、种子和时区，不请求远程数据或字体。
- 每个 PR 提交前运行仓库要求的默认全量视觉回归；自比较不能代替官方 develop 比较。
- 实施前检查当前分支与工作区，保留用户改动；本文不授权发布 npm、推送或合并。

## 执行状态

P1–P4 的 28 类、公共 API、Schema、示例页、中文文档和 CI 已实现。下方步骤保留原始计划，最终行为与验证结果以验收记录为准；文件合并、内部布局接口等差异亦记录其中。官方 develop 全量回归已运行并复核：255 个既有用例一致、1 个主题修复的预期差异、3 个新用例受旧基线限制；详见验收记录，未宣称全绿。

| 任务 | 实施结果 |
| --- | --- |
| T1 | ROC 纵向链路、工程配置和结构化错误完成 |
| T2 | 小提琴专用系列与真实交互完成 |
| T3–T4 | 分布、区间与相关矩阵完成 |
| T5 | 构建、Schema、CI、安装包、生命周期及性能检查完成；核心回归单列验收 |
| T6–T7 | P2 八类完成 |
| T8–T9 | P3 九类完成 |
| T10–T12 | Hexbin、蜂群、SHAP、Pair Plot 及 ID 联动完成 |
| T13 | 28 类目录、114 份有效/无效主例及变体、skill 资料与验收报告完成 |

## 1. 阶段、依赖和交付

| 阶段 | 任务 | 可独立验收的结果 |
| --- | --- | --- |
| P1 | T1–T5 | 8 类：ROC、小提琴、直方图、KDE、ECDF、箱线、点估计与区间、相关矩阵；ESM/CJS/UMD、Schema、示例与测试齐备 |
| P2 | T6–T7 | 新增 8 类：计数/比例、缺失矩阵、条带/抖动、配对、散点/拟合、混淆矩阵、PR、校准 |
| P3 | T8–T9 | 新增 9 类：时间序列、季节、ACF/PACF、碎石、降维、残差、Q–Q、学习曲线、特征重要性 |
| P4 | T10–T13 | 新增 Hexbin、散点矩阵、SHAP 蜂群，补全 stripPlot.swarm；全部 28 类验收和 skill 资料包 |

依赖顺序：T1 → T2 → T3/T4 → T5 → T6/T7 → T8/T9 → T10/T11 → T12 → T13。斜杠表示无新增设计依赖，不要求同时派发工作。T2 提前消除专用系列接入风险；不等 25 类做完才发现扩展契约不成立。

不按“每类写一个模板”估算工期。T1、T2 完成后，根据实际 schema 工具、扩展系列、构建与浏览器测试成本估算各期；复杂布局单列，不平均分摊。

## 2. 文件与职责

除注明为既有文件外，下表文件均为实施时新增。

| 路径 | 职责 |
| --- | --- |
| `rush.json`（修改） | 注册新项目与版本策略 |
| `common/config/rush/pnpm-lock.yaml`（工具更新） | Rush 更新依赖，不手工编辑 |
| `packages/vchart-statplots/package.json`、`bundler.config.js` | 发布入口、构建脚本和 external |
| `packages/vchart-statplots/tsconfig.json`、`tsconfig.test.json`、`tsconfig.eslint.json`、`.eslintrc.js`、`jest.config.js` | 仓库一致的编译、Node 单测、lint 配置 |
| `packages/vchart-statplots/src/index.ts` | 公共 API 和类型导出 |
| `packages/vchart-statplots/src/types.ts` | 已交付类型的判别联合 |
| `packages/vchart-statplots/src/common/types.ts` | BaseSpec、Interval、StatPlotIssue、ValidationResult |
| `packages/vchart-statplots/src/common/axes.ts` | 概率、数值、分类轴的确定性构建 |
| `packages/vchart-statplots/src/common/theme.ts` | light/dark、顺序色、发散色、缺失值色和系列色 |
| `packages/vchart-statplots/src/common/tooltip.ts` | 语义字段、数值与区间说明；不在 hover 时做统计 |
| `packages/vchart-statplots/src/compile.ts`、`validate.ts`、`errors.ts` | 公共入口、一次边界校验、结构化异常 |
| `packages/vchart-statplots/src/register.ts` | 幂等注册专用系列；无顶层注册副作用 |
| `packages/vchart-statplots/src/plots/<图名>/types.ts`、`compile.ts`、`validate.ts` | 一个统计图的输入、编译和跨字段语义检查，目录名见各任务 |
| `packages/vchart-statplots/src/series/violin/`、`swarm/`、`hexbin/` | 仅在对应任务创建，各自负责新增图形的生命周期与布局 |
| `packages/vchart-statplots/scripts/build-schema.ts` | 从 TS 生成合并/分类型 Schema 与 standalone 校验代码 |
| `packages/vchart-statplots/src/generated/validate.js`、`validate.d.ts` | 生成的结构校验函数及声明，不手工维护 |
| `packages/vchart-statplots/schema/statplot.schema.json`、`schema/plots/` | 随包分发的 JSON Schema |
| `packages/vchart-statplots/examples/specs/`、`examples/index.html` | 已交付类型的纯 JSON 样例与浏览器示例 |
| `packages/vchart-statplots/docs/spec.md`、`docs/computation-contract.md`、`docs/plots/` | 公共接口、计算边界和逐图统计说明 |
| `packages/vchart-statplots/__tests__/unit/`、`__tests__/browser/`、`__tests__/fixtures/` | 语义、编译、真实渲染和独立参考数据 |
| `packages/vchart-statplots/benchmarks/` | 固定输入规模的性能测量 |
| `.github/workflows/statplots-test.yml`（新增） | Node 22 的新包编译、单测与浏览器检查，不改变既有任务的 Node 版本 |
| `.gitignore`（修改） | 忽略根目录 `.vchart-statplots/` 测试报告与临时图片 |

`<图名>` 仅是上表解释目录模式，各任务下面列出的图名和文件才是实施清单；不预建空目录，不一次性加入未来 28 类占位导出。

## 3. 公共类型与内部边界

T1 首先落地下面的 ROC 类型；后续任务向联合类型追加成员，不改变已交付数据的含义。

```ts
export interface RocRow {
  fpr: number;
  tpr: number;
  threshold?: number;
  series?: string;
}

export interface RocSpec {
  type: 'roc';
  title?: string;
  description?: string;
  labels?: { fpr?: string; tpr?: string };
  theme?: 'light' | 'dark';
  data: RocRow[];
  metrics?: { series?: string; auc: number }[];
}

export type StatPlotSpec = RocSpec; // T1 的真实可执行范围。
```

共用 Interval 用判别联合表达必填项，不能用一组互不相关的可选字段代替：

```ts
export type Interval =
  | { kind: 'confidence' | 'prediction' | 'credible'; level: number }
  | { kind: 'standardError' | 'standardDeviation'; multiplier: number }
  | { kind: 'range' };

export interface StatPlotIssue {
  code: 'SCHEMA_ERROR' | 'INVALID_RANGE' | 'INVALID_ORDER'
    | 'DUPLICATE_KEY' | 'INCONSISTENT_SERIES' | 'UNSUPPORTED_COMBINATION';
  path: string;
  message: string;
}

export type ValidationResult =
  | { valid: true; errors: [] }
  | { valid: false; errors: StatPlotIssue[] };
```

内部图表函数统一为 `compileRoc(spec: RocSpec): ISpec`、`validateRoc(spec: RocSpec): StatPlotIssue[]`；其他图对应替换名称。compile 中已完成结构和语义检查，内部图表函数不二次遍历验证。用按 type 的穷尽分派即可，首版不引入动态插件管理器。

## 4. P1：先交付完整统计图能力

### T1：ROC 的语义 JSON 到真实渲染纵向链路

**Files：** 创建第 2 节工程文件、公共入口与 common/types；创建 `src/plots/roc/{types,compile,validate}.ts`、`__tests__/unit/roc.test.ts`、`__tests__/unit/schema.test.ts`、`__tests__/fixtures/roc.json`、`examples/specs/roc.json`、`docs/plots/roc.md`、`README.md`。创建 `__tests__/browser/playwright.config.ts`、`page.html`、`chart.spec.ts`、`helpers.ts`。修改 rush.json 和锁文件。

**Consumes：** VChart 公开的 ISpec、line/common、参考线和实例 API；内部 Schema 生成器。

**Produces：** `compileStatPlot(spec: StatPlotSpec): ISpec`、`validateStatPlot(input: unknown): ValidationResult`、`registerStatPlots(): void`；`StatPlotValidationError` 导出 `issues: StatPlotIssue[]`。此时 register 无专用系列可注册，保留统一入口，T2 加入实际注册。

- [ ] 登记 Rush 项目，加入真实需要的依赖。ESM/CJS/UMD external VChart，global 为 `VChartStatPlots`，不复制 extension 包中无关 React/VRender 依赖。
- [ ] 增加 Node 单测与下列反例，安装依赖后先运行，确认因接口未实现失败。

```ts
it('指出 ROC 概率越界的具体字段', () => {
  const result = validateStatPlot({ type: 'roc', data: [{ fpr: 1.2, tpr: 0.7 }] });
  expect(result.valid).toBe(false);
  expect(result.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ path: '/data/0/fpr', code: 'INVALID_RANGE' })
  ]));
});

it('拒绝生成模型猜出的通用字段名', () => {
  const result = validateStatPlot({ type: 'roc', data: [{ x: 0.1, y: 0.8 }] });
  expect(result.valid).toBe(false);
});
```

- [ ] 实现 RocSpec 与结构生成；生成器开启 required、noExtraProps、strictNullChecks，不使用 ignoreErrors；每个 type 输出独立 Schema，保留中文字段说明。
- [ ] 结构检查负责形状、类型和未知字段；语义检查负责有限数、[0,1]、每 series 内 fpr/tpr 单调不减、series 一致性与 metrics 对应关系。上游 threshold 无穷值必须省略，不能进入 JSON；无穷阈值不是渲染必需信息。
- [ ] 实现 ROC → VChart 的双概率轴、线性连接、对角线、语义 tooltip；不从点列推算 AUC，不补造端点。空数组生成明确空状态。
- [ ] 浏览器 fixture 从本地构建加载 VChart UMD 与本包 UMD；执行 renderAsync，检查画布、曲线、对角线和 tooltip 内容，再 resize/updateSpec/release；禁止只断言 getSpec 与输入一致。
- [ ] 生成 HTML 示例；开发者能用一个 JSON 文件替换数据，不编辑图元配置。compile 对输入不修改，Node 无 DOM import/compile 可用。

**验证命令（工作目录为包目录，下同）：**

```sh
node ../../common/scripts/install-run-rush.js update
node ../../common/scripts/install-run-rush.js build --to @visactor/vchart
npm run build:schema
npm run compile
npm test -- --runInBand __tests__/unit/roc.test.ts __tests__/unit/schema.test.ts
npm run build
npm run test:browser -- --grep roc
```

**出口：** 正反例同时通过，真实浏览器有正确绘制；Schema 与校验器可再生；UMD 使用宿主的同一份 VChart。

### T2：小提琴专用系列，验证专业图形扩展

**Files：** `src/plots/violin/{types,compile,validate}.ts`；`src/series/violin/{interface,violin,tooltip,index}.ts`；更新 `src/register.ts`、`src/types.ts`、编译/校验分派；`__tests__/unit/violin.test.ts`、`__tests__/browser/violin.spec.ts`、`__tests__/fixtures/violin.json`、`examples/specs/violin.json`、`docs/plots/violin.md`。

**Consumes：** `compileStatPlot`、结构生成链、VChart CartesianSeries/Factory/area mark、series 生命周期。

**Produces：** `ViolinSpec`、`compileViolin(spec: ViolinSpec): ISpec`、`validateViolin(spec: ViolinSpec): StatPlotIssue[]`、`registerViolinSeries(): void`；内部 series type 固定为 `statplotsViolin`。

- [ ] 写密度非负、每组 value 严格递增、至少两个采样点、有限数和零面积退化反例；零密度组应报统计输入错误，不生成 NaN 路径。
- [ ] 用独立手工对称密度 fixture 检查轮廓：分类中心两侧距离相同，最大宽度与约定一致，value 数值轴保持不变。

```ts
it('密度不能为负数', () => {
  const result = validateStatPlot({
    type: 'violin',
    data: [
      { category: 'A', value: 0, density: 0 },
      { category: 'A', value: 1, density: -0.2 }
    ]
  });
  expect(result.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ path: '/data/1/density', code: 'INVALID_RANGE' })
  ]));
});
```

- [ ] 以 category/series 分组，预计算每组最大密度或梯形积分；width 模式按组最大密度归一，area 模式按组积分归一后用公共宽度系数约束整体最大宽度。显示运算只做一次，保留原 density 供 tooltip。
- [ ] 实现专用系列：线性连接密度采样点形成对称 area；band 轴决定类别中心与可用宽度，数值轴决定 value 位置；从系列自身的扩展生命周期读取轴 helper，不从外部侵入图表实例。
- [ ] registerStatPlots 注册 violin，重复调用不重复注册事件或创建额外状态；按模块导入不会自动注册。
- [ ] 双组数据检验图例隐藏、真实 tooltip、800×600→420×320 resize、更新分组、导出、release。关闭动画比较轮廓；不得只校验配置字段。

**Run：** `npm test -- --runInBand __tests__/unit/violin.test.ts`；`npm run build`；`npm run test:browser -- --grep violin`。

**出口：** 新图形经公开扩展机制工作；与 density 独立计算的几何预期一致。若接口有缺口，单独说明最小上游修改及原因，再继续，禁止增加私有字段兜底。

### T3：分布族——直方图、KDE、ECDF、箱线

> histogram 的预计算输入与相关测试预期已由 [2026-10-08 原始样本重构计划](2026-10-08-histogram-raw-data.md) 覆盖；以下保留最初设计上下文，当前契约见子包文档。

**Files：** 分别创建 `src/plots/histogram/`、`kde/`、`ecdf/`、`box-plot/` 中的 `types.ts`、`compile.ts`、`validate.ts`；`__tests__/unit/distributions.test.ts`、`__tests__/browser/distributions.spec.ts`；四份同名 fixture/JSON 示例/逐图文档；追加 types 和分派。

**Produces：** `HistogramSpec`、`KdeSpec`、`EcdfSpec`、`BoxPlotSpec`；各自的 `compileHistogram/compileKde/compileEcdf/compileBoxPlot` 和同名 validate 函数，签名沿用第 3 节。

- [ ] 编写不等宽密度面积测试、箱重叠反例、ECDF 非单调反例、箱线五数次序反例；验证异常点并不改变须端点。

```ts
it('不等宽箱不能默认以计数高度绘制', () => {
  const result = validateStatPlot({
    type: 'histogram',
    data: [
      { binStart: 0, binEnd: 1, count: 2 },
      { binStart: 1, binEnd: 3, count: 2 }
    ]
  });
  expect(result.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ code: 'UNSUPPORTED_COMBINATION' })
  ]));
});
```

- [ ] histogram 使用真实箱边界映射到 VChart 连续轴，不以字符串类目模拟等距箱。上述 fixture 改 density 后高度应为 0.5、0.25，面积和 1；此预期写死在测试参考数据中，不能调用待测归一化函数生成期望。
- [ ] kde 以给定采样点线性连接，默认 density 从 0 起；不调用现有 histogram KDE append 工具，因为它面向直方图计数轴，不能替代独立密度语义。
- [ ] ecdf 使用右连续阶梯；重复 value 要求上游合并，不能因排序/插值改变分布。验证跳跃之间水平、跳点后的概率正确。
- [ ] boxPlot 映射 whiskerLow/whiskerHigh 到现有 minField/maxField，q1/median/q3 对应本体字段；whiskerRule 必填字符串作为说明，label/tooltip 不将须称为 min/max。验证 `whiskerLow <= q1 <= median <= q3 <= whiskerHigh`。
- [ ] 四类覆盖空、单组、多组、狭窄容器与主题；固定样本不依赖随机统计结果。

**Run：** `npm test -- --runInBand __tests__/unit/distributions.test.ts`；`npm run build`；`npm run test:browser -- --grep distributions`。

### T4：区间图与相关矩阵

**Files：** `src/plots/estimate-interval/{types,compile,validate}.ts`、`src/plots/correlation-matrix/{types,compile,validate}.ts`、`src/common/interval.ts`；`__tests__/unit/interval-matrix.test.ts`、`__tests__/browser/interval-matrix.spec.ts`；两份 fixture、示例与文档。

**Produces：** `EstimateIntervalSpec`、`CorrelationMatrixSpec`；`compileEstimateInterval`、`validateEstimateInterval`、`compileCorrelationMatrix`、`validateCorrelationMatrix`；`validateInterval(interval: Interval, path: string): StatPlotIssue[]` 供后续带状图复用。

- [ ] 区间图采用水平点区间默认布局，原生 common 的点/线系列组合；端帽以固定像素长度绘制，数据区间端点走同一数值比例尺，resize 不改估计值。系列数量不随记录数增长成每条记录一个独立 series。
- [ ] 明确 `valueScale?: 'linear' | 'log'`，默认 linear。log 模式所有界限、估计值及 reference 必须大于 0；拒绝 log 与非正值的组合。
- [ ] 校验 Interval 判别联合和 lower<=upper；不要错误排斥区间外的点估计。tooltip 展示 kind、level/multiplier；reference 只有传入时绘制。

```ts
it('置信区间必须说明水平', () => {
  const result = validateStatPlot({
    type: 'estimateInterval', interval: { kind: 'confidence' },
    data: [{ category: 'A', estimate: 1, lower: 0.5, upper: 1.4 }]
  });
  expect(result.valid).toBe(false);
});
```

- [ ] 相关矩阵检查唯一 row/column 键、完整笛卡尔单元格、对称值（固定浮点容差 1e-10）、对角为 1 或 null；method 必填；null 对称。
- [ ] 复用 heatmap；固定 [-1,1] 发散色标，triangle 只影响可见单元格，null 用独立纹理/颜色并有 tooltip。测试全正的小范围输入仍保持同一色标，不拉伸成强正负相关。
- [ ] 浏览器验证区间端帽、0/1 参考线、跨零范围、相关矩阵上/下三角、空值色；图形之外增加 tooltip 和 resize 断言。

**Run：** `npm test -- --runInBand __tests__/unit/interval-matrix.test.ts`；`npm run build`；`npm run test:browser -- --grep interval-matrix`。

### T5：P1 工程交付、可复现验证与生成资料

**Files：** 完成 `package.json` 脚本、`scripts/build-schema.ts` 的检查模式；创建 `scripts/check-examples.ts`、`__tests__/unit/examples.test.ts`、`__tests__/browser/lifecycle.spec.ts`、`benchmarks/run.mjs`、`benchmarks/fixtures.ts`、`docs/validation.md`；完善 README、docs/spec、docs/computation-contract；新增 `.github/workflows/statplots-test.yml`。

**Consumes：** P1 的 8 个公共 spec 和真实渲染结果。**Produces：** 可安装产物、可离线复现的验证报告、8 份完整 JSON 和分类型 Schema。

- [ ] 定义脚本：`build:schema` 生成；`check:schema` 在临时目录再生并比较已跟踪的生成物；`compile` 为 tsc；`test` 为 Node Jest；`test:browser` 为本包 Playwright；`check:examples` 校验并编译全部 examples/specs；`build` 先生成再编译和 bundle。把这些确切脚本写入 package.json，不依赖全局 rushx。
- [ ] 以测试证明误拼写 type、未知选项、字符串数值、null 非法位置均被拒绝。schema 与运行时对结构错误一致；跨字段错误由语义检查负责，文档不声称 JSON Schema 独自完成所有统计验证。
- [ ] 添加真实生命周期测试：连续 updateSpec 50 次，再 resize，再 release；检查实际图元数量/内容、tooltip 和事件触发次数；20 chart 页释放后无遗留 canvas/监听器引起的响应。
- [ ] 记录 10k 点、20 chart 的性能基准；P1 以 ROC 与等价原生 line 对照，小提琴单列密度采样点数，T7 加入散点对照。两侧使用相同规模、主题和动画设置，分离 compile/render/update/resize/release。不能拿静态模板的构造时间代替真实渲染。
- [ ] 中文文档明确每个字段单位、必填统计信息、默认显示、空值规则；展示 Python/JS 都只需产出同一 JSON，不创建计算服务。
- [ ] 安装包烟测 ESM/CJS/UMD 和类型声明；`npm pack --dry-run` 必须包含 schema 和示例需要的产物、不包含测试图片/临时目录。验证只有一份 VChart 引擎，重复注册不产生额外监听器。
- [ ] 新 CI job 使用 Node 22、仓库现有 native 依赖安装方式，构建上游依赖和新包，执行类型检查、Schema 漂移检查、单测和 Chromium 浏览器检查。不无条件改写现有 Node 18/20 job。
- [ ] 按第 7 节完成真实视觉审阅与仓库全量回归；在 docs/validation.md 写实际版本、命令、结果和无法执行的项。

**P1 出口：** 8 类均有可运行 JSON、独立统计预期、真实渲染与交互证据；专业图形无替代性简化；包能被直接安装和使用。此处可独立提交评审，不要求先完成 28 类。

## 5. P2 与 P3：复用已验证的统计原语

以下每个任务均包含自己的单元/浏览器测试、Schema 再生、JSON 示例和逐图文档，不把验证推迟到 P4。各图目录内固定为 types.ts、compile.ts、validate.ts。

### T6：计数、缺失、观测点与配对

**Files：** `src/plots/count/`、`missingness/`、`strip-plot/`、`paired/`；`__tests__/unit/observations.test.ts`、`__tests__/browser/observations.spec.ts`；同名 fixture/示例/docs。

**Produces：** `CountSpec`、`MissingnessSpec`、`StripPlotSpec`、`PairedSpec` 及 compile/validate 函数；stripPlot 的 layout 此时仅为 strip/jitter，尚不接受 swarm。

- [ ] 固化 count 比例按 series 内合计的预期、missingness 布尔单元格、配对重复键和单侧缺失反例；count 为非负整数，总数 0 的比例明确为空。
- [ ] count 使用从零开始的 bar；missingness 使用离散色并保持 observation 顺序，不套用连续相关色标。
- [ ] stripPlot 要求稳定 id；strip 无位移，jitter 对 id 做稳定哈希生成分类方向偏移，不移动数值坐标；spec 增加 `jitter?: number`（分类带宽比例，0–0.5，仅 jitter 模式允许）。
- [ ] paired 的 categories 必须恰好两个不同字符串，(id,category) 唯一；不完整配对保留已有点而不画连线，tooltip 明示缺一侧。

```ts
it('配对记录必须有唯一的样本与状态组合', () => {
  const result = validateStatPlot({
    type: 'paired', categories: ['before', 'after'],
    data: [
      { id: 'p1', category: 'before', value: 2 },
      { id: 'p1', category: 'before', value: 3 }
    ]
  });
  expect(result.errors).toEqual(expect.arrayContaining([
    expect.objectContaining({ code: 'DUPLICATE_KEY' })
  ]));
});
```

**Run：** `npm test -- --runInBand __tests__/unit/observations.test.ts`；`npm run build`；`npm run test:browser -- --grep observations`。图例筛选后检查实际显示记录；jitter 在相同尺寸下五次结果一致。

### T7：散点拟合、混淆矩阵、PR 与校准

**Files：** `src/plots/scatter/`、`confusion-matrix/`、`precision-recall/`、`calibration/`；`__tests__/unit/model-evaluation.test.ts`、`__tests__/browser/model-evaluation.spec.ts`；对应 fixture/示例/docs。

**Produces：** `ScatterSpec`、`ConfusionMatrixSpec`、`PrecisionRecallSpec`、`CalibrationSpec` 及 compile/validate 函数；复用 Interval 和概率轴。

- [ ] scatter 的主 data 为 x/y 点；fit 为独立数据与 method，lower/upper 成对存在且提供 interval。拟合线与原始点按 series 配色一致；没有 fit 就不拟合。
- [ ] 混淆矩阵要求完整实际/预测类别笛卡尔单元格、唯一键与非负 count。true 按 actual 行、predicted 按预测列、all 按全体归一；tooltip 同时保留 count 和比例，零分母结果为 null。
- [ ] PR 的 recall 单调不减，precision 只检查范围，不错误强制单调；默认线性连接、禁止曲线平滑。prevalence 在 [0,1] 时才绘制基准线，averagePrecision 只展示调用方输入。
- [ ] calibration 检查箱边界、meanPredicted 位于对应箱内、observedRate∈[0,1]、count>0，空箱由上游省略；区间在 [0,1] 内，不能把置信区间误画成拟合带。

```ts
it('PR 的 precision 可以随 recall 局部上升', () => {
  expect(validateStatPlot({
    type: 'precisionRecall',
    data: [{ recall: 0.1, precision: 0.8 }, { recall: 0.2, precision: 0.85 }]
  }).valid).toBe(true);
});
```

**Run：** `npm test -- --runInBand __tests__/unit/model-evaluation.test.ts`；`npm run build`；`npm run test:browser -- --grep model-evaluation`。

**P2 出口：** 累计 16 类；不存在把相关矩阵样式复用成混淆矩阵的语义错误；对外明确 stripPlot.swarm 尚未交付。

### T8：时间序列、季节与 ACF/PACF

**Files：** `src/plots/time-series/`、`seasonal/`、`autocorrelation/`；`__tests__/unit/time-series.test.ts`、`__tests__/browser/time-series.spec.ts`；对应 fixture/示例/docs。

**Produces：** `TimeSeriesSpec`、`SeasonalSpec`、`AutocorrelationSpec` 及 compile/validate 函数。

- [ ] 时间字符串必须带时区并可解析；每 series 时间严格递增。value=null 表示断开；lower/upper 同时缺失或成对提供，有带须有 interval。
- [ ] 时间统一成 UTC 时间戳传给 VChart 数值时间轴，格式化规则固定；不能转为字符串类目轴。跨时区等价时间判重，跨夏令时 fixture 固定预期。
- [ ] seasonal 的 periodOrder 必填且唯一，period 必须属于其中；overlay 以 season 区分曲线，subseries 按 season 分面且共享数值域；不擅自填补缺失周期。
- [ ] ACF/PACF 的 value 为有限数，lag 为唯一非负整数且递增；用 stem/point 表示，区间与零线共轴。显示完整的输入估计值及区间，不把超出 [-1,1] 的输入静默截断；不由 n 估算置信限。

```ts
it('没有时区的时间不能被宿主环境隐式解释', () => {
  expect(validateStatPlot({
    type: 'timeSeries', data: [{ time: '2026-01-01T12:00:00', value: 2 }]
  }).valid).toBe(false);
});
```

**Run：** `npm test -- --runInBand __tests__/unit/time-series.test.ts`；`npm run build`；`npm run test:browser -- --grep time-series`。

### T9：降维、残差、Q–Q、学习曲线与特征解释

**Files：** `src/plots/scree/`、`embedding/`、`residual/`、`qq/`、`learning-curve/`、`feature-importance/`；`__tests__/unit/diagnostics.test.ts`、`__tests__/browser/diagnostics.spec.ts`；对应 fixture/示例/docs。

**Produces：** `ScreeSpec`、`EmbeddingSpec`、`ResidualSpec`、`QqSpec`、`LearningCurveSpec`、`FeatureImportanceSpec` 及 compile/validate 函数。

- [ ] scree 的 component 为递增正整数，ratio∈[0,1]，总和≤1（容差 1e-10）；累计线用同一比例单位，不默认做两个任意缩放的 y 轴。
- [ ] embedding 的 method 必填，dimensions 可提供两个轴名称与可选解释率；解释率只允许 PCA。残差要求 residualKind，保留负值和零参考线。
- [ ] qq 的 theoretical/observed 成对且各自非递减；distribution 为必填说明，reference 的 slope/intercept 外供；未指定 reference 不伪造 y=x。
- [ ] learningCurve 的 trainSize 为正整数，(series,split,trainSize) 唯一；metric 为说明文本，不从字段自动判定分数越大越好。特征重要性保留用户顺序和负值，method 为必填说明。
- [ ] 所有可选上下界复用 Interval 约束；界限成对、lower<=upper，有数据就显示原始单位。

```ts
it('部分 PCA 成分累计解释率不足 100% 仍合法', () => {
  expect(validateStatPlot({
    type: 'scree', showCumulative: true,
    data: [
      { component: 1, explainedVarianceRatio: 0.5 },
      { component: 2, explainedVarianceRatio: 0.2 }
    ]
  }).valid).toBe(true);
});
```

**Run：** `npm test -- --runInBand __tests__/unit/diagnostics.test.ts`；`npm run build`；`npm run test:browser -- --grep diagnostics`。

**P3 出口：** 累计 25 类；时间轴、缺口和每一种诊断基准线都有独立预期，未计算的结果不在 tooltip 中出现。

## 6. P4：复杂几何、排布与多面板

### T10：Hexbin 原始散点输入与保形布局（2026-10-08 更新）

本节旧的“每箱 id/count/vertices 输入”和“允许非正六边形显示”决定已被用户确认的新方向覆盖。完整实施步骤、接口、坐标规则和验收见 [Hexbin 重构计划](2026-10-08-hexbin-raw-data.md)。其余图表计算职责不随本次变更扩大。

- [x] 公共输入改为 `data:[{x,y}]`，可选 `binning:{xBins:30}`；仅支持原始点模式，旧顶点 Spec 不兼容。
- [x] 编译阶段完成固定归一化和六边形分箱，内部生成 id/count/vertices，保留所有重复观测并保证总数守恒。
- [x] 用专用 Layout 保持归一化网格等比例映射，实际显示为正六边形；原生轴和 Tooltip 仍使用原始单位。
- [x] resize/主题/配色不改变分箱归属和计数；data/xBins 更新才重新计算。
- [x] 同步 Schema、示例、目录、计算契约和中文说明；测试实际边长/角度、边界归属、Tooltip 更新及大数据生命周期。

### T11：真正的蜂群布局与 SHAP 蜂群

**Files：** `src/layout/swarm.ts`；`src/series/swarm/{interface,swarm,tooltip,index}.ts`；`src/plots/shap-beeswarm/{types,compile,validate}.ts`；修改 `src/plots/strip-plot/` 增加 swarm；`__tests__/unit/swarm.test.ts`、`__tests__/browser/swarm.spec.ts`；对应 fixture/示例/docs。

**Produces：** `ShapBeeswarmSpec`、compileShapBeeswarm/validateShapBeeswarm、`registerSwarmSeries(): void`；内部 series type `statplotsSwarm`；共用纯布局函数：

```ts
interface SwarmPoint { id: string; valuePosition: number; radius: number }
interface SwarmPlacement { id: string; offset: number }
interface SwarmLayoutResult { placements: SwarmPlacement[]; overflow: boolean }
export declare function layoutSwarm(points: readonly SwarmPoint[], halfWidth: number): SwarmLayoutResult;
```

- [ ] 单测使用显式点坐标：稀疏点无偏移，相同数值点沿分类方向排布，改变输入顺序不改变同一 id 的结果；相邻点中心距满足半径和。
- [ ] 按 valuePosition 与稳定 id 排序；用局部活动窗口/空间索引限制碰撞候选。实际像素坐标仅在布局/尺寸或数据变化时计算，鼠标 hover 不重新排布。
- [ ] 高密度容量不足时设置 overflow，保留所有点并显示明确的拥挤提示；不随机抖动冒充 swarm，不静默采样。不保证有限带宽内容纳任意多个相同值点而无重叠。
- [ ] SHAP 检查 (id,feature) 唯一；同 feature 内按 featureValue 的已提供范围做颜色归一化；常量值用中性色，null 用缺失色；图例说明为每个特征的相对高低，不暗示跨特征单位一致。x 仅使用 shapValue，featureOrder 必填。

```ts
it('容量不足被显式报告', () => {
  const result = layoutSwarm([
    { id: 'a', valuePosition: 100, radius: 4 },
    { id: 'b', valuePosition: 100, radius: 4 }
  ], 0);
  expect(result.overflow).toBe(true);
  expect(result.placements).toHaveLength(2);
});
```

**Run：** `npm test -- --runInBand __tests__/unit/swarm.test.ts`；`npm run build`；`npm run test:browser -- --grep swarm`；更新性能基准，记录 10k 点与极端重复值案例。

### T12：Pair Plot 的共轴布局与联动

> 以下 diagonal 预计算输入为历史设计，已由 [2026-10-08 重构计划](2026-10-08-pair-plot-diagonal.md) 替代。当前只输入 observations，顶层 diagonal 为可选展示配置。

**Files：** `src/plots/pair-plot/{types,compile,validate}.ts`、`src/layout/pair-grid.ts`、`__tests__/unit/pair-plot.test.ts`、`__tests__/browser/pair-plot.spec.ts`；对应 fixture/示例/docs。

**Produces：** `PairPlotSpec`、compilePairPlot/validatePairPlot；common/grid 原生 spec，使用标准 brush/region 联动机制。

- [ ] variables 至少两个且唯一，observations 的 id 唯一，values 键必须与 variables 一致；number/null；每变量一份 diagonal bins，不重复、不缺失。有 series 时，各变量 bins 按 series 提供，箱计数和须等于该变量/series 的非空观测数。
- [ ] 计算每变量统一数值域；同一变量在不同格子的范围一致；对角使用给定 bins，非对角使用对应观测列。数据按列缓存，避免给每个格子深拷贝完整观测表。
- [ ] 缺失值仅影响相关面板，分别显示有效 n；不在矩阵外对整行预先丢弃。每个点保留 id，跨面板选择按 id 联动。
- [ ] 使用真实刷选动作检查其他格子对应点的状态，改变刷选目标必须改变结果；resize 后刷选区域与标记坐标仍一致。

```ts
it('不能遗漏对角线的统计结果', () => {
  expect(validateStatPlot({
    type: 'pairPlot', variables: ['a', 'b'],
    data: {
      observations: [{ id: 'p1', values: { a: 1, b: 2 } }],
      diagonal: [{ variable: 'a', bins: [{ binStart: 0, binEnd: 2, count: 1 }] }]
    }
  }).valid).toBe(false);
});
```

**Run：** `npm test -- --runInBand __tests__/unit/pair-plot.test.ts`；`npm run build`；`npm run test:browser -- --grep pair-plot`；测量 4/8 个变量与 1k/10k 观测的首绘、更新和刷选，报告格子数量和总绘制点数。

### T13：全部 28 类验收与 skill 输入资料

**Files：** `docs/chart-catalog.md`、`docs/skill-integration.md`、`docs/validation.md`、`examples/specs/`、`schema/plots/`；`__tests__/unit/catalog.test.ts`、`__tests__/browser/catalog.spec.ts`。

**Produces：** 覆盖 28 类及所有承诺变体的目录、可执行 spec、Schema 和错误样例；不创建或修改实际 skill。

- [ ] 按设计表逐项核对图表、变体和统计语义；不能把 strip 替代 swarm、scatter 替代 hexbin、一般热图替代相关矩阵计为通过。
- [ ] 每个 type 至少提供 minimal、grouped（支持时）和 invalid 示例；manifest 记录文件名、type、需要预计算的统计量、适用场景。目录测试读取 manifest、Schema 和示例，确保没有宣传了但未导出的类型。
- [ ] skill 指南固定流程：选择 type → 准备语义字段 → 提供必要统计说明 → validate → render；错误返回使用 code/path 修正输入。仅按选择的 type 加载 Schema 和示例，不把完整 VChart API 塞进提示词。
- [ ] 提供两条手工核验链：Python 预计算文件载入 HTML、浏览器端已有计算结果更新同一 chart；两条链均使用相同 StatPlotSpec，不实现新 provider。
- [ ] 全类型浏览器套件、全部 schema/example 检查及性能场景通过后，复核截图和统计含义，输出完成/未完成清单，不用一个“28/28 可编译”替代图形质量评审。

```ts
it('目录中每个示例都是可编译的公共输入', () => {
  for (const example of catalogExamples) {
    expect(validateStatPlot(example.spec).valid).toBe(true);
    expect(() => compileStatPlot(example.spec)).not.toThrow();
  }
});
```

`catalogExamples` 由本任务的 catalog.test.ts 从 `examples/specs/index.json` 清单读取，类型为 `{ name: string; spec: StatPlotSpec }[]`；清单只包含有效可渲染示例，invalid 示例存放独立清单并断言失败。

## 7. 验证命令与证据规则

### 新包检查

以下脚本由 T1/T5 创建后才可运行；本计划编写阶段未执行它们。

```sh
# 仓库根目录，首次创建包或修改依赖后。
node common/scripts/install-run-rush.js update
node common/scripts/install-run-rush.js build --to @visactor/vchart-statplots

# 包目录。
npm run check:schema
npm run compile
npm test -- --runInBand
npm run check:examples
npm run build
npm run test:browser
npm pack --dry-run
```

浏览器套件复用仓库已有 Playwright 版本及确定性设置：Chromium、DPR 1、UTC、en-US、Arial、关闭动画、等待字体与稳定绘制。新包的 page.html 加载两个本地产物；禁止 CDN、网络数据和远程字体。报告和截图保存于根 `.vchart-statplots/`，有序记录输入、实际值和失败阶段。

首版截图没有本包历史基线：先用独立的几何/统计断言检验，再审阅布局和文字，保留验收证据；不得以刚生成的图自行对照就声称视觉正确。之后可对已审阅发布版本比较，差异必须解释。新增交互检查用抑制动作的反例证明断言有效。

### VChart 核心回归

仓库根目录：

```sh
node packages/vchart/scripts/visual-test.mjs --check
node packages/vchart/scripts/visual-test.mjs
```

默认全量是每个 PR 的提交前检查，比较本地工作区与官方 develop；阅读 `agent-summary.md` 与必要的三图报告，说明所有差异。没有核心改动时也遵守仓库要求。

如果实现中需要修正 VChart 公开扩展契约，再为该改动新增核心 case：登记 `packages/vchart/__tests__/visual/cases/index.mjs` 并更新用例指南；五轮自比较稳定，再运行默认基线定向比较和全量。case 不能导入新包/当前 VChart 源码来绕过 runner 的双产物隔离；无法在旧基线运行的新接口要如实标注，不跳过、不放宽阈值。独立新增 case 不写 `BugServer case IDs` 行。

### 每期评审材料

- 已交付的 type 和变体列表；与设计的差异及理由。
- 至少一份能复制使用的完整 JSON；错误示例含 code/path。
- 真实执行命令、依赖版本、测试结果、截图位置与未完成项。
- 统计语义和实际渲染证据；性能数据包含输入规模与环境。
- API、生成 Schema 与分类型文档保持一致；没有未实现类型占位。

## 8. 本计划自检

- [x] 用户选择的全部 28 类已映射到阶段，strip/swarm 与 ACF/PACF 等变体没有遗漏。
- [x] spec、数据契约、计算边界和 VChart 生命周期分别定义。
- [x] 每个实施任务包含具体文件、接口、语义反例与验证命令。
- [x] 包注册、版本、构建、Schema、CI、浏览器验收与 skill 资料均有任务承接。
- [x] 区分“核心视觉回归通过”和“新包图形验收通过”。
- [x] 计划编写阶段仅新增文档；现已完成子包实现，验收状态以文首链接为准。
