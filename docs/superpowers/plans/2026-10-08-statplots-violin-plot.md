# StatPlots violinPlot 原始样本重构方案

**状态：** 用户已确认并完成实施与验收；详见 packages/vchart-statplots/docs/validation.md。

**目标：** 调用方提供原始分类观测，violinPlot 在编译阶段计算核密度并绘制轮廓。与 kdePlot 使用相同统计规则，保留 category + series 比较和现有宽度归一化能力。

## 1. 选择与范围

采用原始样本的单一契约，与已经完成的 histogram、KDE、ECDF、boxPlot 一致。

- 原始输入 + 共享 KDE 模块：配置直接决定统计结果，两个图保持一致，采用。
- 在 violinPlot 内复制 KDE 实现：短期改动少，但带宽、核函数和数值边界会分叉，不采用。
- 同时支持原始样本和预计算密度：增加公共类型和校验分支，目前没有已承诺的兼容需求，不采用。

不增加权重、按样本数缩放宽度、每组独立参数、半小提琴、split violin、箱体/散点叠加或横向布局。本轮不修改自定义系列的图元热路径，除非真实测试证明标准绘制存在问题。

## 2. 公共契约

```ts
interface ViolinPlotRow extends SeriesRow {
  category: string;
  value: number;
}

interface ViolinPlotSpec extends BaseSpec {
  type: 'violinPlot';
  data: ViolinPlotRow[];
  estimation?: KdeEstimationSpec;
  sampling?: KdeSamplingSpec;
  densityNormalization?: 'width' | 'area';
  fieldLabels?: { category?: string; value?: string; density?: string };
}
```

公开输入删除 density。旧字段由生成 Schema 明确拒绝，不把旧采样点冒充原始观测。

- category + series 为一个分布；省略 series 时按 category 分组。保留同类别内多系列比较。
- 分组顺序按首次出现确定，不补齐没有观测的组合；series 保持全部提供或全部省略的现有规则。
- value 为有限数值；原始数据允许乱序、重复值，重复观测分别参与统计；不修改调用方数据。
- estimation.kernel 默认 gaussian，可选 epanechnikov。
- estimation.bandwidth 默认 scott，可选 silverman 或有限正数；各组独立估计。带宽使用 value 的单位。
- sampling.points 默认 256，整数范围 2–2048，控制每组轮廓采样精度，与 kdePlot 一致。
- 空表合法。单样本和常数组无法自动得到正带宽，必须显式指定正数带宽，与 kdePlot 一致。

最小配置：

```json
{
  "type": "violinPlot",
  "data": [
    { "category": "A", "value": 3 },
    { "category": "A", "value": 1 },
    { "category": "A", "value": 1 },
    { "category": "B", "value": 5 },
    { "category": "B", "value": 8 }
  ]
}
```

## 3. 共享统计与轮廓生成

从 src/plots/kde/estimation.ts 提取与图表分组维度无关的 KDE 模型、网格和轴域逻辑到 src/common/kde.ts。公共配置类型放在独立的共享类型模块；kde/types.ts 继续导出已有 KdeEstimationSpec / KdeSamplingSpec 名称，保持 KDE 的公共 API。

共享模块接收已分组的原始 value、首条输入索引及 estimation / sampling；返回模型、递增网格、绘制范围和结构化问题。模块不能依赖某个 plot 的类型，也不通过虚构 series 名来复用 compileKde。

两种图只负责不同的分组和输出映射：

1. kdePlot 按 series 分组，继续输出 value / density 曲线。
2. violinPlot 按 category + series 分组，生成相同 value / density 曲线，加上分类标识、私有轮廓宽度和摘要。
3. KDE 算法继续直接调用已有 @visactor/vutils 的 kde、gaussian、epanechnikov。Scott / Silverman 采用当前 vutils 的算法，不另实现同名规则。
4. 每组 Gaussian 绘制域为 [样本最小值−3h, 样本最大值+3h]，Epanechnikov 为 [样本最小值−h, 样本最大值+h]，其中 h 是实际带宽。
5. 两个图使用相同等距网格和模型密度；不补造零密度端点，不二次平滑，不把截断域内密度重新归一化。
6. violinPlot 的数值轴覆盖所有组绘制域，设置明确 min / max 和 nice=false，避免核尾部裁切。

