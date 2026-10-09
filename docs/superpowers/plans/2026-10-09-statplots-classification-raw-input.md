# StatPlots 分类评估四图逐样本输入重构计划

**Goal:** confusionMatrix、rocCurve、precisionRecallCurve、calibrationCurve 直接消费逐样本预测结果，内部计算显示矩阵、曲线和指标。

**Architecture:** ROC/PR 共享按分数排序、同分合并及累计 TP/FP 的私有模块；混淆矩阵计数和校准分箱各自独立。模型预测仍由调用方产生。

**Tech Stack:** TypeScript、vutils quantileSorted、VChart line/heatmap、Schema、Jest、Playwright；Node.js 22。

采用 [总计划](2026-10-09-statplots-raw-input-roadmap.md) 的全局约束。按混淆矩阵、ROC/PR、校准三个任务依次交付。

## 1. 输入与配置

以下接口片段省略 BaseSpec / fieldLabels，实际类型继续保留它们。

```ts
interface ConfusionMatrixRow { actual: string; predicted: string }
interface ConfusionMatrixSpec {
  type: 'confusionMatrix';
  data: ConfusionMatrixRow[];
  normalization?: 'none' | 'actual' | 'predicted' | 'all';
  classOrder?: string[];
}
interface BinaryScoreRow { actual: boolean; score: number; series?: string }
interface RocCurveSpec { type: 'rocCurve'; data: BinaryScoreRow[] }
interface PrecisionRecallCurveSpec {
  type: 'precisionRecallCurve';
  data: BinaryScoreRow[];
  baseline?: boolean; // 默认 false；true 时绘制各组正例比例
}
interface CalibrationCurveRow { actual: boolean; probability: number; series?: string }
interface CalibrationCurveSpec {
  type: 'calibrationCurve';
  data: CalibrationCurveRow[];
  binning?: { binCount?: number; strategy?: 'uniform' | 'quantile' };
}
```

- ROC/PR/校准明确以 actual=true 为正例，false 为负例；不用任意字符串推测正例。Python 字符串标签在交接时映射为 `bool(label == positive_label)`，保留逐样本语义。
- score 为任意有限分数，数值越大越倾向正例；不要求概率，不限制为 [0,1]。probability 必须有限且在 [0,1]，不自动 sigmoid 或 clamp。
- 重复标签、重复预测、重复分数均有效，每行权重为 1；无 sampleWeight 或自动预测分类阈值。
- ROC 每个非空系列必须同时含正负例；PR 必须至少有一个正例，允许全正例；校准允许单一类别。PR 全负例返回明确错误，不复制 Python 警告后约定的退化输出。
- 空表有效；删除外部 metrics、positiveRate、threshold、FPR/TPR、Precision/Recall、分箱结果。校准旧 interval / lower / upper 不再接收；第一版仅生成可靠性曲线，不新增统计推断。

## 2. 混淆矩阵

- 维持一个矩阵，无 series。支持二分类和多分类的逐样本标签对。
- classOrder 省略时按每行 actual、predicted 首次出现形成类别并集；提供时要求非空、无重复，覆盖全部输入标签，并允许指定本批未出现的类别。
- 内部生成 K×K 单元格，未出现组合 count=0。classOrder 的额外类别是真实类别配置，不是虚构观测。
- normalization 沿用现有分母；零分母保留 null / NA 与灰色单元格。该行为与 sklearn 将零分母处理为 0 的显示约定有差异，文档明确说明。
- data=[] 时沿用暂无数据，即使提供 classOrder 也不合成一张伪计数图。

Python 参考：[ConfusionMatrixDisplay.from_predictions](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.ConfusionMatrixDisplay.html)。

## 3. ROC 与 PR 共用阈值统计

新增 src/common/binary-classification.ts，使用现有 seriesGroups，产生如下私有接口：

```ts
interface ThresholdCount { threshold: number; tp: number; fp: number }
interface BinaryThresholdGroup {
  series?: string;
  sampleCount: number;
  positiveCount: number;
  negativeCount: number;
  counts: ThresholdCount[]; // 分数降序，每个不同分数恰有一行
}
function buildBinaryThresholds(rows: readonly BinaryScoreRow[]): BinaryThresholdGroup[];
```

每组复制索引或必要记录后按 score 降序排序；一批相同 score 全部计入后才输出计数。同分内部排列不能改变结果。决策规则固定为 score>=threshold。

ROC：

