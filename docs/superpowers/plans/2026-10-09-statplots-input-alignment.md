# StatPlots 输入层级优化实施计划

> **For agentic workers:** 在当前会话按阶段执行，每阶段独立验证和审阅；以复选框记录进度。用户已授权执行源码改造和本地提交；发布仍需后续指令。不委派代理。

**Goal:** 将缺失判断、相关性、分组估计区间、普通残差和交叉验证分数汇总放到编译阶段，让调用方提交实际持有的样本或预测，同时保留明确的外部模型结果展示用途。

**Architecture:** 公共 spec 用明确字段表达输入语义；多用途图用 input 判别联合区分契约。vutils 提供通用数值算法，StatPlots 完成表格校验、分组、缺失配对和私有结果生成，再交给现有 VChart 显示工具。

**Tech Stack:** TypeScript 4.9.5、VChart、vutils、JSON Schema/AJV、Jest、Playwright；Node.js 22。Python 只用于离线对照，不参与运行。

**状态：** 五类改造和本地源码联调完成；发布依赖与 PR 前全量原生视觉验收未完成。用户已选择 pointIntervalPlot 保留原始样本和外部估计两种用途。

## 一、范围与方案选择

推荐按图义补齐计算入口，分成五个可独立交付的子项目：missingValueMatrix、correlationMatrix、pointIntervalPlot、residualPlot、learningCurve。模型训练、PCA/UMAP/t-SNE、SHAP 和重要度计算保持外部职责。

| 方案 | 取舍 | 决定 |
| --- | --- | --- |
| 所有图强制从训练数据开始计算 | 会把模型训练和推断引入图表包，无法覆盖调用方任意模型 | 不采用 |
| 结果输入保持原样，仅补转换示例 | 最小绘图调用仍必须先完成统计，不能解决当前问题 | 不采用 |
| 按图义提供计算入口，对真实外部结果用途使用显式模式 | 计算范围清楚，可独立验证；部分契约需要迁移 | 采用 |

missingValueMatrix 和 correlationMatrix 替换原结果输入，不维持隐式旧格式。pointIntervalPlot 保留外部区间是用户明确选择；residualPlot 保留标准化/学生化等模型残差，learningCurve 保留外部汇总分数。这些模式分别表达不同的有效用途，不从字段形状猜测输入。

本轮不改变已经完成的 histogram、KDE、ECDF、box、violin、count、分类评估、QQ、ACF 等输入。尤其不重新引入 histogram 多系列。KDE 带宽、小提琴归一化等 Python 默认值差异继续准确记录，不在本轮偷偷更改。

## 二、全局契约

- 中文文档；沿用现有公开入口、Schema 生成流程、主题、色板和矩阵显示工具。
- 有限数字在公共边界检查；明确允许的 null 才表示缺失。不把空字符串、false、0、缺少键、undefined 或数值字符串自动转换为缺失/数值。
- 不修改输入数组、对象、排序和配色；原始重复观测保留。series 沿用全表全部提供非空名称或全部省略的规则。
- 各阶段独立维护 types、validate、statistics、compile。统计只在 compileStatPlot 中执行，更新 spec 时重新编译；resize、hover、图例、release 不扫描原始输入。
- validateStatPlot 只检查结构、必要参数和廉价边界，不运行完整相关矩阵、bootstrap 或绘图统计；昂贵计算只执行一次。不可表示数值用带 JSON Pointer 的 StatPlotValidationError 报告。
- 空数据保留现有空态；统计不可定义用有明确含义的 null/NA 或边界错误，不伪造 0。
- 不提供用户回调、任意估计器、权重、聚类 bootstrap、自动训练模型、自动拟合回归、worker、异步统计或统计结果查询公共 API。
- 新增 vutils API 必须从包根导出，禁止深层导入或复制通用算法。先完成上游标准工具，再接消费者。
- 本地链接可用于开发联调；发布验收必须使用包含全部新 API 的真实 vutils 版本，更新依赖下限和 Rush 锁文件。不能把现有 1.0.24-dev.normal-quantile 联调当作可发版结果。

