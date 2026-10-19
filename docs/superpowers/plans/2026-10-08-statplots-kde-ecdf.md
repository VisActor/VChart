# StatPlots KDE / ECDF 原始样本重构方案

**状态：** 已按用户确认执行；保留分组。实施与验收结果见 packages/vchart-statplots/docs/validation.md。

**Goal:** `kdePlot`、`ecdfPlot` 接收原始样本，在编译阶段复用 vutils 计算统计曲线。

**Architecture:** 公共 spec 描述观测和计算配置，统计模块生成私有绘图数据，compile 输出原生 VChart line spec。计算、边界校验和绘制彼此分离，render / resize / hover 不执行统计计算。

**Tech Stack:** TypeScript、`@visactor/vutils ~1.0.24`、VChart、生成式 JSON Schema / AJV、Jest、Playwright；Node.js 22。

## 1. 选择与范围

推荐直接替换两个图表的输入契约：接收原始样本，复用现有 `kde()` / `ecdf()` 的 `evaluate()`，保留当前系列比较能力。

- 继续接收预计算结果：无法解决“统计图要求调用方自己计算”的问题。
- 同时接收原始和预计算结果：增加两套输入、校验和文档路径，并让同名配置具有不同语义，不采用。
- 仅接收原始样本：契约清晰，与 histogram / hexbinPlot 的编译计算路径一致，采用。

已有概率密度或累计概率的调用方改用 VChart 原生 line；本包不通过删除结果字段、反推计数或展开伪造观测来迁移。

本次不扩展 violinPlot、pairPlot 对角 KDE、二维 KDE、权重、累计密度、补累积分布、异步计算、每系列配置或自定义核函数。无需修改、发布 VUtil 仓库即可完成。

## 2. 公共输入与破坏性变更

```ts
interface KdePlotRow {
  value: number;
  series?: string;
}

interface KdeEstimationSpec {
  kernel?: 'gaussian' | 'epanechnikov';
  bandwidth?: number | 'scott' | 'silverman';
}

interface KdeSamplingSpec {
  points?: number;
}

interface EcdfPlotRow {
  value: number;
  series?: string;
}
```

- 两图继续使用原有 type、data、fieldLabels、主题和颜色配置；row 仅允许 value / series。
- 原始数据允许无序和重复值；每行代表一条观测，重复值分别参与统计。不修改调用方数组、行对象或配置。
- value 必须是有限 number；拒绝 NaN / Infinity、字符串、null，不静默清洗。
- series 沿用 `checkSeries`：全表全部提供非空系列名，或全部省略。按首次出现顺序保持颜色、图例和分组顺序。
- 拒绝旧输入字段 density / cumulativeProbability；它们仅保留为生成数据、轴和 tooltip 的名称。
- estimation 从说明信息改为有效计算配置。任意 kernel 字符串不再接受。
- 空 data 合法，使用已有“暂无可绘制数据”行为，不向 vutils 提交空组。

最小配置都只需 type 和 data：

```json
{ "type": "kdePlot", "data": [{ "value": 0 }, { "value": 1 }, { "value": 1 }, { "value": 4 }] }
```

```json
{ "type": "ecdfPlot", "data": [{ "value": 4 }, { "value": 1 }, { "value": 0 }, { "value": 1 }] }
```

## 3. KDE 的计算和绘制契约

### 统计参数

- kernel 默认 gaussian；字符串映射到 vutils 的 gaussian / epanechnikov 函数。
- bandwidth 默认 scott；正数表示以 value 的单位指定固定带宽，字符串表示调用 vutils 对应的自动带宽方法。
- 自动带宽按每系列独立估计；固定带宽在所有系列使用同一个值。
- 沿用 vutils 的实际算法，文档写明其总体标准差及一维 Scott / Silverman 公式，不能宣称为包含 IQR 的另一种 Silverman 实现。
- 每个系列以自身样本数归一化；不是按全表样本数加权。密度峰值可以大于 1。

