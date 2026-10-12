# 请求与交互协议 v1

顶层必填 version=1、title、charts；可选 dataset、controls、presentation。未知字段拒绝，图数 1–8。现成请求见 [distribution](../examples/distribution.json) 和 [明确交互](../examples/interactive.json)；文件路径相对 request 文件，不是 cwd。

## 数据入口

```json
{"source":{"path":"observations.csv","format":"csv"},"columns":[{"name":"id","type":"string"},{"name":"income","type":"number","label":"收入","unit":"元"}],"idColumn":"id"}
```

- source 二选一：path/format（csv/tsv/json，xlsx 另需 sheet），或 `{records:[...]}` 对象数组。CSV/TSV 支持 UTF-8/BOM、引号和换行；missingTokens 默认 `[""]`，可显式修改。JSON 仅 null 缺失，数字字符串不解析；0/false/空字符串保留。
- 列类型 number/string/boolean；boolean 仅 true/false，number 必须有限。label/unit 只用于展示。所有使用列、ID、控件和候选列都需声明且在每行存在；只有使用列内嵌，不是全列备份。
- idColumn 必须真实唯一非空 string，前导零保留；未提供则一次生成 row-N，筛选不编号、不去重或补零。
- XLSX 通过可选 openpyxl 读取明确 sheet 的已缓存公式值；日期等对象需明确转换，缺依赖可转 CSV。

## 图表入口

Chart 需要唯一 id（`[A-Za-z][A-Za-z0-9_-]*`），binding/spec 二选一。caption 为必要的显式纯文本图注。绑定继承 dataset 来源；直接 Spec 需 source.label，note 可选，格式从 [图型索引](statplots/index.json) 的 TS/指南/最小输入读取。

```json
{"id":"income","binding":{"type":"histogram","fields":{"value":"income"},"options":{"binning":{"binCount":20}}}}
```

options 不得覆盖 type/data/variables，仍经公共校验/编译；不透传 VChart encoding/回调。12 类表格绑定角色：

| type | fields |
| --- | --- |
| countPlot | category、series? |
| histogram | value |
| kdePlot / ecdfPlot | value、series? |
| boxPlot / violinPlot / stripPlot | category、value、series? |
| scatterPlot | x、y、series? |
| hexbinPlot | x、y |
| missingValueMatrix / correlationMatrix | variables 列名数组 |
| pairPlot | variables、series? |

category/series 需 string，其余标量轴和 correlation/pair 变量需 number；missing 接受全部声明类型。strip/scatter 自动加入稳定 ID。标量图排除必需字段中的 null 并记录 omittedN；矩阵逐变量保留 null，有 series 的 pair 仅排除缺失分组。矩阵使用实际变量键，不添加未声明 fieldLabels，有单位时展示短单位行。

单图使用 title；多图各标题从 options.title/spec.title/id 获取，画布不重复 title/description。语义 Spec 仍保留它们；必要范围与区间含义用标题/明确短注说明。

## 按需能力

presentation.actions 为 theme/exportPNG/exportSpec/saveView；details 为 counts/provenance，均是唯一枚举数组，默认空。PNG 每图一个按钮，仅导出原生绘图区，不含 HTML 标题/图注/控件；其余 action 为页面按钮。直接设置 theme=dark 不需要切换按钮。counts 展示原始/当前/输入/省略数，provenance 展示来源/哈希；完整来源在 data，运行计数和详细错误在 status。

Chart.interactions 可为 brush/legendFilter，默认空数组。brush 仅 pairPlot，按稳定 ID 高亮，不重算分母；pair 图例始终静态。legendFilter 只保留支持图的原生过滤，不强行开启不存在/被上游禁用的组件。默认 Tooltip 保留，点击图例/拖动不改变数据或选择。

controls 只有明确请求页面操作时填写：

```json
{"filters":[{"field":"region","kind":"category"}],"initialFilters":[{"field":"region","kind":"category","value":"东区"}],"parameters":[{"chartId":"income","path":"binning.binCount","values":[10,20,30]}]}
```

- filters：category 对 string 列；range 对 number 列。类别“全部”含 null，特定值不含；范围闭区间，激活时排除 null，两端空表示无条件。应用后才重算绑定图；清空只移除可编辑条件。无 filters 就没有应用/清空按钮，仅参数/变量也不创建它们。
- initialFilters 可以独立存在；引用声明列，field+kind 不重复。category.value 为存在字符串或 null（全部）；range.value=[lower,upper]，null 为无界，至少一端有限且下界≤上界。没有对应 filters 控件的条件为固定范围，应用/清空其他控件不移除它；“只看东区”使用此入口且标题说明范围。
- variableSwitch：chartId、role（已有 value/x/y）、candidates 唯一数值列数组，含当前列。切换数据与单位，不只改标题。
- parameters：chartId、path、values；仅 histogram 的 binning.binCount（1–200 整数）/statistic（count/proportion/density），correlationMatrix 的 method（pearson/spearman/kendall）。选择立即更新，沿用已接受筛选；选“默认”删除显式参数。

筛选不更新外部 Spec 图。多图全部成功后提交条件，失败恢复上次成功状态，恢复失败明确显示错误。图例/框选不重算统计，不能当过滤后的新样本口径。

## 输出与改图

8 图/10 MiB payload；pair 最多 4 变量/120000 非对角点，矩阵最多 20 变量，missing 最多 200000 格，KDE/violin 最多 20 组。超预算需明确选择变量或记录子集，不静默采样/截断。

新目录整体输出 visualization.html/request.json/data.json（完整文件名为 visualization.request.json、visualization.data.json）。request 使用类型化 records，可重放；data 保留真实来源哈希/转换。重放后的哈希属于该次内嵌输入，初次原文件哈希仍在初次 data，归档时保留。

对话修改 request，保留完整使用行、ID、单位、initialFilters/presentation/interactions，写新目录。新增字段从已知原数据按真实 ID 补回。浏览器选择不会自动写回磁盘；明确请求 saveView 才下载当前字段/参数/主题及已接受条件，框选不保存为样本过滤。exportSpec 输出最后成功的规范 Spec 数组，没有成功 Spec 时输出原始 payload，不能把筛选后的 Spec 当完整源数据。

HTML 使用固定 VChart/statplots 2.1.8-alpha.0 UMD；npm peer 仍为 2.1.7，本技能验收的是该固定组合，无需 npm/TypeScript 安装。快照来源/转换在 statplots/manifest.json，controller 源与副本同步核验。ready 仅表示结束，检查每图 rendered 和真实图元/Tooltip/所请求交互；__DSV_CONTROLLERS__ 用于检查公共 chart/spec，不依赖私有编译 ID。