## 三、最终输入设计

### 1. missingValueMatrix：直接接收原始表格

沿用 pairPlot 的 variables + data.observations 结构：

~~~ts
{
  type: 'missingValueMatrix',
  variables: ['age', 'city', 'active'],
  data: { observations: [
    { id: '001', values: { age: 20, city: null, active: false } },
    { id: '002', values: { age: null, city: '', active: true } }
  ] }
}
~~~

- variables 非空、非重复，顺序就是横轴顺序；id 非空且唯一，观测顺序就是纵轴顺序。
- 每行 values 必须恰好包含 variables 中的键，允许有限 number、string、boolean、null。缺少键或额外键报错，显式 null 是唯一缺失标记。
- 编译生成完整 observationId × variable 布尔网格，null 为缺失，其余为已观测；空字符串、0、false 均已观测。
- 复用现有 missingness 系列和密集网格布局，不改成相关矩阵的方形布局；两图表达的行列含义不同。
- Tooltip 展示观测、变量、缺失状态；保持现有 fieldLabels.observationId / variable 对私有绘图字段的展示含义，不展示原始敏感值。
- 删除公共 isMissing 输入。只持有布尔掩码的调用方可使用原生 heatmap，不反推或伪造原始值。

### 2. correlationMatrix：从观测计算相关系数

~~~ts
{
  type: 'correlationMatrix',
  variables: ['height', 'weight'],
  method: 'pearson',
  minSamples: 2,
  data: { observations: [
    { id: '001', values: { height: 170, weight: 60 } },
    { id: '002', values: { height: 180, weight: null } },
    { id: '003', values: { height: 190, weight: 80 } }
  ] }
}
~~~

- 表结构和 id 契约与前项一致，但 values 只允许有限 number 或 null，不接收分类值。
- method 可省略，默认 pearson；支持 pearson、spearman、kendall，后者明确为 tau-b。
- minSamples 默认为 2，整数且至少 2。每个变量对独立排除任一端为 null 的观测，再按有效配对样本数计算；不先删除含任意缺失的整行。
- Spearman 在该变量对的有效样本中重新计算平均秩，不能用全列秩再删除缺失。Kendall 正确处理 x ties、y ties 和共同 ties。
- 有效样本不足、任一列常量或系数不可定义时为 null，包括退化对角。有效非退化对角为 1；不把 undefined/NaN 替换成 0。
- 只计算上三角及对角，再镜像成完整私有矩阵；triangle 仅控制显示，不能改变统计结果。
- variables 统一承担变量集合和显示顺序，删除重复的 variableOrder 配置；method 从元数据变为真实算法选择。
- 保留现有方形矩阵、紧密网格、固定 [-1,1] 色标、NA 和三角显示。Tooltip 增加有效配对样本数，解释样本不足与常量的 NA 原因。
- 与 pandas.corr 的逐对缺失处理一致；本包 minSamples 对全部方法统一生效，退化对角统一为 NA。不能宣称等同 pandas 在所有方法下强制对角为 1 的行为。

上游新增公共接口：

~~~ts
export type CorrelationMethod = 'pearson' | 'spearman' | 'kendall';
export function correlation(
  x: readonly number[], y: readonly number[], method?: CorrelationMethod
): number | undefined;
~~~

有效数值数组等长；不接受缺失值，由 StatPlots 做配对。少于 2 个样本或常量返回 undefined；非法方法、非有限值、长度不等按公共契约报 RangeError。不修改数组。Pearson O(N)，Spearman 与 Kendall O(N log N)，Kendall 使用排序、tie 计数和 Fenwick tree，避免每个变量对 O(N²)。稳定缩放/中心化防止有限极值溢出，不用大范围 clamp 隐藏实现错误。

### 3. pointIntervalPlot：保留两种用途

两个模式都要求显式 input，Schema 禁止跨模式字段。