### 绘制采样

- 新增 sampling.points，默认 256，整数范围 2–2048；它只控制曲线离散精度，不改变带宽和估计方法。
- 每系列独立构造等距网格：gaussian 使用 `[min - 3h, max + 3h]`；epanechnikov 使用 `[min - h, max + h]`。
- Gaussian 的显示范围是有限截断，理论尾部仍在范围外。每个高斯核保留至少约 99.73% 的质量；不重归一化截断曲线，不承诺离散折线面积精确为 1。
- 使用 `model.evaluate(grid)`，不用只覆盖样本范围的 `evaluateGrid()`。
- x 轴取各系列绘制范围的并集，并禁用 nice 扩展；各系列共享坐标尺度，不要求共享网格点。
- 输出 value / density / series，使用 linear 连接，不二次平滑。关闭采样点符号；采样点不是原始观测。
- 用户指定特别小的带宽时，可以增加 sampling.points 改善显示；不偷偷放大带宽，也不按原始样本数生成额外绘图点。

### 常数与数值边界

- 单样本、常数系列不能从离散度自动估计正带宽：返回 INVALID_RANGE，指向该系列首条观测并说明需要显式提供 estimation.bandwidth。
- 显式正带宽下，单样本和常数系列正常估计并绘制；不接受 vutils 零带宽返回的全零曲线作为有效密度。
- 固定带宽必须有限且大于 0；有效带宽、绘制范围、密度尺度须可用有限数表示。
- 网格必须能形成要求数量的严格递增有限坐标；指定的采样精度不可表示时，返回 INVALID_RANGE 指向 sampling.points，提示减少点数或转换数值单位。
- 自动带宽溢出、数值跨度或密度尺度不可表示时，明确返回 INVALID_RANGE，提示转换单位或平移数据；不在本包实现第二套带宽算法。

## 4. ECDF 的计算和绘制契约

- 每系列创建 `ecdf(values)`，取得排序后的不同观测位置作为绘制 x，再调用 `model.evaluate(xs)` 获取累计概率。
- StatPlots 的去重、排序仅负责选择和排列绘制坐标；累计概率、重复值权重、分母由 vutils 负责。不在本包另写累计计数算法。
- 不调用等距 `evaluateGrid()`，不对 ECDF 抽样或降采样，每一个真实跳点都保留。
- 例：原始 `[4, 1, 0, 1]` 的真实跳点为 `(0, 0.25)`、`(1, 0.75)`、`(4, 1)`；两个 1 必须形成 0.5 的跳跃。
- 继续使用 stepAfter，y 轴固定 `[0, 1]`。每系列最终累计概率为 1。
- 为完整显示首个跳跃及左右水平尾段，在共享 x 轴两端生成仅用于连接的边界点，概率分别为 0 / 1。它们不是观测，不能计入样本量。
- 共享 x 轴按全表范围左右各扩展跨度的 5%；常数值 v 使用 `max(0.5, abs(v) * 0.05)` 作为左右留白。留白只用于绘图，不影响真实跳点和概率。
- 单样本 / 常数系列在真实 value 从 0 跳到 1，仍然是有效 ECDF。
- 关闭点符号，tooltip 标注“累计概率”，展示计算结果。边界点如参与线 hover，只表示其 x 位置的 F(x)，不得描述为原始样本。
- 留白或轴跨度不可用有限数表示时返回 INVALID_RANGE，提示转换单位或平移数据。

## 5. 实现边界与文件

