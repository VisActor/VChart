# vchart-statplots：数据科学图表设计

日期：2026-09-29。状态：已按用户指令实现 P1–P4；实际契约与验收见 [子包文档](../../../packages/vchart-statplots/README.md)。

## 1. 目标与边界

在当前 Rush 仓库新增 `packages/vchart-statplots`，发布名为 `@visactor/vchart-statplots`。覆盖已讨论的 28 类数据科学图表，按四期交付，同时服务 Python 分析后的 HTML 报告和独立网页。

核心价值是：把明确的统计结果稳定地画成专业图表，让使用者和 skill 描述“要表达什么”，由库处理系列组合、坐标轴、标注、图例、tooltip 和交互。

本包负责：

- 统计图表的语义 spec、TypeScript 类型、JSON Schema 和输入错误诊断。
- 分箱结果、密度采样点、区间、模型评价曲线等统计结果的可视化。
- 与显示直接相关的确定性运算，例如比例归一化、直方图密度换算、分类位置、蜂群排布。
- 图形完整性、合理默认值、尺寸变化、更新、导出和可解释的提示信息。

本包首轮不负责：KDE 估计、bootstrap、回归拟合、相关系数计算、PCA、聚类、SHAP 求值、模型训练、Python 执行或后端服务。Python 与浏览器 JavaScript 均可生产同一输入格式；网页参数变化后由调用方重新计算，再提交新 spec。计算 provider 和 skill 的实现不列入本次子包任务。

## 2. 架构选择

| 方案 | 收益 | 代价 | 决策 |
| --- | --- | --- | --- |
| 直接暴露 VChart spec 和若干模板 | 启动快 | skill 仍需理解 series、region、mark 和统计配色约束 | 不作为公共接口 |
| 语义 spec → 编译为 VChart spec，缺失图形使用定向扩展系列 | 小接口；复用 VChart 生命周期；统计语义集中 | 需要维护编译器、类型和少量扩展系列 | **采用** |
| 所有图表都注册成新的 VChart chart，复用其完整配置接口 | 可以直接 `new VChart(statSpec)` | 容易继承过多通用配置；图表命名、类型和统计接口耦合 | 仅参考其扩展机制，不逐图照搬 |

执行路径：

```text
Python / JavaScript 计算结果
            ↓
       StatPlotSpec（JSON）
            ↓
  结构检查 → 统计语义检查 → 图表编译器
            ↓
     VChart ISpec + 已注册的专用系列
            ↓
     VChart render / updateSpec / resize / release
```

优先使用现有 line、area、rangeArea、boxPlot、heatmap、scatter、common 和组件。只有现有系列无法清楚表达的图形才增加专用系列：首期的小提琴、后期的蜂群和 Hexbin。专用系列使用 VChart 已导出的 `CartesianSeries`、`Factory`、mark 和 tooltip 扩展接口；禁止从外部访问实例私有字段来拼接图元。

不新增一套 chart 实例包装器、状态管理器、事件总线或自动计算引擎。

## 3. Spec 原则

### 3.1 一种含义只有一种写法

采用**固定语义字段的数据记录**，而非用户自由指定列名后再配一层映射。

```json
{
  "type": "roc",
  "title": "模型区分能力",
  "data": [
    { "fpr": 0, "tpr": 0 },
    { "fpr": 0.08, "tpr": 0.72 },
    { "fpr": 1, "tpr": 1 }
  ]
}
```

`fpr`、`tpr` 已经决定轴的含义、范围和默认标题。skill 不需要再写 `xField`、`yField`、`series`、`region` 或对角参考线。

取舍：现有业务表需要一次字段映射；换来更短的图表 spec、更小的生成空间和更明确的校验。数据准备端使用 `map` 或 DataFrame 列重命名即可。首版不同时支持“标准字段”和“任意字段映射”两套输入。

### 3.2 公共规则

