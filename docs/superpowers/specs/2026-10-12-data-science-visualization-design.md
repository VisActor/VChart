# data-science-visualization 技能设计

日期：2026-10-12。工作分支：`codex/vchart-statplots`。技能代码位置：`skills/data-science-visualization/`。

本文与配套实现计划是本次交付；本次不创建技能实现、不安装技能、不发布 npm 包。

## 1. 目标与使用入口

用户提供数据并描述想观察的问题，技能选择合适的统计图，生成可直接打开、可交互、可继续修改的 HTML。用户不必先选择统计方法或编写 Spec。

典型请求：

- “看看收入分布，能调整分箱。”
- “比较各部门的收入，看看每个样本。”
- “看年龄、收入和消费之间的关系，按地区筛选。”
- “检查缺失的位置，不把零当缺失。”
- “把已经算好的 UMAP 坐标按类别画出来。”
- “把上一张箱线图改成小提琴图，保留数据和筛选条件。”

成功标准：真实数据、正确图义、可用交互、可复现输入，以及用户用自然语言继续修改的能力。入口按分布、比较、关系、质量四种目的展开；技术图名、参数和 Schema 按需读取。

## 2. 方案选择

| 方案 | 收益 | 代价 | 决策 |
| --- | --- | --- | --- |
| 新技能入口，复用 statplots 契约并提取图库的小型渲染控制器 | 意图清楚；计算与渲染只有一条标准路径；技能目录可独立复制 | 需要为表格映射和 HTML 提供少量辅助代码 | 采用 |
| 给 multivariate-analysis 增加画图模式 | 可利用已有报告产物 | 画图仍绑定分析流程、Python 科学计算依赖与证据结构；代码位于另一个仓库 | 保留为后续消费者，不作为新技能运行依赖 |
| 将整个 statplots 图库复制到技能 | 起步快、已有编辑器 | 用户仍要选择图名和编辑 JSON；导航、示例抓取与本地服务器不适合便携交付 | 不采用 |

## 3. 现状与可复用资源

核对基于分支起点 `5246208f7`：

- `packages/vchart-statplots/docs/plot-catalog.json`：28 类图、用途、避坑、别名、变体与示例路径。
- `docs/skill-authoring.md`、`docs/spec.md`、`docs/computation-contract.md`、`docs/colors.md`：语义生成、计算职责、区间和配色契约。
- `schema/plots/*.schema.json`、`docs/plots/*.md`、`examples/specs/`：逐图契约和可执行输入。
- `src/index.ts`：公共 `registerStatPlots`、`validateStatPlot`、`compileStatPlot`；没有公共 chart controller API。
- `examples/gallery.js` 的 `draw`：注册 → 校验 → 编译 → 初次 renderAsync / 后续 updateSpec；已有主题、配色、导出与释放路径。
- `__tests__/browser/semantics.spec.ts`：真实 pairPlot 框选按 ID 联动；`pairPlot` 图例明确 `interactive: false`。
- 外部参考：Statlas 的 `distribution/multivariate-analysis/assets/report-runtime.js` 已验证固定 UMD 顺序和 `tooltip.confine`；其 Python adapter 绑定分析证据、PCA 来源和 Bootstrap 结果，不能作为通用画图入口直接搬运。

源码 README 中“尚未发布”和源码包版本 2.1.7 不代表当前 CDN 状态。新技能固定使用已发布的 VChart/statplots `2.1.8-alpha.0` 组合；npm peer 元数据仍是 2.1.7，只承诺验收过的 UMD 组合。实现时核验发布物完整性与实际浏览器结果，不能从当前源码版本拼出不存在的 CDN URL。

## 4. 能力范围

### 4.1 第一版表格入口

自动字段映射覆盖以下 12 类图，不新增统计算法：