沿用 KDE 的有限带宽、密度尺度、可表示跨度和严格递增采样网格校验。校验不执行完整 O(N×points) 密度评估；完整模型评估每组只在编译阶段执行一次。

极窄带宽和过稀网格可能错过核的有效支撑，导致所有采样密度为零。编译生成轮廓时必须检查峰值和梯形面积为有限正数；失败返回 StatPlotValidationError，错误路径 /sampling/points，提示增加采样点或调整带宽。validateStatPlot 负责结构、原始数据和模型/网格的前置校验，这个依赖实际密度评估的错误在编译阶段报告。不得通过补造密度、忽略分组或自动修改参数隐藏问题。

## 4. 宽度和 tooltip

保留 densityNormalization 的现有含义，仅计算私有 __densityWidth，不修改概率密度：

- width（默认）：每组除以自身采样峰值，最大宽度相同；宽度不编码样本数。
- area：每组除以自己的采样梯形面积，再使用同一全局缩放系数，保持绘制轮廓的等面积关系，并限制最大宽度。

面积按实际绘制采样点计算，表示轮廓归一化；不能声称 Gaussian 截断网格的积分恰好为 1。area 模式也不表示样本数。

继续使用现有 statplotsViolin 自定义 AreaSeries，分类带宽控制横向半宽；render / resize / hover 不遍历原始样本、不重新估计 KDE。

面积图元的 tooltip 展示组摘要：category / series、样本数、原始最小值/最大值、实际带宽、采样峰值密度。字段名称随 fieldLabels 生效。不得把首个采样点当作当前鼠标位置，也不得把扩展后的绘制域当作原始样本范围。

### Python 对照核查

已核查 Seaborn 0.13.2、SciPy 和 Matplotlib 官方文档/实现。原始样本、分类/系列分组、KDE 轮廓的流程一致，不承诺默认参数或数值逐点一致：

- Seaborn 默认 area / 100 点 / cut=2；本图保留 width / 256 点 / Gaussian cut=3，与已有 KDE 和小提琴默认值保持一致。
- Seaborn/SciPy 的数字 bw_method 是带宽系数，本图数字 bandwidth 是实际宽度；SciPy 使用样本协方差，vutils 使用总体标准差。
- Seaborn 的 area 使用概率密度和组间峰值尺度，受 common_norm 影响；本图按实际采样梯形面积归一，确保绘制轮廓的面积关系。
- Seaborn 常数组画退化线段；本图显式带宽后绘制 KDE，与 kdePlot 统一。

来源与完整差异已写入 packages/vchart-statplots/docs/plots/violinPlot.md。

## 5. 实施任务

### 任务 1：共享 KDE 与原始输入

涉及 src/common/kde.ts、共享配置类型、src/plots/kde/{types,estimation,validate,compile}.ts、src/plots/violin/{types,validate,compile}.ts；可新增 violin/estimation.ts 封装分类分组和轮廓统计。

- [x] 先增加确定性测试：原始乱序和重复值合法，旧 density 输入拒绝，分组独立，冻结输入不变。
- [x] 使用解析公式断言固定带宽的 Gaussian / Epanechnikov 密度，不用生产估计函数生成期望结果。
- [x] 同一原始组、相同配置的 kdePlot 与 violinPlot 输出网格和密度完全一致；同时用既有 KDE 数学测试验证共享提取没有改变行为。
- [x] 覆盖默认/固定/Scott/Silverman 带宽、核函数、采样点数、单样本/常数显式带宽、空表、非法参数和不可表示范围。
- [x] 验证 width 峰值归一化、area 的实际等面积、归一化不改变 density。使用不同尺度分布，避免测试退化为两个完全相同轮廓。
- [x] 覆盖采样漏掉有效支撑时的零面积错误，禁止输出 NaN / Infinity 宽度。
- [x] 抽取共享模块并实现原始分类 KDE、摘要、轮廓归一化及明确数值轴域；删除旧输入密度/顺序校验。

### 任务 2：Schema、示例和文档