~~~ts
// 原始分组样本
{
  type: 'pointIntervalPlot', input: 'observations',
  data: [{ category: 'A', value: 1 }, { category: 'A', value: 3 }],
  estimator: 'mean',
  errorBar: { kind: 'confidence', level: 0.95, resamples: 1000, seed: 0 }
}
// 外部估计，可展示置信/预测/可信区间及其他已有 Interval
{
  type: 'pointIntervalPlot', input: 'estimates',
  data: [{ category: 'A', estimate: 2, lower: 1, upper: 3 }],
  interval: { kind: 'confidence', level: 0.95 }
}
~~~

- observations 为 category / value / series?，按 category + series 独立估计；estimator 默认为 mean，也支持 median。
- errorBar=false 仅显示估计点。省略 errorBar 使用 95% percentile bootstrap 置信区间，1000 次、有放回、每次抽取组内 N 个样本，seed=0。
- 其他区间支持样本百分位区间 percentile、样本标准差 standardDeviation、均值标准误 standardError、min/max range。percentile 默认 level=0.95；SD/SE 默认 multiplier=1。SE 仅允许 mean，不把样本均值的 SEM 冒充中位数标准误。
- SD 使用 N−1 的样本标准差，SE=SD/sqrt(N)；percentile 使用线性插值分位数，不叫模型预测区间。range 是样本范围。
- level 严格在 (0,1)，multiplier 为有限正数；resamples 为 100–10000 整数，seed 为 0–4294967295 整数。首版设置次数下限以避免极少次重采样，下限不代表覆盖率保证；上限控制同步编译成本，仍需阶段性能验收。resamples / seed 仅 confidence 模式允许，禁止无效参数。
- N=1 时仍显示估计点，CI/SD/SE 为 null 并在 Tooltip 标明样本不足；percentile/range 可退化到该值。N≥2 的常数组区间可退化为零宽，这是可定义结果。
- 每组排序新建的数值数组，再用同一个显式 seed 创建独立 randomLCG；不同组不共用可变随机状态。排序保证同组输入重排不改变 bootstrap。不承诺和 NumPy RNG 同 seed 得到逐点相同结果。
- estimates 模式保留现有 estimate/lower/upper 与 interval 契约，估计值不强制在区间内；禁止 estimator/errorBar。observations 禁止外部 interval/lower/upper。
- 私有结果将 lower/upper 声明为 number|null；不可用区间不生成线段或端帽，估计点正常展示。errorBar=false 同样不生成线段，不能用 0 代替缺失端点。
- 继续支持现有分组、参考线、log 值轴及标签；log 检查实际生成的估计值和有效区间端点。区间跨过 0 时明确报错，不截断。
- 为 percentile 增加准确的私有区间文案，不把它映射成现有 Interval.prediction。外部 Interval 类型保持原含义。

均值与 bootstrap 通用算法补到 vutils；复用现有 variance、median/quantileSorted、randomLCG，不复制：

~~~ts
export function mean(values: readonly number[]): number | undefined;
export function bootstrapEstimate(
  values: readonly number[], estimator: (sample: readonly number[]) => number,
  options: { resamples: number; seed: number }
): number[];
~~~

mean 对空数组返回 undefined，其余有限数值使用稳定累加。bootstrap 回调只存在于 vutils 和包内部，不进入 JSON spec；回调样本为只读视图，不得修改/持有可复用缓冲区。空输入或非法参数报错。结果为重采样估计值，置信水平和端点由调用方用标准分位数工具求出。不新增通用统计推断框架。

### 4. residualPlot：真实值与拟合值生成普通残差

~~~ts
{
  type: 'residualPlot', input: 'predictions',
  data: [{ id: '001', actual: 8, fittedValue: 10, series: '模型 A' }]
}
{
  type: 'residualPlot', input: 'residuals', residualKind: 'studentized',
  data: [{ id: '001', fittedValue: 10, residual: -1.2, series: '模型 A' }]
}
~~~