| 目的 | 图表 | 输入与选择规则 |
| --- | --- | --- |
| 分布 | histogram、kdePlot、ecdfPlot | 原始连续观测；histogram 单分布，分组分布优先 KDE/ECDF |
| 比较 | countPlot、boxPlot、violinPlot、stripPlot | 原始类别或 category/value；stripPlot 的 jitter/swarm 保留个体 ID |
| 关系 | scatterPlot、hexbinPlot、correlationMatrix、pairPlot | 原始 x/y 或 variables/observations；密集散点可选 hexbin；纯散点不自动加 fit |
| 质量 | missingValueMatrix | 保留原始列值与显式 null；0、false、JSON 空字符串均不是缺失 |

默认生成一张直接回答需求的图。只有多个互补视角有助于回答问题时，才生成多图页；不自动生成完整分析报告。未指定具体指标时，读取字段与小规模预览，优先选择有实际含义的指标，排除明显 ID。业务含义有多个合理解释且会改变图义时，先澄清关键字段。

### 4.2 已有语义输入与外部结果

直接语义 Spec 入口覆盖目录中的全部 28 类图，由上游 Schema 与公共校验器决定合法性。按需读取对应文档，不自建另一份 28 类协议。

外部 embedding、解释方差、预测、残差、重要性、SHAP 和区间必须来自用户真实提供的结果。只有原始高维表时不生成伪造坐标；未知区间含义不填写 confidence/0.95；ROC 要明确正例映射和标签/分数来源。

首版通用表格绑定只覆盖上表 12 类；其他图使用已准备好的语义 Spec。对原始配对/时间/模型结果表的便捷转换，可按逐图契约构造真实 Spec，但不承诺通用字段切换或自动筛选。这一边界要写进入口和示例。

允许用户明确请求 statplots 已支持的图内拟合、Bootstrap 或时间聚合；沿用上游计算及参数说明。默认表格探索不添加推断区间、回归或显著性检验。预测训练、PCA/FAMD 拟合、因果判断及完整分析报告不属于本技能。

## 5. 输入、输出与运行依赖

默认读取 CSV、TSV 或 JSON records；生成器只依赖 Python 3.11+ 标准库。已有纯语义 Spec 同样通过生成器打包。用户打开 HTML 只需要浏览器和可访问固定 CDN 的网络，不需要 Node、Python 或本地服务器。

XLSX 是可选转换入口：存在 openpyxl 时转换，缺依赖时明确提供安装命令或让用户导出 CSV；不为了绘图安装整个科学计算环境。不在浏览器下载解析用户的源文件。

生成文件：

- `visualization.html`：内嵌数据、控制器、绑定逻辑和样式，只有两个固定库从 CDN 加载。
- `visualization.request.json`：可重放的生成请求，记录用户选择的字段、类型和选项。
- `visualization.data.json`：实际内嵌的数据、稳定内部行 ID 和来源记录；复制这些输出后不依赖原始文件路径。
- HTML 中的“下载当前图表配置”：导出当前筛选状态对应的规范语义 Spec 数组，与画面一致。

每次生成写入新的输出目录，完整生成后整体移入目标位置；不部分覆盖旧产物。改图也生成新目录，方便比较和回退。

首版不提供离线 UMD 包、在线部署、React 工程生成或自动安装技能。

### 5.1 请求协议 v1

`VisualizationRequest` 顶层仅包含：`version: 1`、`title`、可选 `dataset`、`charts`、可选 `controls`。

`dataset` 包含：

- `source`：`{path, format: csv|tsv|json}` 或 `{records}` 二选一；路径相对请求文件。
- `columns`：`[{name, type: number|string|boolean, label?, unit?}]`；所有使用列显式声明类型。
- `missingTokens`：CSV/TSV 缺失标记，默认仅 `['']`；JSON 只有 null 缺失，列缺键报错。
- 可选 `idColumn`：单个观测的真实唯一字符串标识；不提供时按原始输入顺序生成 `row-1` 等稳定 ID，筛选时保留，不重新编号。