- 起点 (0,0) 为阈值高于所有样本的连接点，不输出 Infinity；各有限阈值点为 (FP/Nneg, TP/Npos)，末点为 (1,1)。
- 保留所有不同分数阈值，不做 drop_intermediate、平滑或降采样；Python 核对显式使用 drop_intermediate=False。
- 按完整阈值计数生成点后计算梯形 AUC，不从渲染像素或用户给定曲线推算；同分交叉正负样本的贡献为半权重。
- 使用 linear，展示真实阈值点及组内 AUC / N；合成起点 tooltip 不显示有限阈值。

PR：

- 起点 (recall=0, precision=1) 无阈值；随后按分数降序生成 recall=TP/Npos、precision=TP/(TP+FP)，x 非递减。
- 保留重复 recall 的不同阈值点和最终 recall=1、precision=正例比例点；不把阈值点视为独立原始样本。
- AP=`sum((recall_i-recall_previous)*precision_i)`；不能用 PR 梯形面积替代 AP。绘制采用 stepBefore，升序 recall 的每个区间高度对应新区间的 precision。
- baseline=true 时，每个系列按自己的 Npos/N 生成原生辅助 line，使用相同 series 字段和分类颜色，原生图例统一过滤曲线与基线；不保留全表单个 positiveRate。
- tooltip 标明 AP、样本数、真实有限阈值和当前阈值点，不称为外部计算。

Python 参考：[ROC](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html)、[PR 阈值与端点](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html)、[AP 的非梯形定义](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)。Python PR 数组按 recall 降序返回，对照 fixture 将点和阈值配对后反转，不能分别排序两轴。

## 4. 校准分箱

- binCount 默认 5，正整数 1–512；strategy 默认 uniform。各组独立确定 quantile 边界；uniform 各组共享 [0,1] 等宽边界。
- quantile 边界直接复用 vutils quantileSorted 的线性插值，取 q=j/B。排序只在编译发生。
- 为对齐 sklearn，使用内部边界的 lower-bound 位置入箱：恰好等于边界时进入左侧箱，即首箱 [0,b1]、后续 (bi,bj]。这是与 histogram 不同的明确契约。
- 重复分位数边界保留，lower-bound 决定归属；空箱不生成点。常数概率可形成一条非空结果，其箱宽为 0 时仍有效，不套用旧 binStart<binEnd 校验。
- 每个非空箱生成 binStart、binEnd、count、meanPredictedProbability、observedRate；count 之和等于本系列 N。均值和正例率按箱内样本直接计算。
- 按箱序 linear 连接，保留理想校准 y=x 参考线。不同系列 quantile 箱不宣称共享边界；tooltip 给出箱边界、count 和两个比率。