- predictions 仅接收 id / actual / fittedValue / series?，内部计算 raw residual=actual−fittedValue；不允许输入 residual 或指定其他 residualKind。
- residuals 保留原残差输入，residualKind 必须为 raw / standardized / studentized；不猜测模型方差、杠杆值或自由度，不自行标准化。
- 唯一键统一为 id + series，使同一批观测可比较不同模型；同组 id 重复报错。
- predictions Tooltip 包含真实值、拟合值、原始残差；raw 与外部模型残差准确标注定义。
- 不自动拟合 x/y，不等同 Seaborn residplot 的回归入口。两者的区别必须写入文档，不能用简单相减宣称完成回归拟合对齐。
- 有限输入相减溢出时在对应观测路径报错，不能输出 Infinity。

### 5. learningCurve：各折结果内部汇总

~~~ts
{
  type: 'learningCurve', input: 'folds', metric: 'Accuracy',
  data: [
    { trainSize: 100, fold: '1', split: 'validation', score: 0.6 },
    { trainSize: 100, fold: '2', split: 'validation', score: 0.8 }
  ],
  spread: { multiplier: 1 }
}
{
  type: 'learningCurve', input: 'summaries', metric: 'Accuracy',
  data: [{ trainSize: 100, split: 'validation', score: 0.7, lower: 0.6, upper: 0.8 }],
  interval: { kind: 'standardDeviation', multiplier: 1 }
}
~~~

- folds 接收 trainSize / fold / split / score / series?，trainSize 为正整数，fold 为非空字符串；唯一键为 series + split + trainSize + fold。
- 按 series + split + trainSize 汇总均值及跨折总体标准差，即 ddof=0，与 sklearn LearningCurveDisplay 的 NumPy std 口径一致；复用 vutils variance 后乘 (K−1)/K 得总体方差，不改动 variance 的样本方差契约。
- spread 省略为 {multiplier:1}，false 关闭标准差带，有限正 multiplier 可选。标准差带不是置信区间，不能标成 95% CI。
- 每个 series + split 的训练规模间保持相同 fold 集合；允许只展示 train 或 validation。当两种 split 同时存在时，每规模的 fold 集合须一致。不补失败折、不静默删除 NaN、不把 epoch 当训练规模。
- folds 可乱序，内部按 trainSize 递增生成曲线；每组至少两折，单折边界明确报错。summaries 保留原递增顺序、bounds 和 interval 的校验契约。
- summaries 禁止 fold/spread；folds 禁止 lower/upper/interval。每行仍需有限 score，不限制评分范围，因为 MSE、负损失等不在 [0,1]。
- Tooltip 包含均值、折数、标准差及带宽定义；继续准确区分 train/validation 和 series。
- 训练、交叉验证划分和打分由外部完成，不在浏览器接收 estimator 或训练数据。

## 四、文件结构与实施阶段

路径除 VUtil 特别注明外，相对 packages/vchart-statplots。

### Task 0：建立明确的 Schema 模式判别路径

**Files:** 修改 scripts/build-schema.ts；新增 __tests__/unit/input-modes.test.ts；对应公开类型和生成物随各阶段交付，不先添加不工作的图表模式。

**Interfaces:** 每个图表仍只有一个按 type 选择的根分支；多用途图在该分支内部按必填 input 判别。公开图表类型可以为由具名接口组成的联合。

- [x] 为 pointIntervalPlot 的两种设计类型做最小生成试验，锁定当前生成器对联合成员符号、plotSchema.properties.type 和外层 AJV discriminator 的假设。
- [x] 从 StatPlotSpec 声明中的具名类型引用枚举 28 个图表，而非展开后的所有子接口；解析同一图表所有成员的 type 字面量并确认唯一。
- [x] 每个图表生成一个 schema/plots/<type>.schema.json；整体 runtime schema 以 type 分成 28 个分支，多用途图在分支内部再按 input 区分。禁止把两个同 type 成员放进外层 discriminator。
- [x] 保持公共 JSON Schema、AJV standalone validator、TypeScript 类型语义一致；两模式的未知/混入字段均拒绝，input 缺失报 schema error。
- [x] 运行 compile、build:schema、check:schema、schema.test.ts 和既有 raw-input-contracts.test.ts。确认单模式图校验结果不变，并记录大型输入校验复杂度，不能因嵌套联合重复遍历全部图表。