ChartInput 二选一：

1. 表格绑定：`{id, binding: {type, fields, options?}, caption?}`。
2. 已有结果：`{id, spec, source: {label, note?}, caption?}`。

同一图不能同时提供 binding 和 spec。binding.options 不能覆写 type/data/variables；fields 按表 4.1 的语义角色映射。展示文字优先使用已声明的 label/unit，只有支持 fieldLabels 的图才能填写它；矩阵变量名称保持真实列名，不捏造 fieldLabels 支持。

controls：`{filters?: [{field, kind: category|range}], variableSwitch?: [{chartId, role, candidates}], parameters?: [{chartId, path, values}]}`。只生成明确声明且已验证的控件；variableSwitch 仅允许 12 类绑定图中 value/x/y 的同类型列切换，不自动切换类别或矩阵维数。parameters 首版只支持 histogram 的 binning.binCount、statistic 和 correlationMatrix 的 method。

示例：

```json
{
  "version": 1,
  "title": "收入分布与年龄关系",
  "dataset": {
    "source": {"path": "customers.csv", "format": "csv"},
    "columns": [
      {"name": "region", "type": "string", "label": "地区"},
      {"name": "age", "type": "number", "label": "年龄", "unit": "岁"},
      {"name": "income", "type": "number", "label": "收入", "unit": "元"}
    ]
  },
  "charts": [
    {"id": "income", "binding": {"type": "histogram", "fields": {"value": "income"}, "options": {"binning": {"binCount": 20}}}},
    {"id": "relationship", "binding": {"type": "scatterPlot", "fields": {"x": "age", "y": "income", "series": "region"}}}
  ],
  "controls": {"filters": [{"field": "region", "kind": "category"}]}
}
```

### 5.2 数据处理边界

CSV 数值仅在显式 number 列转换，拒绝非有限数和非空非法字符串。保留字符串前导零；缺失不补零，重复观测不去重。原数据 SHA-256、原始行数、类型转换和缺失规则记录在输出；XLSX 记录 sheet 和原文件哈希。

数值型逐行图排除该图必需映射中的 null，并记录 omittedN；选定 series 的 null 同样排除并说明。矩阵保留每变量 null，让 statplots 处理逐对有效样本；有 series 的 pairPlot 只排除缺失系列的行，不整行删除数值缺失。missingValueMatrix 保留所有类型，不丢缺失行。

binding 中 category/series 要求 string 列；需要展示数值类别时，生成请求显式建立字符串列并记录转换。JSON 的有限数字、布尔和 null 原样保留，不用真假值判断缺失。

## 6. 复用架构与文件边界

```text
packages/vchart-statplots/
  examples/shared/statplot-controller.js  ← 从 gallery.draw 提取；唯一渲染控制器源码
  examples/gallery.js                    ← 使用控制器，保留图库导航和 JSON 编辑
  scripts/sync-visualization-skill.mjs    ← 发布物契约与控制器同步/校验
  __tests__/runtime/                     ← 控制器生命周期测试
  __tests__/browser/skill-*.spec.ts       ← 技能产物真实浏览器验收

skills/data-science-visualization/
  SKILL.md
  agents/openai.yaml
  scripts/generate_visualization.py       ← 薄 CLI
  scripts/visualization_io.py             ← 请求边界、文件导入、类型、来源
  scripts/visualization_html.py           ← 安全序列化、资产嵌入、输出文件
  assets/page.html / page.css             ← 图表页外壳
  assets/statplot-controller.js           ← 同步产物，禁止手改
  assets/data-bindings.js                 ← 12 类语义字段映射；无统计实现
  assets/page-runtime.js                  ← 控件、过滤、状态和错误展示
  references/intent-routing.md            ← 四种目的及边界，链接逐图参考
  references/input-and-interaction.md     ← 请求协议和交互口径
  references/statplots/                   ← 固定契约、示例、许可证及 manifest
  examples/                              ← 能直接运行的少量典型请求和小数据
  tests/                                 ← CLI/绑定行为测试，不加载到技能上下文
```