| 项目 | 约定 |
| --- | --- |
| 类型名称 | lowerCamelCase，使用统计名称，如 `estimateInterval`、`correlationMatrix`、`precisionRecall` |
| 最小结构 | `type`、`data`；只有不能可靠推断的统计信息才额外必填 |
| 主数据 | 单表图使用 `data: Row[]`；确需多张表的 `pairPlot` 使用明确命名的 `data` 对象 |
| 分组 | 支持多系列的类型声明可选 `series: string`；有分组时，同一主数据表的所有行均提供；分类轴使用 `category`，不与 series 混用 |
| 记录标识 | 可选 `id: string`；蜂群、配对图及需要跨图选中的观测点要求稳定 id |
| 数值 | 有限 number；概率使用 0–1；数量使用非负整数，权重另设独立契约，不混入 count |
| 缺失 | 仅在类型明确允许处使用 `null`；表示未知或缺口，不表示 0 |
| 标签 | `title?: string`、`description?: string`、`labels?: {语义字段: string}`；labels 只改文案，不改变绑定 |
| 主题 | `theme?: 'light' \| 'dark'`，默认 light；直接使用 VChart 原生主题，辅助色读取原生语义色，不额外注册主题 |
| 尺寸与生命周期 | 使用 VChart 构造参数和原生实例 API，不放入统计 spec |
| 排序 | 默认保留分类首次出现顺序；有 `order` 的类型可显式指定完整分类顺序；连续曲线保持给定顺序并检查单调性 |
| 输入严格性 | 禁止未知配置字段；不接受函数、NaN、Infinity、Date 对象和自动猜测的字段 |
| 扩展 | 按 type 定义选项，不提供万能 `options`、`vchart` 或 `customMark` 透传入口 |

`labels` 的键由具体图表类型约束，例如 ROC 为 `fpr`、`tpr`，区间图为 `category`、`estimate`；不使用任意字符串索引签名放开配置。业务附加信息需要先明确用途再纳入契约。

### 3.3 统计信息必须显式

区间图：

```json
{
  "type": "estimateInterval",
  "title": "处理效应",
  "interval": { "kind": "confidence", "level": 0.95 },
  "reference": { "value": 0, "label": "无效应" },
  "data": [
    { "category": "方案 A", "estimate": 0.32, "lower": 0.12, "upper": 0.51 },
    { "category": "方案 B", "estimate": -0.08, "lower": -0.21, "upper": 0.06 }
  ]
}
```

- `confidence`、`prediction`、`credible` 必须给出 `level`，且 `0 < level < 1`。
- `standardError`、`standardDeviation` 必须给出正数 `multiplier`；`range` 不接受 level。
- 必须满足 `lower <= upper`，不一概要求 estimate 落在区间内。
- 库不替用户计算区间，不把任意上下界自动称作 95% CI。
- 没有 reference 就不添加默认“无效应”线；比值效应可显式传 1。

相关矩阵：

```json
{
  "type": "correlationMatrix",
  "method": "pearson",
  "triangle": "lower",
  "data": [
    { "row": "年龄", "column": "年龄", "value": 1 },
    { "row": "年龄", "column": "收入", "value": 0.42 },
    { "row": "收入", "column": "年龄", "value": 0.42 },
    { "row": "收入", "column": "收入", "value": 1 }
  ]
}
```

输入提供完整矩阵，triangle 仅控制显示；检查对称性和重复单元格。色域固定为 [-1, 1]，以 0 为发散色中心。`null` 单独显示为不可计算；不当作零相关。method 必填为 pearson、spearman 或 kendall；不从数据推断。

小提琴图：

```json
{
  "type": "violin",
  "widthScale": "width",
  "data": [
    { "category": "A", "value": 0, "density": 0 },
    { "category": "A", "value": 1, "density": 0.5 },
    { "category": "A", "value": 2, "density": 0 }
  ]
}
```

