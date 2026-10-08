# StatPlots boxPlot 原始样本重构方案

**状态：** 已按用户确认实施并完成验收；结果见 packages/vchart-statplots/docs/validation.md。

**Goal:** boxPlot 接收原始分类观测，编译阶段计算四分位数、须与异常值，统计配置真实生效。

**Architecture:** 公共输入描述 category / value / series；专属统计模块按 category + series 分组，复用 vutils 的 quantileSorted，生成私有箱线数据；compile 映射到原生 VChart boxPlot。校验不排序，排序和统计只在编译时执行一次，render / resize / hover 不访问原始样本。

**Tech Stack:** TypeScript、已有 @visactor/vutils ~1.0.24、VChart、生成式 JSON Schema / AJV、Jest、Playwright；Node.js 22。

## 1. 选择与范围

采用仅接收原始样本的单一契约，与已完成的 histogram / KDE / ECDF 重构一致。

- 保留预计算输入：无法解决调用方必须先统计的问题，不采用。
- 同时支持 raw / summary 两种输入：增加类型、校验和配置语义分支，目前没有真实兼容需求，不采用。
- 原始样本 + 编译统计：同一配置决定统计结果，调用路径清晰，采用。

保留 category 和可选 series 的现有比较能力。category 是横轴类别；series 是同类别内的系列，不能合并为一个字段。

本次只支持 IQR 须规则及倍数，不增加百分位须、min/max 须、权重、notch、均值点、方向配置、采样、每组参数或自定义四分位算法；不涉及 violinPlot。调用方持有预计算结果时使用原生 VChart boxPlot，不从五数摘要反推或伪造观测。

## 2. 公共契约

```ts
interface BoxPlotRow extends SeriesRow {
  category: string;
  value: number;
}

interface BoxPlotWhiskersSpec {
  /** IQR 围栏倍数，默认 1.5；有限且非负。
   * @minimum 0
   */
  iqrMultiplier?: number;
}

interface BoxPlotSpec extends BaseSpec {
  type: 'boxPlot';
  data: BoxPlotRow[];
  whiskers?: BoxPlotWhiskersSpec;
  fieldLabels?: { category?: string; value?: string };
}
```

最小使用只需 type 和原始 data；以下配置的异常值为 100：

```json
{
  "type": "boxPlot",
  "data": [
    { "category": "A", "value": 100 },
    { "category": "A", "value": 0 },
    { "category": "A", "value": 1 },
    { "category": "A", "value": 2 },
    { "category": "A", "value": 3 },
    { "category": "A", "value": 4 },
    { "category": "A", "value": 5 },
    { "category": "A", "value": 6 },
    { "category": "A", "value": 7 }
  ]
}
```

- 保留 type、标题、description、theme、colors 和 fieldLabels。
- 删除公共 q1 / median / q3 / whiskerLower / whiskerUpper / outliers；这些字段只存在于私有绘图数据。
- 删除必填说明字符串 whiskerRule，改为可选有效配置 whiskers.iqrMultiplier；省略 whiskers 或提供空对象均采用 1.5。自定义说明写入 description。
- 未知字段及旧输入由生成 Schema 拒绝，不维护兼容分支。
- value 为有限 number，拒绝 null、字符串、NaN / Infinity，不静默清洗。
- 重复 category + series 是同一组的多条观测，删除 checkUnique；重复 value 必须保留，包括重复异常值。
- series 复用 checkSeries：全部省略，或每条观测均提供非空系列名。
- category、series 的顺序分别按首次出现确定；相同系列在所有类别使用一致颜色。不存在的组合不补空箱。
- 不修改调用方数组、对象或配置；空 data 合法，沿用包已有空态。单样本和常数组合法。

## 3. 统计规则

每个 category + series 独立计算：

1. 收集 value 到新的 number[]，数值升序排序一次；用嵌套 Map 表达两个分组维度，不拼接字符串作为键。
2. 调用 quantileSorted(values, 0.25 / 0.5 / 0.75)，得到 Q1、median、Q3。采用 vutils 的线性插值：索引 (N-1)p，相邻值插值。不重复实现分位数算法。
3. IQR = Q3 - Q1；k = whiskers.iqrMultiplier ?? 1.5。围栏为 Q1-k×IQR 和 Q3+k×IQR，围栏本身不是须端点。
4. 下须候选是大于等于下围栏的最小观测，上须候选是小于等于上围栏的最大观测。
5. 若下须候选位于 Q1 内侧，或没有候选，下须取 Q1；若上须候选位于 Q3 内侧，或没有候选，上须取 Q3。始终保证下须 ≤ Q1 ≤ median ≤ Q3 ≤ 上须。
6. outliers 为严格小于下须或严格大于上须的原始观测；端点相等的值包含在须内，重复异常值重复保留，输出按数值升序。