### 6.1 小型渲染控制器

浏览器全局 `StatPlotController.create({dom, animation?, confineTooltip?})` 返回：

- `update(spec): Promise<void>`：公共校验，公共 compile 一次；首次 new VChart/renderAsync，随后同实例 updateSpec。仅在全部成功后提交当前 spec。
- `exportPNG(name?): Promise<void>`：调用 VChart.exportImg(name)，name 是文件名，不是格式选项。
- `release(): Promise<void>`：关闭新请求、等待当前渲染完成、释放实例，重复调用不重复释放。
- 只读 `chart`、`spec`：原生实例与上次成功语义输入，用于页面能力和验收；不读取私有 series/data ID 作为业务逻辑。

每个控制器串行 update，失败不阻断后续请求；release 期间不能产生新的实例。用户输入校验错误保留路径。compile 阶段的范围等语义错误同样显示，不能只看 validate.valid。不在 hover/resize/brush 中 compile。

输入或 compile 失败不会触碰旧实例。原生 render/update 失败可能改变内部状态，因此不能仅保留旧 spec 并声称画面未变：释放受影响实例，有 lastSpec 时仅尝试一次按它恢复；恢复失败标记该图不可用并显示错误，允许后续明确更新。不进行无限重试。

图库默认保持现有 animation 和 tooltip 行为；技能使用 animation=false、confineTooltip=true。边界处设置 compiled.tooltip.confine，沿用原 Tooltip 内容；不改 statplots 语义 Schema。autoFit 使用 VChart 构造选项，不实现第二套 resize 循环。

控制器保存在已发布 examples 目录体系内，技能同步生成一份可嵌入资产。源路径和逐文件哈希进入 manifest；不增加 statplots 的公共 TypeScript 导出，不要求先发新 npm 版本才能使用技能。

### 6.2 资源同步

以 npm `@visactor/vchart-statplots@2.1.8-alpha.0` tarball 为契约源，验证 registry dist.integrity 后提取 catalog、四份公共契约文档、28 类 Schema/逐图文档及 catalog 引用的示例。保留 MIT 与第三方许可证。相对文档链接改为本地已包含文件或固定发布 URL，不留下不可访问路径。

同步脚本借鉴 Statlas 的 `scripts/sync-multivariate-statplots.mjs`，在 VChart 内独立维护，不运行或导入其他仓库代码。当前 workspace 控制器另外记录源码路径和 SHA-256。manifest 记录两种来源，不能将 workspace 资产冒充 npm 原文件。

`--check` 在离线状态验证快照、文件完整性和控制器副本一致性，不重新下载。更新版本必须明确改 manifest 的固定版本，并重新完成浏览器兼容验收；技能使用期间不查询 latest。

## 7. 交互语义

- Tooltip 和可交互图例使用原生能力。pairPlot 图例仅说明颜色，不能标注为过滤器。
- 筛选：从内嵌完整 dataset 得到子集 → buildBoundSpec → controller.update。所有绑定图重算；外部 Spec 图不受表格筛选，页面标注其范围。
- 框选：首版只承诺 pairPlot 原生跨面板高亮；不改样本分母、不重算统计、不实现跨 chart 选中即过滤。
- 字段/参数切换：重新构造完整语义 Spec；不能只改轴标签。范围控件明确左右端均包含，缺失值不满足范围；类别控件明确“全部”含 null，“特定类别”不含 null。
- 图例隐藏不是统计重算：沿用库语义；页面用“隐藏/显示系列”或“颜色说明”，不把它称为筛选。
- 清空筛选后恢复完整数据及原始 ID。高亮与筛选更新后按原生更新行为清除旧选中，不维持失效选择。
- 控件更新串行，执行期间禁用产生同类更新的控件；成功后才更新当前数据量与下载配置。失败时保留最后成功图，控件恢复到最后成功状态并显示原因。
- 多图筛选若部分更新失败，标明每张图实际采用的条件，不把失败图的旧数据说明改为新筛选口径；失败控件恢复后重新更新已经成功的图到上次一致状态。全局 filteredN 只在全批成功时提交。
- 页面显示 originalN、filteredN、每图 inputN 和 omittedN；matrix 的逐对 n 由原生 tooltip 展示。输入行数不能宣称是每组有效 n；外部 estimates 行数标明是结果行数。