测试示例在 Task 3 的公开类型引入时正式落地：

~~~ts
expect(validateStatPlot({ type: 'pointIntervalPlot', input: 'observations',
  data: [{ category: 'A', value: 2 }], errorBar: false }).valid).toBe(true);
expect(validateStatPlot({ type: 'pointIntervalPlot', input: 'observations',
  data: [{ category: 'A', estimate: 2, lower: 1, upper: 3 }] }).valid).toBe(false);
expect(validateStatPlot({ type: 'pointIntervalPlot',
  data: [{ category: 'A', value: 2 }] }).valid).toBe(false);
~~~

Task 0 和第一个双模式图一起形成可提交交付，不单独提交暴露半成品类型的脚手架。

### Task 1：missingValueMatrix 原始表格

**Files:** 新增 src/common/observation-table.ts、src/common/observation-table-types.ts、src/plots/missingness/statistics.ts、__tests__/unit/missingness-input.test.ts；修改 plots/missingness/{types,validate,compile}.ts 和已有 missingness 浏览器用例。

**Interfaces:** 表格工具只校验变量、id、精确键集和受支持值，不承担统计清洗。私有 buildMissingnessCells(spec) 生成现有 observationId / variable / isMissing 绘图行，空观测返回 []。

- [x] 添加以下原始值反例，先确认旧接口无法接收原始表格：

~~~ts
const chart = compileStatPlot({ type: 'missingValueMatrix',
  variables: ['zero', 'flag', 'text', 'absent'],
  data: { observations: [{ id: '1',
    values: { zero: 0, flag: false, text: '', absent: null } }] }
});
const cells = (chart.series![0] as any).data.values;
expect(cells.map((row: any) => row.status)).toEqual(['已观测', '已观测', '已观测', '缺失']);
~~~

- [x] 实现表格边界、内部缺失判断与原有 compile 数据映射；不改 per-cell 渲染路径。
- [x] 覆盖遗漏键、额外键、重复 id、变量顺序、非有限数字、空表以及冻结输入不变。
- [x] 迁移 missingValueMatrix 的主例/minimal/invalid 与浏览器数据，复用现有布局、像素和 resize/release 断言。
- [x] 本阶段独立通过 Schema、目录单元测试、missingness-layout.spec.ts 与 missingness-pixels.spec.ts，再记录结果。

### Task 2：vutils 相关性与 correlationMatrix

**Files:** VUtil 新增 packages/vutils/src/common/correlation.ts、packages/vutils/__tests__/correlation.test.ts，修改 src/common/index.ts；StatPlots 新增 plots/correlation-matrix/statistics.ts、__tests__/unit/correlation-input.test.ts，修改同目录 types/validate/compile、现有 fixtures 和矩阵浏览器用例。

**Interfaces:** 上游 correlation 使用第三节的公开签名；buildCorrelationCells(spec) 输出完整私有 row / column / correlation / sampleCount / undefinedReason，compile 继续使用 MatrixLayout 和既有色条。

- [x] 先补上游数学测试：正/负完全相关、非线性单调导致 Pearson 与 Spearman 不同、平均秩 ties、共同 ties、常量、单样本、长度错误、输入不变和有限极值。

~~~ts
expect(correlation([1, 2, 3], [3, 2, 1])).toBeCloseTo(-1, 12);
expect(correlation([1, 1, 2], [1, 2, 3], 'spearman')).toBeCloseTo(Math.sqrt(3) / 2, 12);
expect(correlation([1, 1, 2], [1, 2, 3], 'kendall')).toBeCloseTo(Math.sqrt(2 / 3), 12);
expect(correlation([1, 1], [1, 2])).toBeUndefined();
~~~

