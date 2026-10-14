# StatPlots qqPlot 原始样本重构计划

**Goal:** QQ 图接收原始一维样本，内部生成正态理论分位点、排序观测与参考线。

**Architecture:** 先将 vutils 现有内部逆正态 CDF 提升为公共工具；StatPlots 的 qq/distribution.ts 负责分组、绘图位置和参考线，compile 复用 scatter 与原生辅助 line。

**Tech Stack:** TypeScript、vutils quantileSorted / ordinaryLeastSquares / normalQuantile、VChart、Schema、Jest、Playwright；Node.js 22。

全局约束采用 [总计划](2026-10-09-statplots-raw-input-roadmap.md)。本阶段有明确上游前置条件，不影响 countPlot 和分类评估阶段交付。

## 1. 公共契约与支持范围

```ts
interface QqPlotRow { value: number; series?: string }
// 省略 BaseSpec / fieldLabels。
interface QqPlotSpec {
  type: 'qqPlot';
  data: QqPlotRow[];
  distribution?: {
    type: 'normal';
    mean?: number; // 默认 0
    standardDeviation?: number; // 默认 1，有限且 >0
  };
  referenceLine?: 'none' | 'identity' | 'quartiles' | 'regression'; // 默认 none
}
```

- 保留分组，无序、重复 value 有效；每系列独立排序，系列间共享数值轴。
- 第一版只支持具有显式参数的正态分布。拒绝任意 distribution 字符串；不把名称当成有效算法，不自动拟合分布参数。
- 系列有 N 条样本时，取 p_i=i/(N+1)，i=1..N；x_i=mean+standardDeviation×normalQuantile(p_i)，y_i 为排序后的第 i 条观测。
- 每条样本保留一个点，包括重复样本；不先压缩频数，不对经验分位数等距采样，不连接 QQ 点。
- 单样本在 p=0.5 绘制有效点；quartiles / regression 参考线要求每系列 N>=2，identity 不要求额外样本。常数样本的水平参考线有效。
- 空 data 合法；删除 theoreticalQuantile / sampleQuantile 结果输入及外部 slope / intercept。
- fieldLabels 继续描述生成结果的轴和 tooltip；展示理论分布参数、原始样本值和分位点位置。