输入是已计算好的密度采样点；这里只为说明字段，正式示例使用足够密集的采样网格。`widthScale: 'width'` 表示各组最大宽度相同，`'area'` 表示显示面积归一化相同，默认 width；首版不提供样本量宽度，避免缺少 n 时误导。两种模式均不重新做 KDE，保留数值轴和真实密度 tooltip；不把轮廓面积解释为样本量。

### 3.4 归一化属于显示语义

直方图输入为 `{ binStart, binEnd, count, series? }`，不接收原始样本或 `bins: 20`。区间必须递增且不重叠，零频次箱也保留，输入覆盖本次统计样本。

- `normalization: 'count'`：高度为 count，默认值，仅接受等宽箱。
- `'probability'`：每组高度为 count / 该组总数，仅接受等宽箱。
- `'density'`：每组高度为 count / 该组总数 / 箱宽，允许不等宽箱；总面积为 1。
- 总数为 0 时显示空数据状态，不除以零；不自动换 normalization。

ECDF 输入 `{ value, probability, series? }`，以右连续阶梯表示，每组 value 严格递增、probability 单调不减且位于 [0, 1]。不能用平滑折线，不补造未经提供的观测。

## 4. 全部 28 类路线图

表中的字段为每行数据，`?` 表示可选；公共 series、id 按前述规则使用。输入契约用于确定各期边界，尚未交付的类型不导出到可执行类型联合或 Schema。