- [x] 实现并根导出 correlation，验证 Kendall O(N log N)，运行 VUtil 单元测试/compile/build。
- [x] 使用观测表工具验证数字/null，逐对筛选并计算半矩阵，按 variables 生成完整结果。使用下面数据证明不做整行删除：A=[1,2,null,4]、B=[1,null,3,4]；A/B 有 2 对样本，相关系数为 1；minSamples=3 时该格及镜像为 null。
- [x] 为 Spearman 增加“全列排名再删缺失会得错结果”的确定性反例；冻结输入，检查对称、对角、NA、triangle 对计算无影响。
- [x] 迁移所有外部相关矩阵 fixture 到确定性原始观测。旧数值/视觉样例无法由真实样本生成时重新设计并明确审查，不伪造样本反推任意矩阵。
- [x] 运行 correlation/matrix-display 单元与 correlation-matrix.spec.ts、颜色/Tooltip 测试；确认共用显示工具未影响 confusionMatrix。

### Task 3：pointIntervalPlot 双模式及估计

**Files:** VUtil 新增 packages/vutils/src/common/mean.ts、packages/vutils/src/common/bootstrap.ts、packages/vutils/__tests__/mean.test.ts、packages/vutils/__tests__/bootstrap.test.ts，修改 common/index.ts 根导出；StatPlots 修改 plots/estimate-interval/{types,validate,compile}.ts，新增 statistics.ts、__tests__/unit/point-interval-input.test.ts、__tests__/browser/point-interval.spec.ts。与 Task 0 同步完成生成器和输入模式测试。

**Interfaces:** mean / bootstrapEstimate 使用第三节签名；summarizePointIntervals(spec) 生成 category / series? / estimate / lower / upper / sampleCount / intervalText 的私有行。estimates 分支直接映射受校验的外部结果。

- [x] 上游先测试 mean 极值/空数组、LCG 确定性、样本长度、原样本不变、bootstrap 常数结果与已知重采样索引结果；算法使用已有 randomLCG。
- [x] 编写每种统计含义的测试，再实现；普通样本 [1,3] 的 mean=2、sample SD=sqrt(2)、SEM=1，1×SEM 的端点为 [1,3]。
- [x] 以 category + series 分组，mean/median、各 errorBar 参数和 N=1/常数组按设计生成结果；冻结并置换原始行，确保没有隐式随机变化。
- [x] estimates 模式迁移原 interval-matrix.test.ts：估计值可在区间外，外部 CI/PI/credible 不被重算。Schema 拒绝跨模式字段。
- [x] 编译只为有效上下界生成区间和端帽；测试 errorBar=false、单样本估计点、log 轴生成后校验、图例和同实例更新。
- [x] bootstrap Python fixture 复用相同的 LCG 重采样索引、np.quantile(method='linear') 核对端点；另外检查不同 seed 可产生不同非退化结果。同 seed 不宣称 NumPy/Seaborn 随机结果逐点相同。
- [x] 完成本阶段包级类型/Schema/例子验证、目标单元和 point-interval.spec.ts。输出 bootstrap 计算成本，不将其隐藏成普通 O(N) 分组统计。

### Task 4：residualPlot 双模式

**Files:** 修改 plots/residual/{types,validate,compile}.ts，新增 statistics.ts、__tests__/unit/residual-input.test.ts、__tests__/browser/residual-input.spec.ts。

**Interfaces:** buildResidualRows(spec) 输出原有拟合值/残差字段及可用的 actual / residualKind；不引入回归算法。

- [x] 锁定 actual=8、fittedValue=10 得 residual=−2，防止减法方向写反；同 id 不同 series 允许，同组重复拒绝。
- [x] 加入预测双模式 Schema 校验、有限相减溢出、外部 standardized/studentized 不变、空表和冻结输入测试。
- [x] 实现普通残差相减及两模式分支；迁移原始示例、外部模型残差变体和真实 Tooltip/图例测试。
- [x] 回归现有散点布局、y=0 参考线、更新和释放。文档明确与自动回归的区别。

### Task 5：learningCurve 双模式

**Files:** 修改 plots/learning-curve/{types,validate,compile}.ts，新增 statistics.ts、__tests__/unit/learning-curve-input.test.ts、__tests__/browser/learning-curve-input.spec.ts。

