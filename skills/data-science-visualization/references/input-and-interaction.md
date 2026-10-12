# 请求与交互协议 v1

顶层 `version:1`、`title`、`charts`，可选 `dataset`、`controls` 和 `presentation`。未知字段拒绝。默认页面只有标题、图表、单位和 Tooltip，必要图例/色标为静态表达；无操作栏、来源详情、计数或导出按钮。参考可执行 `../examples/distribution.json`；JSON 示例与 CSV 相对路径均相对请求文件，非当前 cwd。

## 表格

```json
{
  "source": {"path": "observations.csv", "format": "csv"},
  "columns": [
    {"name": "id", "type": "string"},
    {"name": "income", "type": "number", "label": "收入", "unit": "元"},
    {"name": "region", "type": "string", "label": "地区"}
  ],
  "idColumn": "id"
}
```

source 二选一：path/format（csv、tsv、json，或可选 xlsx + sheet），或 `{records:[...]}`。records 为对象数组；JSON 数字字符串不解析，只有显式 null 缺失。CSV/TSV 使用 UTF-8，可有 BOM、引号和单元格换行；`missingTokens` 默认 `[""]`，可明确指定其他字符串。0 不缺失；boolean 仅 true/false；字符串前导零保留。

列类型仅 number/string/boolean；已用列、ID、控件及候选变量必须声明且在所有记录实际存在。只有这些列内嵌到 HTML。idColumn 是单个观测的真实唯一非空字符串；不提供时生成 row-N，筛选后不重新编号。不去重、不补零。

XLSX 需明确 sheet，使用已缓存公式值；转换后的 number/string/boolean 仍遵循声明。日期等对象需先明确转换为可交接的值，不能假装字符串。缺 openpyxl 时生成器给出安装或 CSV 转换建议。

## 图表

Chart 二选一：

```json
{"id":"income","binding":{"type":"histogram","fields":{"value":"income"},"options":{"binning":{"binCount":20}}}}
```

```json
{"id":"interval","source":{"label":"提供的估计结果","note":"95% 置信区间"},"spec":{"type":"pointIntervalPlot","input":"estimates","interval":{"kind":"confidence","level":0.95},"data":[{"category":"A","estimate":2,"lower":1,"upper":3}]}}
```

id 唯一，匹配 `[A-Za-z][A-Za-z0-9_-]*`；caption 为明确需要展示的可选纯文本，不自动插入通用说明。binding.options 不接受 type/data/variables 覆写；其余参数仍经上游公共校验器和 compile 验证。直接 Spec 必须注明 source.label，note 可选，默认保留在数据文件内。

Chart 可声明 `interactions:["brush","legendFilter"]`，只在用户请求时添加，缺省为空。brush 仅 pairPlot；其 legendFilter 不支持。legendFilter 保留其他图已有原生筛选行为，不为不存在/原生禁用的图例创建过滤器。默认 pair 拖动不框选，图例点击不隐藏数据，Tooltip 正常。

绑定角色：count(category,series?)；histogram(value)；kde/ecdf(value,series?)；box/violin/strip(category,value,series?)；scatter(x,y,series?)；hexbin(x,y)；missing/correlation(variables 列数组)；pair(variables,series?)。category/series 需要 string，其余标量轴与相关/pair 变量需要 number；missing 接受全部声明类型。

strip/scatter 自动加入稳定内部 ID。标量图省略必需映射中的 null，记录 omittedN；矩阵保留逐变量 null，有 series 的 pair 仅排除缺失分组，不删其他缺失行。展示名称从 label/unit 构建；矩阵使用实际变量名，不添加其 Schema 不支持的 fieldLabels，有单位时在图旁保留简短单位行。

单图只显示 request.title；多图额外显示各图 options.title/spec.title（无则 id），画布不重复原生 title/description。它们仍保留在规范输入与导出中；有必要区间或方法语义时使用明确标题/图注，不能把未知区间解释为默认置信区间。

## 按需展示

```json
{"actions":["exportPNG"],"details":[]}
```

这是 presentation 对象；可选 actions 枚举 theme/exportPNG/exportSpec/saveView，details 枚举 counts/provenance。两者默认空数组，未知/重复值拒绝。只生成所请求元素；exportPNG 每图一个按钮，其他 action 为页面按钮。直接设置图 theme=dark 不需要 theme 按钮。counts 展示原始/当前/每图输入和省略数；provenance 展示真实来源/哈希，不能推断原始样本量。详细状态与来源始终在 data/status 中。