| # | 图表类别 / type | 主要输入与选项 | 渲染与关键验收 | 阶段 |
| --- | --- | --- | --- | --- |
| 01 | 计数/比例柱 `count` | category、count；normalization=count/proportion | bar；比例按 series 内总数归一化，轴从 0 起，不把百分数当 0–100 输入 | P2 |
| 02 | 缺失矩阵 `missingness` | observation、variable、missing:boolean | heatmap；类别配色，保留行顺序，未知不等于 missing=false | P2 |
| 03 | 直方图 `histogram` | binStart、binEnd、count；normalization | histogram/bar；连续轴、真实箱宽、面积语义 | P1 |
| 04 | 核密度图 `kde` | value、density；可选 estimation={kernel,bandwidth} 为结果说明 | line/area；density≥0、不重新估计、不做改变峰值的曲线平滑 | P1 |
| 05 | 经验分布 `ecdf` | value、probability | line；右连续阶梯，概率轴 [0,1] | P1 |
| 06 | 箱线图 `boxPlot` | category、q1、median、q3、whiskerLow、whiskerHigh、outliers?:number[]；whiskerRule 为必填说明 | boxPlot；不将须端点一概解释为数据最小最大值，tooltip 使用正确名称 | P1 |
| 07 | 小提琴 `violin` | category、value、density；widthScale | 专用系列；真实对称密度轮廓，缩放后不漂移，不伪装成箱线图 | P1 |
| 08 | 条带/蜂群 `stripPlot` | id、category、value；layout=strip/jitter/swarm | scatter + 后期蜂群系列；抖动只沿分类轴且确定，swarm 有真实碰撞排布 | P2 条带/抖动，P4 蜂群 |
| 09 | 点估计与区间 `estimateInterval` | category、estimate、lower、upper；interval、reference? | common；点、区间线、端帽、参考线，支持跨 0 和比值 log 轴 | P1 |
| 10 | 配对/斜率 `paired` | id、category、value；categories 为两个有序状态 | line+point；按 id 配对，缺一侧不错误连到别的样本 | P2 |
| 11 | 散点与拟合 `scatter` | x、y；fit?={method,data:[{x,estimate,lower?,upper?,series?}],interval?} | scatter+line+rangeArea；拟合结果外供，有 band 才要求 interval | P2 |
| 12 | 六边形分箱 `hexbin` | id、count、vertices:[{x,y}]；每箱六个有序数据坐标顶点 | 专用多边形系列；上游预分箱，使用真实边界而非按 count 调整符号大小 | P4 |
| 13 | 相关矩阵 `correlationMatrix` | row、column、value:number/null；method、triangle | heatmap；[-1,1] 发散色，未知单元格独立样式，无自动聚类或显著性推断 | P1 |
| 14 | 散点矩阵 `pairPlot` | variables；data={observations:[{id,values,series?}],diagonal:[{variable,bins}]} | common+grid；每变量共享轴域，对角使用给定箱，按 id 联动 | P4 |
| 15 | 时间线与带 `timeSeries` | time、value:number/null、lower?、upper?；interval? | line+rangeArea；time 为带时区 ISO 字符串，缺口断开，带与主线共轴 | P3 |
| 16 | 季节/子序列 `seasonal` | period、season、value；periodOrder；layout=overlay/subseries | line/common+grid；显式周期顺序和跨面板一致刻度 | P3 |
| 17 | ACF/PACF `autocorrelation` | lag、value、lower?、upper?；method=acf/pacf、interval? | stem+point+band；lag 非负整数，零线，区间外供 | P3 |
| 18 | 碎石/累计方差 `scree` | component、explainedVarianceRatio；showCumulative=true/false | bar+line；累计值仅为比率累加，统一 [0,1] 量纲 | P3 |
| 19 | 降维散点 `embedding` | id、x、y；method=pca/tsne/umap；dimensions? | scatter；明确嵌入轴名称，PCA 解释率只能展示传入值 | P3 |
| 20 | 残差 `residual` | id、fitted、residual；residualKind=raw/standardized/studentized | scatter+零线；不自动标准化、不把散点连接成线 | P3 |
| 21 | Q–Q `qq` | theoretical、observed；distribution；reference?={method,intercept,slope} | scatter+参考线；分位点和拟合线外供，不自动画 y=x | P3 |
| 22 | 混淆矩阵 `confusionMatrix` | actual、predicted、count；normalization=none/true/predicted/all | heatmap；固定实际行为 y、预测列为 x，零分母为未定义而非 0% | P2 |
| 23 | ROC `roc` | fpr、tpr、threshold?；metrics?:[{series?,auc}] | line+对角线；[0,1] 双轴，无平滑，AUC 仅展示输入值 | P1 |
| 24 | PR `precisionRecall` | recall、precision、threshold?；prevalence?、metrics?:[{series?,averagePrecision}] | line；坐标 [0,1]，有 prevalence 才画基准线，AP 不等于梯形 PR-AUC | P2 |
| 25 | 校准 `calibration` | binStart、binEnd、meanPredicted、observedRate、count、lower?、upper?；interval? | point+line+对角线；保留分箱边界和样本数，禁用平滑 | P2 |
| 26 | 学习曲线 `learningCurve` | trainSize、split=train/validation、score、lower?、upper?；metric、interval? | line+rangeArea；样本量轴，训练/验证清楚区分，区间含义可追溯 | P3 |
| 27 | 特征重要性 `featureImportance` | feature、importance、lower?、upper?；method、interval? | 横向 bar/point+interval；显式方法，保留负值，不暗示因果 | P3 |
| 28 | SHAP 蜂群 `shapBeeswarm` | id、feature、shapValue、featureValue:number/null；featureOrder | 专用蜂群；位置=SHAP 值，颜色=特征内相对值，不能用同一数值同时编码两者 | P4 |

复合数据补充：pairPlot 的 `values` 是按 variables 声明名称组成的数值/空值记录；diagonal 的 bins 使用直方图的 binStart、binEnd、count 和可选 series。每个变量必须有一份分箱结果，有分组时覆盖观测中的所有系列。缺失观测在涉及该变量的面板中排除，并展示该面板有效样本数；不做整行默认删除。分类 SHAP 特征首轮不接受混入数值 featureValue，需后续明确独立色标契约；其唯一记录键是 (id,feature)，同一观测 id 可出现在多个特征行。

阶段出口：

