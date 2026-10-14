# StatPlots 散点回归与残差图优化计划

> **执行方式：** 本文已获用户批准并完成源码/本地联调；正式依赖已升级为 VUtil 1.0.26。按阶段在当前会话实施和验证，不委派代理。上游源码使用隔离工作区；合并、发布、推送和提交另按用户指令处理。

**Goal:** 让调用方直接提交原始 x/y，完成线性、多项式、LOWESS 拟合、回归曲线与普通残差；保留外部拟合结果及外部模型残差的展示用途。

**Architecture:** vutils 提供稳定且统一的回归、预测和成对 bootstrap；StatPlots 负责严格输入契约、按系列分组、调用算法、生成私有绘图结果。两张图共享回归适配层，渲染阶段只使用计算后的数据。

**Tech Stack:** TypeScript 4.9.5、vutils、VChart、JSON Schema/AJV、Jest、Playwright；Node.js 22。Python 仅用于离线数值对照。

**范围确认：** 用户选择本轮同时支持线性、多项式和 LOWESS。保留现有 scatterPlot / residualPlot 类型，不新增第 29 种图。

## 1. 问题与方案选择

当前 scatterPlot 已接收原始 x/y，但 fit 只接收外部曲线；residualPlot 的 predictions 只计算 actual−fittedValue，没有原始 x/y 拟合入口，横轴也固定为 fittedValue。因此，普通散点输入已经合理，缺失的是探索性回归和原始样本残差这一层。

| 方案 | 取舍 | 决定 |
| --- | --- | --- |
| 两张图分别编写回归算法 | 预测、曲线和退化规则容易分叉；重复维护公共数学算法 | 不采用 |
| 直接接入 vutils 1.0.25 的现有实现 | 调用最少，但已确认存在数值与模型一致性问题 | 不采用 |
| 修复 vutils 标准路径，再增加共享适配层与显式输入模式 | 先解决根因；图表只保留分组和展示职责 | 采用 |

### 已确认的上游问题

对已安装的 vutils 1.0.25 做了只读复现：

- 线性回归：x=10⁹+[0,1,2,3]、y=[1,3,5,7]，真实斜率 2，现有实现返回 0。原始二阶矩相减产生消减误差。
- 二次回归：x=10⁹+[0,1,2,3,4,5]、y=1+2t+0.5t²，现有预测全为 0。原始幂构造正规方程放大病态程度，奇异处理又静默返回零系数。
- LOWESS：固定 21 个观测、span=0.5、iterations=3，evaluateGrid 的值与 predict 在同一 x 处最大相差约 15.48。稳健权重只在 evaluateGrid 中计算，predict 没有使用。
- LOWESS 默认最多取 1000 个样本，并在部分大样本下自动减少稳健迭代。不能把这样的默认近似标成使用全部原始观测的 Python 同类算法。
- 现有多项式/LOWESS confidenceInterval 复用了线性区间组件，不能作为本轮 bootstrap 回归置信带的实现。

这些问题必须在 vutils 修正，不在 StatPlots 放置第二套 OLS、求解器、LOWESS 或随机数生成器。上游旧区间 API 的完整整理作为独立议题；本轮新增的图内区间明确使用成对 bootstrap，不调用这些旧区间方法。

## 2. 与 Python 对齐的边界