## 控件

controls 只声明用户明确要求在页面操作的能力；“调整分箱”只加入 parameters，“切换地区”只加入 filters。声明变量/参数不自动增加应用/清空按钮；只有 filters 非空才创建这两个按钮及简短当前计数。没有声明就没有 toolbar。

```json
{
  "filters": [{"field":"region","kind":"category"},{"field":"income","kind":"range"}],
  "initialFilters": [{"field":"region","kind":"category","value":"东区"}],
  "variableSwitch": [{"chartId":"income","role":"value","candidates":["income","spend"]}],
  "parameters": [{"chartId":"income","path":"binning.binCount","values":[10,20,30]}]
}
```

类别“全部”包含 null，特定类别不包含 null；范围左右端包含，激活范围不包含 null，两个端点都空表示无范围条件。点“应用筛选”才更新；清空移除可编辑条件，保留未声明对应控件的固定范围。范围下界大于上界会拒绝并恢复控件。

variableSwitch 只支持已有 value/x/y 角色的数值候选，必须包含当前列。parameters 只支持 histogram 的 binning.binCount（1–200）、statistic（count/proportion/density），以及 correlationMatrix 的 method（pearson/spearman/kendall）。页面显示中文统计量名称，选“默认”删除显式选项。字段与参数选择立即更新，沿用上次已应用的筛选。

表格筛选只更新 binding 图；外部 Spec 来源独立。多图更新全部成功后提交状态；失败恢复上次成功条件，无法恢复的图明确报错。图例的隐藏不会重算分母，pair 图例只说明颜色；框选只高亮。

`initialFilters` 可选，用于新 HTML 首次打开时恢复条件；可以独立于 filters 声明。引用 dataset 的声明列：category 为 string，range 为 number，field+kind 不重复。类别值是存在于数据中的字符串或 null（全部）；范围 value=[lower,upper]，null 表示该端无界，至少有一端为有限数值。

“仅看东区”使用 initialFilters 并在标题说明范围，不生成地区筛选器。未声明对应 filters 控件的条件为固定范围，应用/清空其他控件不会移除；对话修改 request 才移除。源 dataset 仍保留全部原始使用行。initialFilters 有对应控件时，该条件可由用户修改/清空。

默认对话改图读取磁盘 visualization.request.json，保留全部 records、ID、单位、initialFilters、presentation、interactions，修改 chart binding/type 写新目录；无需保存按钮。浏览器后续选择不会自动写入磁盘，不可读取当前条件时需确认该条件。

只有请求 saveView 才提供“保存当前视图请求”：下载全部内嵌数据、当前字段/参数/主题、presentation 和已成功应用的 initialFilters。不要把筛选后的 Spec 数组当原始完整数据，也不要仅在浏览器选中后声称新的 HTML 保存了该条件。框选高亮不保存为样本筛选。

## 预算、产物和验收

8 图、10 MiB JSON payload；pair 最多 4 变量/120000 非对角点；missing/correlation 最多 20 变量，missing 最多 200000 格；KDE/violin 最多 20 分组。超过预算请明确范围，不自动抽样或截断。原始观测行数、筛选行数、每图输入数和 omittedN 都有记录，直接 Spec 的结果行数不冒称样本量。

生成到不存在的新目录：HTML、request 和 data 三项完整后整体写入。request 使用内嵌的类型化 records，可重放；data 保留原来源哈希与缺失/转换规则。重放时新哈希对应该次内嵌输入，初次原文件哈希仍在初次 data 中；修改或归档时保留它。下载当前图表配置输出规范 Spec 数组，与最后成功画面一致；没有成功 Spec 时下载原始 payload。

运行 HTML 使用固定 VChart/statplots 2.1.8-alpha.0 UMD。资源快照来自完整性核验的 npm tarball；共享控制器副本来自图库源码，来源与哈希分别在 `statplots/manifest.json`。npm peer 仍标 2.1.7，本技能只承诺验收过的 UMD 组合，不要求 npm 安装。

实际浏览器检查 `__DSV_STATUS__` 的 ready 和各图 status，真实 hover/筛选/框选；不能只检查 canvas。公开的 `__DSV_CONTROLLERS__` 方便调试和明确授权的扩展；应用代码不依赖编译后的私有 series/data ID。