- **P1：8 类统计核心。** histogram、kde、ecdf、boxPlot、violin、estimateInterval、correlationMatrix、roc。验证分布、区间、矩阵、模型评价与新图形能力。
- **P2：8 类常用分析。** count、missingness、stripPlot 的 strip/jitter、paired、scatter、confusionMatrix、precisionRecall、calibration。累计覆盖 16 个类别，蜂群变体尚未完成。
- **P3：9 类诊断与时间分析。** timeSeries、seasonal、autocorrelation、scree、embedding、residual、qq、learningCurve、featureImportance。累计覆盖 25 个类别。
- **P4：3 类复杂图及蜂群变体。** hexbin、pairPlot、shapBeeswarm 和 stripPlot.swarm。至此完成 28 类及表中承诺的变体。

## 5. 公共 API 与兼容性

```ts
import VChart from '@visactor/vchart';
import { compileStatPlot, registerStatPlots } from '@visactor/vchart-statplots';
import type { StatPlotSpec } from '@visactor/vchart-statplots';

registerStatPlots(); // 应用启动时调用；幂等，注册本包专用系列。

const spec: StatPlotSpec = {
  type: 'roc',
  data: [{ fpr: 0, tpr: 0 }, { fpr: 0.08, tpr: 0.72 }, { fpr: 1, tpr: 1 }]
};

const chart = new VChart(compileStatPlot(spec), { dom: 'chart' });
await chart.renderAsync();
await chart.updateSpec(compileStatPlot({ ...spec, title: '更新后的模型评价' }));
await chart.resize(900, 600);
chart.release();
```

承诺的三个函数：

```ts
export declare function compileStatPlot(spec: StatPlotSpec): ISpec;
export declare function validateStatPlot(input: unknown): ValidationResult;
export declare function registerStatPlots(): void;

type ValidationResult =
  | { valid: true; errors: [] }
  | { valid: false; errors: StatPlotIssue[] };

interface StatPlotIssue {
  code: 'SCHEMA_ERROR' | 'INVALID_RANGE' | 'INVALID_ORDER'
    | 'DUPLICATE_KEY' | 'INCONSISTENT_SERIES' | 'UNSUPPORTED_COMBINATION';
  path: string; // JSON Pointer，例如 /data/3/tpr
  message: string;
}
```

`compileStatPlot` 在边界执行相同检查；失败抛出导出的 `StatPlotValidationError`，其 `issues` 为上述数组。内部使用已校验类型，不逐图元重复校验。预先调用 validate 只用于需要把错误反馈给 skill 的场景，普通调用方只调用 compile。

输入必须可 JSON 序列化；编译结果是运行时 VChart spec，可以含库内部的格式化函数，不承诺 JSON 往返。需要存储或传输时保存原始 StatPlotSpec。

只承诺语义 spec 的稳定性，不承诺编译后 series ID、数据集布局或辅助字段稳定。更新以 `updateSpec(compileStatPlot(next))` 为标准方式；不承诺直接向生成的数据集 `updateData` 后仍维护统计约束。事件、导出使用 VChart API；tooltip 和数据事件保留语义字段及观测 id，辅助参考线使用可区分的 role。

高级开发者可以修改编译结果，但这些修改不纳入统计正确性保证，也不进入 skill 的默认生成协议。

## 6. 工程落点

- 以当前 HEAD `d169be9f3` 为调研基准；实施前重新核对工作区版本。
- 新项目登记 `rush.json`，使用现有 `vchartMain` lockstep 策略；当前为 2.1.7，实施时从策略文件读取，不单独声明 0.1.0。新增包的发布策略如需独立版本，应作为单独决策。
- `@visactor/vchart` 使用 peerDependency，开发构建使用同版本 workspace devDependency；首版仅承诺与同次仓库发布版本兼容。打包 external 化，UMD 使用宿主 `VChart`，避免第二份渲染引擎和注册表。
- 产物与 extension 包对齐：`esm/`、`cjs/`、`build/index.js`、`build/index.min.js`、类型声明；UMD 全局名 `VChartStatPlots`，另发布 `schema/statplot.schema.json` 和按类型拆分的 Schema。
- Node.js 22、TypeScript 4.9.5、仓库现有 bundler 和 ESLint。浏览器与无 DOM 的 Node 编译/校验均可使用；Node 直接出图不是首轮承诺。
- TypeScript 判别联合为唯一结构定义，使用仓库 `@internal/typescript-json-schema` 生成 Schema。使用严格空值检查、required 和 noExtraProps；禁止 ignoreErrors。
- Ajv 8.12 系列仅为开发依赖，构建时生成 standalone 校验函数，检查不引入浏览器运行时编译和 eval。统计关系检查按图表编写。生成物检查防止 TS、Schema 和运行时结构校验漂移。
- 不依赖 Python 或 vchart-extension 整包，不重构 VChart 热路径，不直接修改已有 multivariate-analysis skill。