## 8. 规模与性能

首版默认不自动抽样、不静默截断。生成器上限：8 张图、内嵌 payload 10 MiB、pairPlot 4 个变量、missing/correlation 矩阵 20 个变量。超过上限给出具体规模与可执行建议，调整字段或选取有说明的子集后重新生成。

以上图数、体积、变量数与几何预算也检查直接 Spec 入口，不通过更换输入模式绕过页面预算。

允许已经有来源说明的展示样本：记录 fullN/displayN、采样方式和来源；不能把展示样本统计称为全量统计。首版不提供“抽样显示但全量分箱”的混合输入，因为现有 pairPlot 契约不能同时接收两套样本。

额外计算规模上限：pairPlot 的 N×K×(K−1) ≤ 120000；missingValueMatrix 的 N×K ≤ 200000。raw scatter 1 万观测优先建议 hexbin，不自动更换。KDE/violin 分组超过 20 时提示选择范围。这些是生成入口的预算，不修改库本身能力。

resize/tooltip/brush 不扫描 dataset 或重新统计。筛选只在明确用户提交时重算。10k 行和 4 图页面记录首绘、筛选更新、主题切换、resize 和 release 的耗时及内存，不把 hover 纳入重新编译路径。

## 9. 交付与失败行为

HTML 标题、说明和源数据文本转义；application/json 中的 `<` 转义为 `\\u003c`，禁止请求携带任意 HTML/JS 回调。绑定记录中只嵌入已声明且需要的列；源文件不上传。schema 结构和映射错误在边界暴露，不把非法输入转成零、截断概率或自动猜测字段。

CDN 加载失败时提供可读的数据来源、静态样本量和明确错误，不显示永久“加载中”；配置下载仍能提供输入。单图失败标记该图，不把整个页面标成成功。空筛选显示空态并允许清空；有模型参数的空输入由上游拒绝则保留该错误，不伪造结果。

生成后必须实际打开页面，检查 Tooltip、声明的筛选和 pairPlot 框选；浏览器工具不可用时明确记录未完成交互验收。不要用文件存在或 canvas 存在代替可用图表。自然语言改图复用 request/data 和当前条件，重新生成并验收，无需重新计算外部模型。

## 10. 验收与范围外工作

验收包括：12 类真实表格映射；全部 28 类上游规范 Spec 的 UMD 渲染；实际 hover、筛选后的统计、pairPlot ID 高亮、同实例更新、主题/PNG、错误恢复、便携目录与中文/移动端布局。

技能入口验收使用普通用户请求，检查字段和图义选择、产物生成、自然语言修改；上游 89 条 chart-intents 只提供设计参考，其 catalog 检查不能替代模型行为验收。

抽取图库控制器需回归图库及上游 browser suite。涉及 VChart 核心时按 AGENTS.md 增补确定性用例并运行相关视觉回归；提交 PR 前必须运行全量官方 develop 基线视觉回归，基线缺少 statplots 新能力如实记录。文档计划本身不运行渲染测试，也不宣称实现已通过。

后续候选：配对/时间/模型评估的便捷表格绑定、跨图 ID 联动、离线库打包、已有分析技能复用控制器。首版不修改 Statlas 仓库、不迁移其分析证据、不把图表技能当模型训练引擎。