| 文件 | 职责 |
| --- | --- |
| packages/vchart-statplots/package.json、common/config/rush/pnpm-lock.yaml | 直接声明 vutils 依赖并通过 Rush 更新锁文件，避免依赖 VChart 的传递安装 |
| src/plots/kde/types.ts、src/plots/ecdf/types.ts | 新输入和配置；按现有方式导出新增配置类型 |
| src/plots/kde/estimation.ts（新增） | 分组、创建 vutils 模型、绘制范围和网格、生成私有密度行 |
| src/plots/ecdf/distribution.ts（新增） | 分组、真实跳点、调用 vutils evaluator、连接边界点 |
| src/plots/kde/validate.ts、src/plots/ecdf/validate.ts | 删除结果顺序/概率校验，校验新输入与可表示的计算参数 |
| src/plots/kde/compile.ts、src/plots/ecdf/compile.ts | 使用生成数据复用 lineChart，设置本图轴域和点符号 |
| src/types.ts、schema/、src/generated/validate.* | 公共导出及重新生成的契约 |

common/line.ts 新增可选 points / tooltipActiveType 参数，默认仍为显示点符号 / mark tooltip；semanticTooltip 统一支持 dimension。KDE / ECDF 关闭采样点符号时使用 VChart 原生 dimension tooltip；不改变 ROC / PR 等图表的默认行为。

KDE 校验只做 O(N) 的分组、带宽/范围检查，不执行 O(N × points) 密度网格计算；密度只在编译时求值一次。ECDF 校验不创建 evaluator、不排序，编译才排序和求概率。所有统计结果在 updateSpec 之前准备好，resize / hover / release 不访问原始样本。

## 6. 分步实施与验收

### 任务 1：原始 ECDF 输入与精确阶梯

- [x] 直接声明 `@visactor/vutils ~1.0.24`，使用仓库 Rush 流程更新锁文件；现有 bundler 只外置 VChart，检查 UMD 包含所需 vutils 函数且无新增浏览器全局要求。
- [x] 新增 `__tests__/unit/ecdf.test.ts`：无序 `[4,1,0,1]` 得到精确跳点、重复值权重、单样本、常数、空数据、分组各自到 1、输入冻结、旧结果字段及混合 series 拒绝。
- [x] 更新 types / validate / distribution / compile，重新生成 Schema。移除 distributions.test.ts 中“拒绝重复采样位置”的旧承诺。
- [x] 迁移主例 / minimal / grouped / invalid/ecdfPlot.json，新增重复值和常数变体并登记 catalog。
- [x] 同步 ECDF 中文文档、catalog、Spec 和计算契约，运行 ECDF 单元测试及 Schema / 示例 / catalog 检查。

核心反例必须断言跳点仍在 1，不能只检查累计概率数组：

```ts
import { compileStatPlot } from '../../src/compile';
import type { ICommonChartSpec, IDataValues, ILineSeriesSpec } from '@visactor/vchart';

test('ECDF 保留重复样本的真实跳点', () => {
  const native = compileStatPlot({
    type: 'ecdfPlot',
    data: [4, 1, 0, 1].map(value => ({ value }))
  }) as ICommonChartSpec;
  const values = ((native.series![0] as ILineSeriesSpec).data as IDataValues).values as {
    value: number;
    cumulativeProbability: number;
  }[];
  // 排除仅用于连接的左右两个边界点。
  const jumps = values.slice(1, -1).map(({ value, cumulativeProbability }) => ({ value, cumulativeProbability }));
  expect(jumps).toEqual([
    { value: 0, cumulativeProbability: 0.25 },
    { value: 1, cumulativeProbability: 0.75 },
    { value: 4, cumulativeProbability: 1 }
  ]);
});
```

### 任务 2：原始 KDE 输入与有效估计配置

- [x] 新增 `__tests__/unit/kde.test.ts`：在确定的 x 网格对固定带宽 / 两种核函数的数学结果断言；例如单样本 0、gaussian、h=1 时，x=0 的密度为 `1/sqrt(2*pi)`。
- [x] 覆盖默认 Scott / Silverman 配置、分组归一化、重复观测、有效参数改变结果、sampling.points 只改变网格、核支持范围、Gaussian 尾部、输入冻结。
- [x] 覆盖单样本 / 常数自动带宽明确报错、显式带宽有效、空数据、非有限输入、非正带宽、非法核及网格不可表示。
- [x] 更新 types / validate / estimation / compile 并重新生成 Schema；禁止在 semantic validation 中计算完整密度网格。
- [x] 用新原始样本替换主例 / minimal / grouped / invalid/kdePlot.json；不把旧密度采样 x 冒充原始样本。
- [x] 新增固定带宽、Epanechnikov 和常数显式带宽示例，登记 catalog，更新 KDE 中文文档及选型边界。

