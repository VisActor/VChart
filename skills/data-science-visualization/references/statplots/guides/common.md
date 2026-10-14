# 公共输入与表达约束

## 公共配置

|字段|含义|
|---|---|
|type / data|必填，类型和对应数据；histogram、kdePlot、ecdfPlot 使用原始 value 观测，boxPlot 使用原始 category/value/series 观测，hexbinPlot 使用原始 x/y 散点，pairPlot、missingValueMatrix、correlationMatrix 使用 variables 与 data.observations|
|title / description|标题及数据范围、统计方法说明|
|theme|VChart 原生 light（默认）或 dark|
|colors|共用 categorical / sequential / diverging，支持名称与色号数组；见[公共配色](common.md)|
|fieldLabels|该图允许的字段展示名，供轴和 tooltip 使用；不控制图元标签|
|行级 series|在该图 Schema 支持时比较系列，同一表全部提供非空系列名或全部省略；histogram、hexbinPlot 不支持分组|

观测 id 为字符串，category 为类别。缺失值只在明确允许 null 的字段中接受。数值必须有限，不接受数值字符串；未知字段、NaN、Infinity 不做静默归一化。缺少下界或上界时不能推断另一端。

## 区间与外部方法

confidence、prediction、credible 要求 0 < level < 1；standardError、standardDeviation 要求 multiplier > 0；range 不接受 level 或 multiplier。lower/upper 同时提供且 lower ≤ upper；不预设为 95% 置信区间。

全部 28 类图表共用 `colors`，按颜色所表达的含义配置。它独立于 `theme: 'light' | 'dark'`，无需注册主题。

|字段|用途|命名色板|自定义数组|
|---|---|---|---|
|categorical|无序类别、分组、系列|colorblind（默认）、deep、vchart|至少 1 个色号，按系列顺序分配|
|sequential|从低到高的数值|viridis（默认）、cividis|至少 2 个色号，低值→高值|
|diverging|相对统计中心的正负值|RdBu_r（默认）|至少 3 个色号，负值→中心→正值|

数组每项为六位不透明 RGB 色号 `#RRGGBB`，支持大小写。名称区分大小写；不接受 CSS 变量、颜色名、透明色或回调，保证相同 JSON 在浏览器与 Node 中语义一致。错误返回 `/colors/...` 路径。

连续与发散数组的停靠点等距，使用 VChart 原生 RGB 插值。发散色板中点对应 0；偶数长度时中心由中间两色插值。建议使用奇数长度并显式给出中心色。自定义颜色不保证感知均匀或色觉友好；矩阵文字使用原生 smartInvert 调整对比度。