实际参考：`packages/vchart-extension` 的打包、candlestick 扩展；`packages/vchart/src/series/box-plot`、`range-area`；`packages/vchart-schema` 和 `tools/typescript-json-schema`；仓库本地视觉测试指南。

## 7. 专业性与验收底线

1. **统计正确。** 正确量纲、基准线、排序、归一化、缺失处理、区间名称和色域；没有输入的统计量不编造。
2. **图形完整。** 小提琴有密度轮廓；区间有端帽；ECDF 是阶梯；Hexbin 按真实六边形；蜂群真正排布。
3. **交互正确。** 隐藏/显示 series 后，图形、tooltip 和图例一致；resize 后布局有效；更新无旧数据残留；release 清理资源。
4. **复杂度清楚。** 计算/归一化在编译或必要的布局变更时完成；不在每次鼠标移动中重新统计、建索引或重建所有数组。蜂群不得对全体点做无界两两碰撞扫描。
5. **大数据有证据。** 固定 seed 测量 10k 点、20 个 chart 的首绘、更新、resize、release；与相同基础 VChart 图形比较，记录硬件、版本和 p50/p95。复杂图另列输入规模，不以无依据的固定毫秒数保证性能。
6. **生成可靠。** 每个已发布 type 至少一份完整可执行 JSON 示例、一个无效输入示例和一页输入说明；Schema 校验、TS 示例编译、真实渲染同时通过。

第一版即验证 light/dark、中文长标签、空数据、单组/多组、零值、负值、狭窄容器和高密度点。不承诺所有图在任意小容器下都显示完整文字；不足时保持正确绘图区并可通过 tooltip 读取值，不错误压缩数值轴。

视觉检查分为两部分：新包使用自己的构建执行端到端、几何断言及可审阅截图；VChart 核心按 AGENTS 要求执行官方 develop 基线全量回归。现有核心视觉 runner 只加载 VChart 产物，不能把它的通过写成“新包全部图形已验证”。首版没有本包历史视觉基线，应明确报告该限制，以人工审阅与独立几何预期建立首份证据；自比较只能证明确定性。

## 8. 实现前需验证的风险

| 风险 | 尽早验证方式 | 失败时处理 |
| --- | --- | --- |
| 专用系列的类型、tooltip、legend 和 resize 接入 | 在 P1 先完成一个双组 violin 纵向切片，覆盖真实更新与导出 | 优先修正扩展契约；若缺公开接口，提出最小 VChart 接口改动，不访问私有状态 |
| 生成器对联合类型、严格对象和空值的支持 | 首个 ROC 契约同时跑 TS、Schema、standalone 反例 | 修正生成配置或现有生成器，不手写第二份完整结构 |
| 同一进程加载两份 VChart | 对打包产物、真实安装和重复注册做检查 | 调整 peer/external，不能在包内偷偷创建第二个注册表 |
| 蜂群的容量与窗口宽度 | 10k 点、密集单组、resize 测量 | 定义显式溢出提示；不自动变成 jitter，不丢点冒充无重叠 |
| 28 类扩张冲淡首期质量 | 各期只导出已通过验收的类型，按表核对变体 | 未通过的类型保留在路线图，不对外标记支持 |

配套实施任务见 [实现计划](../plans/2026-09-29-vchart-statplots.md)。