Python 参考：[calibration_curve](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.calibration_curve.html)；具体端点规则来自 [固定版本源码](https://raw.githubusercontent.com/scikit-learn/scikit-learn/afe5bcd80ce17fd8ca88c33beb17534bd36423bc/sklearn/calibration.py)。

## 5. 文件映射

路径相对 packages/vchart-statplots：

| 文件 | 职责 |
| --- | --- |
| src/common/binary-classification.ts（新增） | BinaryScoreRow 对应的分组排序和同分累计计数，不含图元 |
| src/plots/confusion-matrix/aggregation.ts（新增） | 类别顺序、K×K 计数及归一化 |
| src/plots/roc/distribution.ts（新增） | 阈值统计映射、AUC 和合成起点 |
| src/plots/precision-recall/distribution.ts（新增） | 阈值统计映射、AP、正例比例与基线 |
| src/plots/calibration/binning.ts（新增） | 等宽 / 分位数边界、归属、箱内统计 |
| 上述四个 plots/*/types.ts、validate.ts、compile.ts | 公共输入、廉价语义校验、结果编译；公开 BinaryScoreRow 从 roc/types.ts 导出，PR 以 type import 复用 |
| __tests__/unit/confusion-matrix.test.ts、binary-classification.test.ts、precision-recall.test.ts、calibration.test.ts（新增），roc.test.ts（修改） | 独立数学预期及新契约 |
| __tests__/fixtures/classification.ts（新增） | 固定 Python 输出、版本、完整参数 |
| __tests__/browser/classification.spec.ts、classification-performance.spec.ts（新增） | 真实图元、交互与性能 |

## 6. 执行任务与数值反例

### 任务 A：原始标签混淆矩阵

- [ ] 先新增输入 [(A,A),(A,B),(A,B),(B,B)] 的失败测试；classOrder=[A,B,C] 时矩阵为 [[1,2,0],[0,1,0],[0,0,0]]。actual 归一化 A 行为 [1/3,2/3,0]，C 行为三个 null。
- [ ] 运行 `npm test --prefix packages/vchart-statplots -- --runInBand confusion-matrix.test.ts`，确认旧输入契约失败。
- [ ] 实现 aggregation / types / validate / compile，更新 Schema；删除原始标签组合唯一性与“必须手动补全零计数”的校验。
- [ ] 覆盖单类别、缺少 classOrder 标签、重复顺序、输入冻结、空数据、旧 count 拒绝；迁移全部矩阵示例。
- [ ] 浏览器 hover 检查零计数和 NA，修改一个预测标签时同实例对应两个单元格改变；完成定向检查后独立审阅。

### 任务 B：共享阈值、ROC 与 PR

- [ ] 先新增失败测试；score=[0.1,0.4,0.35,0.8]、actual=[false,false,true,true]。

```ts
const expectedRoc = [[0, 0], [0, 0.5], [0.5, 0.5], [0.5, 1], [1, 1]];
const expectedPr = [[0, 1], [0.5, 1], [0.5, 0.5], [1, 2 / 3], [1, 0.5]];
const expectedAuc = 0.75;
const expectedAp = 5 / 6;
```

- [ ] 再新增一正一负同分的反例：ROC 只含起点和 (1,1)，AUC=0.5；PR 只含起点和 (1,0.5)，AP=0.5，同分输入换序结果一致。
- [ ] 在实现前运行 `npm test --prefix packages/vchart-statplots -- --runInBand binary-classification.test.ts roc.test.ts precision-recall.test.ts`，确认新输入失败。
- [ ] 实现共享阈值模块和两种映射；删除旧外部指标校验，增加系列内类别有效性校验，重新生成 Schema。核心 AP 累加必须直接使用上述非梯形定义。
- [ ] 覆盖分数超出 [0,1] 有效、NaN/Infinity 无效、系列独立、PR 全正例、全负例拒绝、ROC 单类别拒绝、输入冻结及旧字段拒绝。
- [ ] 浏览器检查 ROC 真实折线、PR stepBefore、hover 指标及基线；更新标签或分数后几何与指标改变；图例过滤同步影响所属基线。迁移主例、最小与分组例，并登记同分和不等正例比例变体。
- [ ] 比对提交的 Python fixtures，再完成定向检查与独立审阅。

### 任务 C：校准原始概率

- [ ] 新增失败用例：probability=[0,0.5,0.5,1]、actual=[false,true,false,true]、uniform 两箱；期望 count=[3,1]、均值=[1/3,1]、observedRate=[1/3,1]。恰好 0.5 入左箱锁定端点规则。
- [ ] 新增四个 probability=0.5、actual=[true,true,false,false] 的 quantile 四箱反例；只生成一个 count=4、均值与正例率均 0.5 的点，不复制分位数箱或丢掉观测。
- [ ] 运行 `npm test --prefix packages/vchart-statplots -- --runInBand calibration.test.ts`，确认旧结果输入要求导致失败。
- [ ] 实现 binning / types / validate / compile，删除旧结果顺序、箱宽和外部 interval 校验；重新生成 Schema。
- [ ] 覆盖 0/1、空箱、常数、单样本、全部正例/负例、分组、quantile 不等宽、非法概率/箱数/策略、冻结输入及旧字段拒绝；更新示例、文档和 fixture。
- [ ] 浏览器修改 strategy / binCount 后检查真实点和 tooltip 的 count、边界及均值改变，resize 保持箱统计；完成定向检查与审阅。

### 任务 D：四图整体验收

- [ ] 按总计划执行完整验收，迁移所有旧测试输入，替换旧 Python ROC 交接例。
- [ ] 复杂度记录：矩阵 O(N+K²)，ROC/PR 每组 O(NlogN+U)，uniform 校准 O(NlogB+B)，quantile 校准 O(NlogN+NlogB+B)。U 是不同分数数目；保留全部不同阈值意味着渲染规模可到 N。
- [ ] 性能同时使用大量同分和全部不同分数，不能只测两个阈值；记录 10k、100k 与 20 图表的实际代价和绘图点数。
- [ ] 验收记录明确 Python 的单类警告行为、矩阵 NA 约定和完整阈值配置差异；提交仅在用户要求时执行。

完成标准：调用方仅提供逐样本预测结果；曲线、矩阵、分箱和指标均由库生成，同分及边界正确，所有结果可用离线 Python fixtures 独立核对。