**Interfaces:** summarizeLearningCurve(spec) 输出原有 trainSize / split / score / lower / upper / series 及 foldCount / standardDeviation；汇总分支保留现有外部数据含义。

- [x] 使用一组验证折分数 [0.6,0.8]：均值=0.7，总体 SD=0.1，默认带端点 [0.6,0.8]；若误用样本 SD 得到约 0.1414，测试必须失败。
- [x] 锁定每系列/每 split 的 fold 集合、重复键、两 split 折集合不一致、单折、非有限分数和 trainSize 边界，不把失败折当作 0。
- [x] 实现统计及排序，保留 summaries 的现有上下界定义/校验；spread=false 不绘制标准差带。
- [x] 迁移示例，确保两条 split 及多模型的图例颜色一致；真实 Tooltip 显示折数及标准差，update/resize 保持结果。
- [x] 对照 sklearn 1.5.2 LearningCurveDisplay 的 mean(axis=1) 和 std(axis=1,ddof=0)，无需在浏览器训练模型。

## 五、各阶段共同同步与迁移

每个子项目都同步：

- src/types.ts 的公开导出，对应 schema/plots/<type>.schema.json、schema/statplot.schema.json、src/generated/validate.*；仅由 build:schema 生成。
- examples/specs/<type>.json、minimal/<type>.json、grouped/<type>.json（已有者）、invalid/<type>.json，新增 variants 显式登记 examples/specs/index.json 和 docs/plot-catalog.json。
- README.md、docs/spec.md、docs/computation-contract.md、docs/plots/<type>.md、docs/catalog.md，以及实际执行后的 docs/validation.md / benchmarks/README.md。
- schema、second/third/fourth-phase、field-labels、colors、matrix-display、catalog 等引用旧数据的测试；搜索全包，旧字段只出现在外部显式模式、私有结果或明确负例。

迁移规则：

| 图表 | 迁移方式 |
| --- | --- |
| missingValueMatrix | 提供原始 values/null，替换 isMissing 掩码 |
| correlationMatrix | 提供 variables/observations；删除公共 correlation 行及 variableOrder |
| pointIntervalPlot | 原结果加 input=estimates；原始样本用 input=observations |
| residualPlot | 原残差加 input=residuals；真实值/拟合值用 input=predictions |
| learningCurve | 原汇总加 input=summaries；各折结果用 input=folds |

不进行输入形状自动检测，不静默兼容缺少 input 的调用；发布说明记录破坏性变化。保留 28 个图表 type，不增加别名图表。

## 六、验收与执行顺序

推荐顺序：Task 1 → Task 2 → Task 0+3 → Task 4 → Task 5 → 全包验证。每个阶段形成可独立审阅的结果；提交仅在用户后续要求时进行。