绘图位置与默认参数对齐 [Statsmodels qqplot](https://www.statsmodels.org/stable/generated/statsmodels.graphics.gofplots.qqplot.html) 的 a=0、fit=False；不混用 SciPy probplot 的 Filliben 位置，不宣称支持所有 Statsmodels 分布与拟合选项。

## 2. 参考线

- none：不生成参考线；identity：绘制共享 y=x，覆盖共同可见数值域。单样本也须生成非零长度的有限线段，轴留白不改变样本或理论分位数。
- quartiles：使用 vutils quantileSorted 计算样本 Q25/Q75；理论分布取 p=0.25/0.75 的 x25/x75；slope=(Q75-Q25)/(x75-x25)，intercept=Q25-slope×x25。
- regression：以所有生成 QQ 点为 x/y，复用 vutils ordinaryLeastSquares 的均值统计接口，返回 coef.a=intercept、coef.b=slope；不调用包含无关 CI 计算的完整 regressionLinear 模型。
- quartiles / regression 每组生成各自线段，端点覆盖该组理论 x 范围；使用与 scatter 相同 series 字段的原生辅助 line，关闭其点符号，使用相同分类颜色及虚线。通过原生图例统一过滤点和参考线，不新增手工图元可见性兜底。
- identity 是所有系列共用的参考，使用无 series 字段的原生辅助 line，不生成额外图例项。其图例过滤语义与各组参考线区分记录。
- 不可表示的理论坐标、系数或参考线端点返回明确数值错误，不静默截断、替换成 0 或删除该组。

## 3. 上游前置任务：公共正态分位数

已确认当前 @visactor/vutils ~1.0.24 的 common/regression-utils.ts 内有 Acklam 逆 CDF，但 common/index.ts 未导出，且 p<=0 或 p>=1 返回 0，不适合作为公共统计契约。

VUtil 文件绝对路径：

- 新增 /Users/bytedance/Documents/opensource/VUtil/packages/vutils/src/common/normalQuantile.ts。
- 修改 /Users/bytedance/Documents/opensource/VUtil/packages/vutils/src/common/regression-utils.ts、common/index.ts。
- 新增 /Users/bytedance/Documents/opensource/VUtil/packages/vutils/__tests__/common/normalQuantile.test.ts。
- 回归检查现有 packages/vutils/__tests__/common/regression-linear.test.ts。

```ts
// 新公共 API；继续使用现有 Acklam 算法主体。
function normalQuantile(p: number): number;
// 有限 0<p<1：返回标准正态分位数；0/1：-Infinity/+Infinity。
// 非有限、超出 [0,1]：NaN，不返回伪造的 0 分位数。
```

- [ ] 先新增固定预期：p=0.5 →0、p=0.25 →-0.6744897501960817、p=0.975 →1.959963984540054，以及端点、非法输入和对称性。
- [ ] 将既有算法主体提取到新模块并公共导出；regression-utils 内部调用同一个函数，允许保留内部 invNorm 别名供现有导入使用，不保留第二份算法。
- [ ] 对 p∈[1e-12,1-1e-12] 固定 SciPy norm.ppf 网格，绝对误差要求 <=5e-8；重点覆盖 Acklam 的 0.02425 / 0.97575 分段附近。非有限端点不进入 StatPlots 的绘图数据。
- [ ] Node.js 22 下运行 vutils 的定向与完整单元、compile、build；核对有效 alpha 下既有回归置信区间没有行为回退。
- [ ] 通过仓库标准依赖流程验证公共导出可从包根消费；上游 API 发布后，StatPlots 依赖下限更新到实际含该 API 的版本，并通过 Rush 更新锁文件。当前不虚构发布版本、不自动发布、不直接改 node_modules。

发布版依赖尚不含公共 API 时，第 3/4 阶段只能进行明确记录的本地联调，不能写成可发版交付；第 1/2 阶段不受影响。

## 4. StatPlots 文件与接口

路径相对 packages/vchart-statplots：

- 新增 src/plots/qq/distribution.ts：`computeQq(spec: QqPlotSpec): QqResult`。
- `QqResult` 包含私有 points（theoreticalQuantile / sampleQuantile / probability / series?）及 referenceLines（series? / intercept / slope / xMin / xMax）。
- 修改 src/plots/qq/types.ts、validate.ts、compile.ts，删除预计算结果单调性校验；校验参数、分组、样本量及理论轴两端的可表示性，不排序或算完整 QQ 数据。
- 修改 package.json 与 common/config/rush/pnpm-lock.yaml 的真实 vutils 依赖；从包根 import 新工具。
- 新增 __tests__/unit/qq.test.ts、__tests__/fixtures/qq.ts、__tests__/browser/qq.spec.ts；迁移总计划中的旧示例与测试。

## 5. 执行步骤与验收

- [ ] 先增加失败用例：data=[3,1,2]，默认理论 x≈[-0.6744897501960817,0,0.6744897501960817]，样本 y=[1,2,3]；点位置绝对容差 5e-8。
- [ ] 运行 `npm test --prefix packages/vchart-statplots -- --runInBand qq.test.ts`，确认原始输入在旧契约下失败。
- [ ] 接入公共 normalQuantile；实现排序、位置与三个参考线方法；更新 types / validate / compile 并生成 Schema。
- [ ] 用 sample=[0,1,2,3] 检查 quartiles：Q25=0.75、Q75=2.25，intercept=1.5、slope≈1.111951663879201；改变 theoretical mean/std 后仅理论坐标及参考线响应，不自动标准化样本值。
- [ ] 覆盖重复样本全部保留、常数、单样本、分组、冻结输入、空数据、旧结果字段拒绝、非法 std、过少样本的参考线拒绝；加入固定 Statsmodels fit=False / a=0 fixtures。
- [ ] 浏览器检查真实点、理论轴标题、参考线位置、hover 值；分组线颜色、图例过滤真实响应；修改分布参数与样本后同实例几何改变，resize 数据不变。semantics.spec.ts 中 QQ 参考线检查迁移到真实辅助 line，校准参考线仍检查 markLine。
- [ ] 更新正态默认、显式参数、分组、参考线变体及文档；记录任意理论分布旧输入的原生 scatter 迁移方式。
- [ ] 执行总计划完整验收，记录 O(sum(N_group logN_group)) 排序和 N 个散点的渲染代价；100k 用例不可压缩为少量分位点。
- [ ] 上游和 StatPlots 各自形成可审阅的独立变更，提交与发布仅在用户要求时执行。

完成标准：QQ 点和参考线由原始观测生成，有明确正态支持范围；复用统一公共逆 CDF；数值、真实渲染与 Python 对照一致，依赖发布状态如实记录。