第 5 条是线性插值四分位数下的小样本绘制规则，并非非法输入的防御式兜底。例如 [0,100,100,100] 得到 Q1=75，不能把实际候选 100 作为下须。该规则与 [Matplotlib boxplot_stats 实现](https://raw.githubusercontent.com/matplotlib/matplotlib/v3.10.7/lib/matplotlib/cbook.py)一致；这里只借鉴统计语义，代码独立实现，分位数仍复用 vutils。

明确以下边界：

- 单样本或全相同值：五数全部等于该值，outliers=[]；不伪造箱体高度或增加随机偏移。
- IQR=0 但存在其他值：[5,5,5,5,100] 的须均为 5，100 仍是异常值；不自动改为 min/max。
- k=0：围栏为 Q1 / Q3，合法；小样本没有候选时须停在四分位数。例如 [0,10] 得到五数 [2.5,2.5,5,7.5,7.5]，异常值 [0,10]。
- 大 k：允许所有样本落在须内；不设置没有统计理由的上限。
- 数据全表 max-min 不可表示为有限数时，公共边界返回 INVALID_RANGE /data，提示平移或转换单位；这同时保护原生轴跨度和 vutils 的插值差值。校验只需一次 O(N) 扫描。
- 围栏可在比较中超出有限数范围；其含义为该方向不排除观测，不作为渲染数据输出。无需仅因 k×IQR 溢出而拒绝有限数据；五数始终在样本范围内。

## 4. 数据流、绘制与 tooltip

新增 src/plots/box-plot/statistics.ts，只供包内部使用：

```ts
interface BoxPlotSummaryRow extends SeriesRow {
  category: string;
  q1: number;
  median: number;
  q3: number;
  whiskerLower: number;
  whiskerUpper: number;
  outliers: number[];
}

function summarizeBoxPlot(
  data: readonly BoxPlotRow[],
  iqrMultiplier: number
): BoxPlotSummaryRow[];
```

compileBoxPlot 调用 summarizeBoxPlot(spec.data, spec.whiskers?.iqrMultiplier ?? 1.5)，保留原生 boxPlot 的 minField / maxField / q1Field / medianField / q3Field / outliersField 映射及纵向布局。seriesField 仅在有分组时设置，图例跟随实际系列；y 域必须包含异常值。

tooltip 不再用一套 semanticTooltip content 覆盖箱体与异常点。保留原生 BoxPlotSeriesTooltipHelper 对异常点的识别，用公开 tooltip.mark.updateContent 翻译已生成内容：whiskerLower→须下端、q1→第一四分位数、median→中位数、q3→第三四分位数、whiskerUpper→须上端、outliers→异常值；category / series 的名称按现有展示规则处理。箱体展示五数统计；异常点展示实际异常值和所属分组。规则说明来自实际 k，放入图表说明或箱体 tooltip，不能影响异常点识别。hover 只格式化已有结果，不扫描样本，不依赖未公开的异常点字段名。

只修改本图实现，不扩展公共 tooltip 工具，不重写原生折叠异常值的数据变换。若真实浏览器暴露标准原生路径问题，先定位标准路径，再决定修复位置。

## 5. 实施任务

### 任务 1：原始输入、统计模块与编译

文件：src/plots/box-plot/types.ts、validate.ts、compile.ts；新增 statistics.ts 和 __tests__/unit/box-plot.test.ts。src/types.ts 已有 export *，新增配置类型随现有导出路径发布。

- [x] 添加确定性失败测试，使用 compileStatPlot 获取原生 series.data.values。普通样本断言实际数值，不用生产统计函数计算期望值：

```ts
import { compileStatPlot } from '../../src/compile';
import type { ICommonChartSpec, IBoxPlotSeriesSpec, IDataValues } from '@visactor/vchart';

const native = compileStatPlot({
  type: 'boxPlot',
  data: [100,0,1,2,3,4,5,6,7].map(value => ({ category: 'A', value }))
}) as ICommonChartSpec;
const rows = ((native.series![0] as IBoxPlotSeriesSpec).data as IDataValues).values;
expect(rows[0]).toMatchObject({
  category: 'A', q1: 2, median: 4, q3: 6,
  whiskerLower: 0, whiskerUpper: 7, outliers: [100]
});
```

- [x] 加入关键断言：[-2,1,1,2,2,3,3,4,6] 的围栏 [-2,6] 两端都不是异常值；[0,10] 的默认五数 [0,2.5,5,7.5,10]；[0,100,100,100] 的五数 [75,75,100,100,100]、异常值 [0]；[5,5,5,5,100] 的五数全为 5、异常值 [100]。
- [x] 加入重复极值测试：[0,1,2,3,4,5,6,7,100,100] 的 Q1=2.25、median=4.5、Q3=6.75、须 [0,7]、outliers=[100,100]；此数据不能先去重。
- [x] 参数测试：普通样本 k=0 时须 [2,6]、outliers=[0,1,7,100]；k=30 时上须变为 100、outliers=[]。覆盖 0、非整数正倍数、单样本、常数和空表。
- [x] 分组使用 A/X=[0,10]、A/Y=[100,110]、B/X=[20]，断言恰好三个箱，不生成 B/Y，数值和系列颜色互不污染。增加包含分隔符的类别/系列名，防止组合键碰撞。
- [x] 覆盖冻结输入、重复观测合法、混合 series 拒绝、旧字段/whiskerRule 拒绝、非有限 value / k、负 k、不可表示跨度；检查结构错误和 INVALID_RANGE 的准确路径。
- [x] 实现公开类型、O(N) 边界校验、嵌套分组和 vutils 四分位计算，删除结果顺序校验与 checkUnique，更新 compile 和原生 tooltip 内容翻译。
- [x] 重新生成 Schema，迁移 __tests__/unit/distributions.test.ts 与 naming.test.ts 中旧 BoxPlotSpec 用法，定向单元测试通过。

### 任务 2：示例、Schema 和迁移说明

文件：schema/plots/boxPlot.schema.json、schema/statplot.schema.json、src/generated/validate.*（生成）；examples/specs/{boxPlot,minimal/boxPlot,grouped/boxPlot,invalid/boxPlot}.json、examples/specs/index.json；docs/plots/boxPlot.md、docs/spec.md、docs/computation-contract.md、docs/plot-catalog.json、docs/catalog.md、docs/naming-migration.md、docs/naming-review.md、README.md。搜索其他旧引用后逐项核对。

- [x] 主例使用已知原始观测，不把旧五数或异常值摘要当作完整原始数据。分组例使用不同分布，体现 category + series 的独立计算。
- [x] 新增并登记 variants/boxPlot-singleton.json、boxPlot-constant.json、boxPlot-zero-iqr.json、boxPlot-whiskers.json、boxPlot-small-sample.json，覆盖上述明确的统计边界。
- [x] invalid/boxPlot.json 使用负 iqrMultiplier，index.json 登记 SCHEMA_ERROR 与 /whiskers/iqrMultiplier；旧输入拒绝另由单元测试锁定。
- [x] 逐图文档完整说明线性插值、默认 k、端点包含、小样本须停在箱边、重复样本、零 IQR、空表与系列规则；删除“没有须规则”的旧选型限制。
- [x] 更新计算契约和破坏性迁移说明，catalog 不再暗示须由调用方计算；类型、生成 Schema、中文文档和全部示例一致。
- [x] 执行 check:schema、check:examples、check:catalog、compile、eslint 和全量包单元测试，记录真实结果。

### 任务 3：真实渲染、更新、性能和验收

文件：新增 __tests__/browser/box-plot.spec.ts、box-plot-performance.spec.ts；使用已有 page.html 入口；扩展现有 entrypoints.spec.ts / esm.html 进行 ESM 原始 boxPlot 冒烟；新增 benchmarks/box-plot-results.json，更新 benchmarks/README.md 和 docs/validation.md。不要把只读 line 的 distribution-helpers.ts 改成万能图表 helper。

- [x] 真实浏览器读取 boxPlot 和 outlier 图元，断言箱数、五数对应的图元坐标、异常点数和 y 域包含极值；覆盖双层分组位置、系列颜色、图例和 fieldLabels。
- [x] 鼠标 hover 箱体与异常点，断言 tooltip 分别包含正确统计数值和异常值；不能只调用 tooltip callback 或截图代替交互断言。
- [x] 同实例 updateSpec 修改 k、value 和分组，断言须端点和异常点数量实际改变，旧异常点移除，系列增删有效。覆盖空表往返、light/dark、resize 和 release；resize 不改变统计值，release 清除 canvas。
- [x] 固定样本、动画和环境，重复五轮截图并检查一致性。临时把须写成围栏、丢弃重复样本、忽略 k，分别确认针对性测试失败，再恢复代码；不放宽阈值。
- [x] 10k / 100k 确定性样本分别测试一组、多组及大量异常点，记录 compile / render / update / resize / release，以及 20 图表创建释放。普通输入 value=(i*37)%1009、多组 category=String(i%10)；大量异常点输入按每五个值四个 0、一个 100 构造，确保 20% 观测成为真实异常点。统计复杂度 O(N + Σ N组 log N组)，内存 O(N)，绘图规模 O(箱数 + 异常观测数)；异常点不去重、不抽样，不能宣称绘图规模恒定。
- [x] 完整 build 后运行 ESM / CJS / UMD 原始 boxPlot 冒烟和包全量 browser；记录包体积变化、性能和真实渲染证据。
- [x] 从仓库根运行原生 charts/box-plot 目录官方 develop 比较，并读取三图报告与 agent-summary.md。StatPlots 新统计契约主要由包级数学/浏览器测试验证，不能把原生视觉通过等同于新统计已验证。
- 如果需要修复原生 tooltip / axis，新增目的明确的原生回归用例并登记显式清单，不填写占位 BugServer case IDs。提交 PR 前必须运行全量官方 develop 视觉比较；阻断与差异如实记录。

所有命令使用 Node.js 22，从仓库根运行：

```sh
export PATH=/Users/bytedance/.nvm/versions/node/v22.23.3/bin:$PATH
npm test --prefix packages/vchart-statplots -- --runInBand box-plot.test.ts
npm run build --prefix packages/vchart-statplots
npm run eslint --prefix packages/vchart-statplots
npm run check:schema --prefix packages/vchart-statplots
npm run check:examples --prefix packages/vchart-statplots
npm run check:catalog --prefix packages/vchart-statplots
npm test --prefix packages/vchart-statplots -- --runInBand
npm run test:browser --prefix packages/vchart-statplots -- box-plot.spec.ts --repeat-each=5
npm run test:browser --prefix packages/vchart-statplots
node packages/vchart/scripts/visual-test.mjs --dir charts/box-plot
```

现有 vutils 已是直接依赖，不增加依赖或更新锁文件。当前会话顺序实施，不默认委派子任务。用户要求提交时再进行提交，保持正常 hooks；不默认推送或创建 PR。

## 6. 完成标准

最小配置只需原始 category / value；category + series 独立统计；重复样本和异常值权重保留；IQR 倍数真正生效；小样本、零 IQR、常数与空表遵循上述契约；旧输入明确拒绝；Schema / 文档 / 示例一致；箱体和异常点均有真实 hover / update 断言；统计不进入 render / resize / hover 热路径；验证及性能结果可追溯。

## 7. 执行中发现并修正的问题

- common/chart.ts 原先用 title=undefined 表示无标题，但原生 updateSpec 合并配置时保留了先前空表的说明。统一编译明确的 visible/text/subtext，通过标准标题配置清除空态；原生核心没有改动。box-plot.spec.ts 断言空态出现后恢复数据时真实说明消失，包全量回归覆盖公共编译变化。
- 箱体默认填充与系列描边颜色不同，原生图例色块采用填充颜色；本图使用公开 legend.item.shape.style 将色块填充设为系列描边。浏览器断言图例颜色与对应箱体一致，已审阅 dark 截图。
- 五组静态截图显式调用公开 hideTooltip，避免鼠标移开后延迟隐藏造成截图残留；真实 hover 断言在隐藏之前完成。
- Jest 23 套 / 443 项、Chromium 全包 212 项、新增定向重复 15 项通过；五组截图各五轮字节一致。官方 develop 对比 charts/box-plot 4/4、components/title 1/1 通过，0 差异、0 执行错误。当前没有创建 PR，因此本轮没有执行原生全量比较。