- [x] 新增 scripts/generate-input-alignment-fixtures.py 与 __tests__/fixtures/input-alignment-python.json，固定 numpy=1.26.4、scipy=1.13.1、sklearn=1.5.2、pandas=2.2.2。Python 版本、方法、参数、原输入、null 约定与绝对容差 5e−8 写入 fixture。
- [x] 相关性对照 pandas Pearson/Spearman 逐对缺失及 SciPy kendalltau(variant='b')；区间对照 NumPy mean/std(ddof=1)/quantile 和相同重采样索引；学习曲线对照 sklearn 的 ddof=0。JS 日常测试直接读 JSON，不依赖 Python 环境。
- [x] 每阶段先运行有效数学反例，再实现并运行目标测试；通过后全包 build/eslint/Schema/examples/catalog/单元/浏览器测试。
- [x] 浏览器覆盖真实 Tooltip、图例状态变化、同实例 updateSpec、resize、主题、空态往返与 release；NA 不被绘成 0，区间缺失不产生端帽。
- [x] 分别测量统计和绘图规模：相关矩阵 10k/100k 观测 × 4/16 变量及三种算法；区间 10k/100k 样本与 bootstrap 次数；缺失矩阵 10k/100k 实际单元格；残差 10k/100k 实际散点；学习曲线 10/100 规模 × 5/10 折 × 1/10 模型。报告 compile、render、update、resize、release 及 20 图表页面，不只测压缩后的结果点数。
- [x] 相关矩阵各算法保持正确复杂度，bootstrap 的 mean 为 O(BN)、median 为 O(BN log N)，必须记录默认参数成本。若默认规模不可用，先依据测量重新审查参数，不引入静默抽样。
- [x] 新增确定性视觉/交互用例并登记显式清单，截图稳定性重复五轮、审查反例；原生相关目录按实际影响执行。修改公共渲染/布局/状态路径时扩大范围，不确定时全量。
- [ ] 创建 PR 前按仓库规范执行官方 develop 基线的全量原生视觉回归，审查 HTML/agent-summary.md；阻断与执行错误如实记录，self-compare 不替代基线，不跳过用例或放宽阈值。
- [ ] 完成 vutils 真实发版与消费者依赖/锁文件更新后，从已发布包进行隔离安装和构建，才能标记发布准备完成。未发版时只记录本地联调完成。

从仓库根目录执行：

~~~sh
export PATH="/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH"
npm run build --prefix packages/vchart-statplots
npm run eslint --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
node packages/vchart/scripts/visual-test.mjs
~~~

VUtil 校验从其仓库根目录执行：

~~~sh
npm test --prefix packages/vutils -- --runInBand
npm run compile --prefix packages/vutils
npm run build --prefix packages/vutils
~~~

## 七、Python 参照与明确差异

- [missingno 原始 DataFrame 缺失矩阵](https://github.com/ResidentMario/missingno#matrix)：对齐原始表格入口，本包 JSON 用显式 null 表示缺失。
- [pandas.DataFrame.corr](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.corr.html)：对齐逐变量对有效观测；本包统一 minSamples 和退化对角 NA，有意记录边界区别。
- [SciPy kendalltau](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.kendalltau.html)：tau-b、ties 和 O(N log N) 的算法基准；不计算 p-value。
- [Seaborn pointplot](https://seaborn.pydata.org/generated/seaborn.pointplot.html)、[误差条说明](https://seaborn.pydata.org/tutorial/error_bars.html)：对齐从原始分组样本估计及正确区分区间用途，不承诺同 seed 随机结果相同；外部区间入口保留。
- [Seaborn residplot](https://seaborn.pydata.org/generated/seaborn.residplot.html)：其自动回归超出本轮；本包从外部模型预测计算普通残差，模型诊断残差保持外部输入。
- [sklearn LearningCurveDisplay](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.LearningCurveDisplay.html)、[1.5.2 统计显示实现](https://raw.githubusercontent.com/scikit-learn/scikit-learn/1.5.2/sklearn/model_selection/_plot.py)：对齐跨折均值与总体标准差，模型训练和打分仍由调用方完成。

本计划完成后，不使用“所有图表与所有 Python 库完全一致”的描述。验收目标是输入语义合理、明确计算职责，以及针对指定库/参数可复现的数值与展示行为。

## 八、执行结果

功能测试集中到 input-alignment.test.ts、input-alignment-python.test.ts 和 input-alignment.spec.ts，保留既有矩阵测试；性能集中到 input-alignment-performance.spec.ts。595 项 StatPlots 单元、254 项 VUtil 联调测试、315 项浏览器覆盖（全量加修正后的定向复验）、Schema/示例/目录/构建/类型验证完成。最终构建后再次执行新入口与配色浏览器验证，16 项通过。

失败原因、测量成本、截图稳定性、官方原生 heatmap 范围和源码联调工作树见 packages/vchart-statplots/docs/validation.md。本轮整理后本地提交；不发布或创建 PR。真实上游发版、依赖/锁文件更新和发布包隔离构建仍为发布前置条件；PR 前全量原生视觉比较仍待执行。本轮相关目录 1/1 无差异，不将其写成全量通过。