涉及生成 Schema / validator，examples/specs/{violinPlot,minimal/violinPlot,grouped/violinPlot,invalid/violinPlot,variants/violinPlot-area}.json 和 index.json；docs/plots/violinPlot.md、spec.md、computation-contract.md、catalog、迁移说明、README 及 chart-intents fixture 中的相关条目。

- [x] 重新生成 Schema，确认公共 density 删除，共享配置和中文说明一致。
- [x] 用真实原始观测重写所有示例；增加并登记固定带宽、常数、核函数和采样配置示例。
- [x] 分类与系列示例保留不同组分布的比较目的，不能把旧密度网格中的横坐标直接改成原始样本。
- [x] 说明带宽、核支撑、截断绘制域、采样精度、两种宽度归一化和破坏性迁移方式。
- [x] 更新图表选型描述，删除“必须已有密度采样”的限制。
- [x] 执行 Schema / examples / catalog 一致性检查、TypeScript、eslint 和包全量单元测试。

### 任务 3：真实浏览器、生命周期和性能

涉及 __tests__/browser/semantics.spec.ts、first-phase.spec.ts、lifecycle.spec.ts、entrypoints.spec.ts / esm.html；新增针对原始 violin 的浏览器用例，迁移 compare-performance.spec.ts 的预计算输入，更新 benchmarks 和 docs/validation.md。

- [x] 断言每个 category + series 的轮廓数、采样数、宽度和 y 域；系列颜色和分类位置正确。
- [x] 真实 hover 断言原始范围、样本数、实际带宽和密度标签；真实点击图例断言对应系列轮廓隐藏。
- [x] 同实例 updateSpec 改样本、带宽、核、采样数和归一化，断言数据与轮廓实际变化；覆盖分组增删、空表往返、theme、resize、release。
- [x] 迁移 ESM 原始输入，验证 CJS / ESM / UMD 入口；运行包全量 browser，保护共享 KDE 的现有渲染和交互。
- [x] 使用固定数据重复定向用例和静态截图，审阅等宽/等面积、多系列、常数组截图；用临时错误带宽、丢失重复值、错误宽度归一化检查测试能够失败，再恢复实现。
- [x] 测量 10k / 100k 原始样本的一组/多组编译、render、update、resize、release 和多图页面；记录样本数与每组绘制点数，不能把旧预计算性能直接当作新统计性能。
- [x] 所有编辑完成后运行原生 charts/area 官方 develop 视觉比较，审阅 agent-summary.md / 三图报告；原生通过不替代 StatPlots 统计和自定义轮廓验收。

全部命令使用 Node.js 22，从仓库根运行：

```sh
export PATH=/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH
npm test --prefix packages/vchart-statplots -- --runInBand violin.test.ts
npm run build --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm run eslint --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots
node packages/vchart/scripts/visual-test.mjs --dir charts/area
```

不增加依赖；不改锁文件。原生视觉测试期间不编辑工作区或并行运行依赖 CJS 构建的测试。视觉构建结束后按需恢复 vutils-extension 的完整构建。若涉及原生核心修复，补充有明确目的且已登记的原生用例；提交 PR 前运行原生全量比较并如实记录差异和阻断。

## 6. 完成标准

仅用原始 category / value 即可生成小提琴；category + series 独立统计；重复样本保留权重；统计与 kdePlot 一致；配置真实生效；数值轴覆盖核尾部；宽度归一化和 tooltip 含义明确；旧契约明确拒绝；统计不进入绘制和交互热路径；文档、示例、Schema、测试与性能证据一致。

当前按会话既有流程，用户确认方案后顺序实施；用户要求提交时再提交，保留正常 hooks，不默认推送或创建 PR。

## 7. 验收结果

23 套 / 466 项单元测试、219 项完整 Chromium 回归、15 项定向重复通过；五组静态截图各五轮字节一致。官方 develop 原生 charts/area 比较 10/10，通过且没有视觉差异或执行错误。10k / 100k 及多图生命周期结果归档到 benchmarks/violin-results.json。实现没有修改原生核心、图元热路径、依赖或锁文件；Python 差异和编译阶段零面积错误已文档化。首次性能用例新增单样本类别不符合自动带宽契约，修正测试数据后定向及全包重跑通过。