- [seaborn.regplot](https://seaborn.pydata.org/generated/seaborn.regplot.html)：提交原始 x/y，内部拟合；线性与多项式可用 bootstrap 置信带，LOWESS 不绘制置信带。本轮沿用这些统计含义。
- [seaborn.residplot](https://seaborn.pydata.org/generated/seaborn.residplot.html)：先回归 y 对 x，再显示 residual=y−predict(x)，横轴为原始 x。其 lowess 参数拟合的是残差趋势，不是生成残差的模型。
- [statsmodels.lowess](https://www.statsmodels.org/stable/generated/statsmodels.nonparametric.smoothers_lowess.lowess.html)：局部线性、tricube 权重、残差稳健迭代；默认 frac=2/3、it=3。delta 表示显式插值加速，不是丢弃观测。

残差图同时提供 regression.method='lowess' 和独立 smooth 配置：前者从 LOWESS 模型计算残差，是本包的扩展；后者才对应 residplot(lowess=True)。文档不能把两者混为一谈。

对齐输入层级和统计定义，不承诺复制全部 Python 参数：本轮不加入 logistic、robust 全局回归、logx、权重、偏回归、聚类 bootstrap、任意估计器回调或模型训练。仍只接受有限数字，不隐式丢弃 null/NaN，不把 JSON 中的字符串转换成数值。

## 3. 公共输入契约

### 3.1 共享回归配置

~~~ts
type RegressionOptions =
  | { method: 'linear' }
  | { method: 'polynomial'; degree: number }
  | { method: 'lowess'; span?: number; iterations?: number; delta?: number };

type RegressionConfidence = false | {
  kind: 'confidence';
  level?: number;
  resamples?: number;
  seed?: number;
};
~~~

- linear 为带截距的一元 OLS。
- polynomial 的 degree 必填，首版为 2–5 的整数。degree=1 使用 linear，避免两条等价配置。次数上限限制同步计算与高阶病态，不宣称高阶模型自动适用。
- LOWESS 固定局部线性，span 默认 2/3，严格在 (0,1]；iterations 默认 3，为 0–10 整数；delta 默认为 0，为有限非负数，单位与 x 一致。
- 不在 StatPlots 暴露 maxSamples；默认使用全量观测。delta>0 采用有明确契约的插值近似，Tooltip 和文档显示实际配置。
- curve sampling.points 默认 100，整数 2–512，只控制线性/多项式绘制网格，不改变拟合或残差。LOWESS 默认使用拟合后的观测 x 节点；禁止对 LOWESS 传入这个采样配置，避免把稀疏展示插值当作不同模型。
- confidence 的 level 默认 0.95 且严格在 (0,1)，resamples 默认 1000、整数 100–10000，seed 默认 0、为 uint32。100 次下限只是成本与易用性的边界，不保证覆盖率。
- method 特定参数使用判别联合；线性不能带 degree/span，LOWESS 不能带 confidence 对象，外部结果不能带内部拟合参数。

### 3.2 scatterPlot：原始观测保持为唯一散点来源

~~~ts
// 原始数据直接拟合；省略 confidence 使用 95% bootstrap
{
  type: 'scatterPlot',
  data: [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }],
  fit: { input: 'observations', method: 'linear' }
}

// 多项式
fit: { input: 'observations', method: 'polynomial', degree: 2, confidence: false }

// LOWESS：默认无置信带
fit: { input: 'observations', method: 'lowess', span: 2 / 3, iterations: 3 }

// 外部结果展示
fit: {
  input: 'estimates', method: '外部模型',
  data: [{ x: 1, estimate: 2, lower: 1, upper: 3 }],
  interval: { kind: 'prediction', level: 0.95 }
}
~~~

- data 继续为 {x,y,id?,series?}[]。省略 fit 保持纯散点，不自动改变现有 scatterplot 调用的含义。
- fit.input 必填 observations / estimates。observations 从同一 data 计算，禁止第二份 fit.data；estimates 保留原 FitRow 和 Interval。
- 内部拟合的 method 是实际算法，外部 method 仍是显示名称。
- 线性/多项式省略 confidence 默认绘制均值响应的 bootstrap 置信带，confidence=false 只画线；LOWESS 省略 confidence 或显式 false 均只画线，对象配置报错。
- 内部曲线范围为各系列原始 x 的 min/max，不自动外推到坐标轴边界。
- observations 的线和置信带与散点共用 series 色域；图例同时控制对应点、线、带。当前只绑定 observations 的图例配置需要修正。
- 外部曲线保留系列对应、每系列 x 升序、区间边界与 interval 检查，不重新拟合或篡改端点。

### 3.3 residualPlot：增加原始观测入口

~~~ts
{
  type: 'residualPlot', input: 'observations',
  data: [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }],
  regression: { method: 'linear' },
  xAxis: 'predictor',
  smooth: false
}

// 外部预测继续只做减法
{ type: 'residualPlot', input: 'predictions',
  data: [{ id: 'a', actual: 8, fittedValue: 10 }] }

// 外部模型残差继续直接展示
{ type: 'residualPlot', input: 'residuals', residualKind: 'studentized',
  data: [{ id: 'a', fittedValue: 10, residual: -0.5 }] }
~~~

- observations 为 {x,y,id?,series?}[]，regression 省略默认为 linear，也支持同一 polynomial / lowess 联合；不接收外部 actual/fittedValue/residual。
- observations 内部对每条原始 x 调用同一模型 predict，计算 y−fittedValue，不从稀疏曲线做残差插值。LOWESS delta 的显式近似属于模型本身，并使用统一预测路径。
- observations 的 xAxis 默认为 predictor（原始 x），可显式 fitted；predictions/residuals 保持当前 fittedValue 横轴，不允许加入 xAxis 偷偷改变其语义。
- observations 只生成 raw 残差，不自动声称得到标准化/学生化残差；外部 residuals 模式保留 residualKind。
- id 在 observations 可省略；提供时非空，同系列内唯一，缺省时使用私有行索引关联，不制造公共 ID。原始重复 x/y 样本全部保留。
- fieldLabels 在 observations 支持 x/y/fittedValue/residual；外部模式保持 fittedValue/residual。轴和 Tooltip 按实际横轴选择名称。
- Tooltip 在 observations 展示 id（若有）、原始 x/y、预测值、残差、算法和有效参数；外部模式保持既有内容。内置 y=0 参考线继续保留。
- smooth 省略/false 不画趋势；对象形式为 {method:'lowess',span?,iterations?,delta?}，在实际横轴与残差上按系列独立拟合，不改残差、不画置信带。适用于三种输入模式。
- 平滑所需有效横轴少于两个不同值时仍显示残差点，趋势不可定义，省略趋势并给出准确提示；不伪造趋势，也不让可用的外部残差图整体失败。

## 4. 统计、退化与数值规则

### 模型与分组

- 沿用 series 全表全部提供或全部省略的规则；每组独立拟合，不跨组汇总，不共用可变随机状态。
- 原始数据允许无序和重复观测，禁止修改输入数组、行对象和顺序。内部排序保留原始行索引；用于确定性 bootstrap 的配对按 x/y 排序，输出残差映射回原行。scatter 的可选 id 沿用当前契约，不因拟合而新增唯一性要求；residual 的可选 id 用途及唯一性按本图契约校验。
- 空数据返回空图，不启动拟合。非空拟合组至少两个样本与两个不同 x；多项式还须至少 degree+1 个不同 x。纯散点不受拟合最低样本限制。
- 主拟合设计矩阵不满秩时明确报 INVALID_RANGE，定位到该组首条数据并说明原因，不降次数、返回零系数或静默切换模型。
- 常量 y 是合法的水平线和零残差。首版不展示 R²，避免将当前上游常量响应的 R²=0 当作新图表契约。
- 常量 x 的主回归报错，调用方可使用纯散点或外部结果；不画无法识别斜率的假回归线。
- 有限输入产生不可表示的预测、残差或区间端点时报告 JSON Pointer 错误，不夹到 0、±1 或任意上限。

### 线性与多项式

- 线性使用稳定中心化/缩放累加，predict 在稳定坐标中求值，避免 a+b*x 的巨大项相消；保留已有 coef 命名与顺序。
- 多项式以归一化 x 的设计矩阵求解，采用秩可检测的 QR / 最小范数求解标准路径，替换原始幂的正规方程与奇异零系数兜底。predict 使用稳定基底，不依赖还原后的大系数求值。
- 原始系数无法有限表示时，上游明确报告边界，不在图表侧猜测系数。上游改变退化行为前搜索所有现有消费者，补有效契约测试并记录迁移影响。

### bootstrap 置信带

- 对每组完整 (x,y) 配对有放回重采样，每次抽取 N 对，再重新拟合同一模型；禁止分别抽 x/y，禁止每个网格点重复拟合。
- 所有重复模型在同一绘制网格预测，逐点用线性插值分位数取上下端点。这是均值响应的逐点 percentile bootstrap CI，不是预测区间、同时置信带或解析 Student-t 区间。
- 原始拟合要求满秩；bootstrap 重采样可能不满秩，采用上游明确的最小范数最小二乘解，不删除这些抽样、不偷偷重抽。在原始组固定归一化基底中求解，退化情况下与 Python 原始基底的解可能不同，文档写明。
- 组内 N 不足以提供模型残差自由度（linear N≤2，polynomial N≤degree+1）时保留拟合线，CI 为不可用，不运行 bootstrap、不画零宽假置信带，Tooltip 提示样本不足。这是比 Python 部分小样本行为更严格的明确契约。
- 同组同 seed 可复现；组重排和输入行重排不改变区间，不承诺与 NumPy 同 seed 逐点相同。
- 不用置信带覆盖率或“估计值必须位于 CI 中”作为错误校验；percentile 区间不保证包含原始估计。

### LOWESS

- 拟合时完成全部稳健迭代，固定最终模型状态；predict、evaluateGrid、观测节点值和残差复用同一权重与近似策略。重复查询不能触发重新拟合或改变模型。
- 使用距离最近的邻域、tricube 权重、bisquare 稳健权重与稳定局部中心化；等距离以 x/y 的确定性排序选择，重复观测仍逐条参与。稳健尺度使用标准 median；median=0 时已拟合到数值精度的点保留权重，仍有明显非零残差的点权重为零，不把全部点重新设为相同权重。ties 和退化约定补固定 Python 对照，Python 未定义或有顺序差异的情况写明本包行为，不夸大一致性。
- 默认不抽样、不因 N 增大关闭稳健迭代。delta=0 使用精确路径；delta>0 按已记录的观测锚点插值，全部观测继续参与局部权重和稳健残差计算。
- 相同 x 的预测保持同一模型定义；不得回退到取输入顺序中的任意一个 y。没有可识别局部斜率时采用有定义的加权常数估计；全部有效权重为零且无法定义时明确报告，不返回伪造值。
- LOWESS 曲线节点按 x 排序，用真实预测值连接；去重仅用于曲线绘制，不删除原始散点/残差，也不降低重复观测的统计权重。

## 5. 模块边界与上游 API

### vutils

先修改 VUtil 中的标准工具，根导出已有回归和新增置信带能力。建议新增针对回归的公共 API，避免把只返回标量的 bootstrapEstimate 强行改成保存副作用的多变量抽样：

~~~ts
regressionBootstrap(
  data: readonly { x: number; y: number }[],
  options: {
    method: 'linear' | 'polynomial'; degree?: number;
    grid: readonly number[];
    level: number; resamples: number; seed: number;
  }
): { x: number; lower: number; upper: number }[];
~~~

它复用同一回归求解器、randomLCG 和 quantileSorted，负责配对抽样及标准区间；不提供 LOWESS 区间。grid 不修改，结果与 grid 顺序对应。固定归一化与秩规则由回归工具共享，不能由调用方复制。

LOWESS 为现有 options 增加 delta；显式 maxSamples 的既有调用独立审查兼容需求，StatPlots 不使用该参数。默认取消隐藏采样/迭代变化需记录为上游行为调整；不能借升级无声改变其他消费者。

### StatPlots

新增 src/common/regression-types.ts 和 src/common/regression.ts，集中参数、分组、模型适配、错误位置与私有结果生成。模型对象只存在于编译期间，不写进 JSON spec、VChart 数据或公共返回类型。

共享适配按用途生成 curves / predictions：散点不需要为每条原始观测额外求预测；残差不需要 bootstrap 或回归显示网格。同组基础模型只创建一次，bootstrap 的重采样拟合属于区间计算，不混入 render/update/hover 热路径。

validateStatPlot 只做结构、参数、系列和廉价最低样本检查，不运行完整 QR、LOWESS 或 bootstrap。compileStatPlot 计算一次；更换数据/模型时重新编译，resize/hover/图例/release 不访问原始样本。

## 6. 实施任务

### Task 1：修正并验收 vutils 回归工具

修改：VUtil/packages/vutils/src/common/regression-linear.ts、regression-polynomial.ts、regression-lowess.ts、regression-utils.ts；新增 regression-bootstrap.ts；更新包根 src/index.ts 导出。现有导出结构若经复核不同，沿其标准路径操作。

测试：保留 __tests__/common/regression-linear.test.ts；新增同目录 regression-polynomial.test.ts、regression-lowess.test.ts、regression-bootstrap.test.ts。

- [x] 在隔离工作区重现上述三个缺陷，先添加失败测试。
- [x] 修复线性、多项式数值稳定性与秩处理，锁定大偏移、不同尺度、常量响应、有限结果与正确错误边界。
- [x] 将 LOWESS 稳健状态移到模型构建阶段；加 delta，锁定同一点 predict/grid 一致、全量观测、iterations=0/3、ties/端点/离群值。
- [x] 增加成对 bootstrap，复用标准 RNG/分位数/求解器，覆盖退化重采样与确定性。
- [x] 搜索 VUtil/VChart 现有回归消费者，评估默认与退化行为调整，跑相关消费者测试。
- [x] 完成上游 compile、定向/全量单测、build 与根入口 CJS/ESM/types 验证。

### Task 2：共享契约与 scatterPlot

修改：src/common/regression-types.ts（新增）、src/common/regression.ts（新增）、src/plots/scatter/{types,validate,compile}.ts、src/types.ts。

- [x] 加入 fit.input 判别联合与三种方法，保留 FitRow 外部展示；无 fit 仍为纯散点。
- [x] 共享适配按系列拟合，生成网格曲线、LOWESS 节点与可用的 bootstrap 带；错误带原始 JSON Pointer。
- [x] 配色、图例绑定点/线/带统一，区间与线使用相同 x 节点，避免视觉错位。
- [x] 新增 __tests__/unit/regression.test.ts、scatter-regression.test.ts；覆盖未知字段、参数串用、分组、数据不变性、退化与外部输入迁移。

### Task 3：residualPlot 原始观测与趋势

修改：src/plots/residual/{types,validate,statistics,compile}.ts；复用共享适配。

- [x] 扩展 input=observations；默认 linear + predictor，支持 polynomial / lowess 与显式 fitted 横轴。
- [x] 在真实原始 x 求值，不使用展示曲线插值；输出 raw 残差、实际值、预测值、方法信息。
- [x] 保留 predictions/residuals 数据与横轴含义，新增 smooth LOWESS 只影响趋势线。
- [x] 标签与 Tooltip 对应实际字段，零线保留；趋势和残差共用系列色域与图例筛选。
- [x] 新增 __tests__/unit/residual-regression.test.ts，补现有 input-alignment.test.ts 的模式切换/外部用途测试。

### Task 4：Schema、例子与中文契约

- [x] 从 TS 重建 schema/plots/{scatterPlot,residualPlot}.schema.json、schema/statplot.schema.json、src/generated/validate.js/.d.ts；不手改生成物。验证嵌套 fit 联合不会错误要求 scatter 顶层 input。
- [x] scatter 主例改为原始样本自动线性回归；残差主例/最小例改 observations。分组例使用明显不同的关系，避免两条曲线重叠造成颜色误解。
- [x] 新增并登记 variants/scatterPlot-polynomial.json、scatterPlot-lowess.json、scatterPlot-external.json、residualPlot-polynomial.json、residualPlot-lowess.json、residualPlot-smooth.json、residualPlot-predictions.json；保留学生化外部残差例。
- [x] 更新 examples/specs/index.json、docs/plot-catalog.json、docs/catalog.md、逐图文档、docs/spec.md、docs/computation-contract.md、docs/skill-authoring.md 和 README 的输入、计算边界与 Python 对应关系。
- [x] 更新 invalid 例和旧外部 fit 测试，明确迁移为 fit.input='estimates'；不保留字段形状猜测旧契约。
- [x] check:schema、check:examples、check:catalog 全部通过。

### Task 5：数值、浏览器与性能验证

- [x] 新增 fixtures/regression-python.json 与 unit/regression-python.test.ts。固定 JSON 记录独立数值参考环境及误差容限；Python 生成脚本只作为本地验收工具，不纳入提交。
- [x] 线性/多项式用 NumPy 稳定最小二乘对照，LOWESS 用 statsmodels 相同 span/iterations/delta 对照；一般数据与大偏移数据分别检验。大偏移使用中心化参考值，不把 Python 自身的病态结果当正确答案。
- [x] bootstrap 固定同一配对索引序列离线对照，独立验证拟合/分位数；再检验实际 RNG 固定 seed 重复一致。不能用两个独立 RNG 的逐点差异判为算法错误。
- [x] 新增 browser/regression.spec.ts：三模型、两残差横轴、置信带有无、外部输入、真实 Tooltip、图例点/线/带一起变化、数据/方法/模式更新、resize 和 release。
- [x] 新增 browser/regression-performance.spec.ts：10k/100k 线性/多项式无 CI、10k 默认 CI、5k 精确 LOWESS、100k 显式 delta LOWESS、多 chart。记录 compile/render/update/resize/hover/release 分项成本和内存，确认交互不触发统计。
- [x] 不把精确 LOWESS 的 O(N²) 成本隐瞒成采样后的 100k 性能；基于小规模精确曲线检验 delta 近似误差，大规模测量实际成本。CI 参数上限不等于任意 N 下都快。
- [x] 先完成构建再运行浏览器全量，避免 UMD 重建引发测试页面 HMR；相关和全量单测/浏览器均验收。
- [x] 原生视觉在 packages/vchart/__tests__/visual/cases/charts/scatter/statplots-regression.mjs、statplots-residual.mjs 补可独立运行的确定性点/线/带/图例覆盖，使用已审阅的原生 common spec，登记 cases/index.mjs；不要求官方 develop 安装尚未发布的 StatPlots 新 API。统计输入到结果的覆盖在 StatPlots 测试完成，原生用例只验显示与交互。按用例指南完成五轮稳定性与反例检查，不填写虚构 BugServer ID。
- [x] 原生视觉运行相关 components/legend、components/marker、data 目录；提交 PR 前运行官方 develop 全量并审阅报告。基线失败或新增功能不支持时记录阻断，不改阈值、不跳过或用 self-compare 冒充通过。

### Task 6：依赖与交付验收

- [x] 开发联调可以使用本轮隔离上游构建；交付记录区分源码完成、联调通过、正式依赖可用三个状态。
- [x] vutils 1.0.25 不包含本轮修复/新增 API；已确认 npm 1.0.26 提供稳定回归、LOWESS fitted 与 regressionBootstrap，并更新相关依赖。
- [x] 正式 1.0.26 已更新相关依赖下限、Rush 锁文件；隔离安装本地打包的 StatPlots/VChart，CJS 140 份示例、ESM/UMD 三模型绘制与 release、严格 types 根入口检查通过，不依赖源码链接。
- [x] docs/validation.md 记录统计对照、性能、浏览器及官方视觉真实结果；检查变更清单，提交按用户后续指令执行。

## 7. 验证命令与顺序

使用 Node.js 22。上游命令在隔离 VUtil 根目录执行；先定向失败测试，再全量：

~~~sh
npm test --prefix packages/vutils -- --runInBand regression
npm run compile --prefix packages/vutils
npm test --prefix packages/vutils -- --runInBand
npm run build --prefix packages/vutils
~~~

VChart 根目录，接好本轮上游构建后：

~~~sh
npm test --prefix packages/vchart-statplots -- --runInBand regression
npm run build --prefix packages/vchart-statplots
npm run eslint --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots -- regression
npm run test:browser --prefix packages/vchart-statplots
node packages/vchart/scripts/visual-test.mjs --dir components/legend
node packages/vchart/scripts/visual-test.mjs --dir components/marker
node packages/vchart/scripts/visual-test.mjs --dir data
node packages/vchart/scripts/visual-test.mjs
~~~

具体隔离包构建和 Rush 锁文件命令依实际正式版本执行；无正式版本时完成源码/联调，并明确留下正式包验收项，不能填写已完成。

## 8. 完成标准

原始 x/y 可驱动三种拟合及普通残差；内部预测和显示来自同一模型；原始残差默认横轴为 x；外部用途明确且保留；模型与残差趋势语义分开；置信带含义准确；上游数值缺陷有独立回归测试；系列颜色和图例一致；全部相关契约、例子、Schema 和测试更新；验证记录准确区分已通过和阻断。

本计划不改变其他 26 类图的输入，不在本轮引入自动模型训练。允许探索性一元回归在编译期计算，是对先前“所有回归必须外部计算”边界的修正。

## 9. 执行结果

三种原始回归、原始残差、外部模式与独立趋势已完成。实际测试文件按数值语义集中在 regression-stability / regression-bootstrap / regression-python，未建立只承载同样断言的分散文件。上游改动位于 `.vchart-statplots/vutils-regression`，可应用补丁和联调证据位于 `.vchart-statplots/regression`。VUtil 276 项、StatPlots 636 项单测，浏览器全量 339 项及最终定向 131 项通过；正式依赖已升级为 1.0.26。原生全量的既有基线阻断及真实结果见 [验收记录](../../../packages/vchart-statplots/docs/validation.md)。