### 任务 3：真实浏览器行为与迁移说明

- [x] 新增 `__tests__/browser/kde.spec.ts` 和 `ecdf.spec.ts`，检查真实曲线点、轴域、概率/密度、图例、颜色与 hover tooltip。
- [x] ECDF 断言 x=1 的真实垂直跳跃、首尾平台及常数从 0 跳到 1；错误使用等距网格必须导致反例失败。
- [x] KDE 修改带宽 / kernel 后，同实例 updateSpec 的真实曲线位置与 tooltip 数值必须变化。
- [x] 数据更新、series 增删、light / dark、resize、空数据往返及 release：检查实例不替换、resize 不改统计值、释放后无 canvas。
- [x] 更新 README、docs/spec.md、docs/computation-contract.md、docs/plot-catalog.json、逐图文档、docs/catalog.md、迁移说明及已有引用旧数据的测试。
- [x] 只把 KDE estimation 列为参与计算的配置，保留其他图表 method / metric / distribution 的原有说明语义。
- [x] 固定数据和动画，新增浏览器截图重复运行五轮，审查变化并记录证据，不能把旧预计算曲线外观当作新估计必须相同的基线。

### 任务 4：完整检查与性能证据

- [x] Node.js 22 下执行包的 build、compile、eslint、check:schema、check:examples、check:catalog、全量 unit 和 browser 测试；具体结果和重跑记录见验收文档。
- [x] 性能使用确定性 10k / 100k 输入，分别记录 compile、render、update、resize、release；另外记录 20 图表创建/释放。ECDF 同时使用大量重复值和全部不同值，不能只测压缩后很少跳点的输入。
- [x] KDE 按 `O(sum(N_group × points))` 计算，绘图规模按系列数和 points 控制；ECDF 保留全部 U 个跳点，复杂度为每系列 `O(N log N + U log U + U log N)`。记录实际耗时和 U，不能承诺 ECDF 绘图规模恒定。
- [x] 记录 UMD 体积变化与基准，不为跨设备毫秒时间设任意失败阈值。
- [ ] 当前无需修复原生 line / axis；如未来发现需要修复，补充对应原生视觉用例，登记显式清单并运行相关目录官方 develop 比较；不填写占位 BugServer case IDs。
- [ ] 当前未创建 PR；每次提交 PR 前从仓库根运行全量官方 develop 视觉比较，审查 HTML / agent-summary.md；self-compare 仅验证稳定性。基线缺少新 StatPlots 功能或其他执行阻断如实记录，不写成通过。

包级命令从仓库根执行：

```sh
npm run build --prefix packages/vchart-statplots
npm run eslint --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
```

新增定向用例：

```sh
npm test --prefix packages/vchart-statplots -- --runInBand kde.test.ts ecdf.test.ts
npm run test:browser --prefix packages/vchart-statplots -- kde.spec.ts ecdf.spec.ts --repeat-each=5
```

建议按 ECDF、KDE、浏览器与验收记录形成可独立审阅的提交。当前会话逐项执行；不默认委派子任务。

## 7. 完成标准

两个最小配置只需原始 value；无序和重复样本语义正确；各系列独立归一化；KDE 参数真正影响估计；ECDF 没有遗漏或错移跳点；常数/空数据契约明确；拒绝旧预计算输入；示例、Schema、中文文档一致；真实渲染和更新有断言，性能与视觉验证有可追溯记录。
