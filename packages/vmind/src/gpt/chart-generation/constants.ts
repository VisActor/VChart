export const SUPPORTED_CHART_LIST = [
  'Dynamic Bar Chart',
  'Bar Chart',
  'Line Chart',
  'Pie Chart',
  'Scatter Plot',
  'Word Cloud',
  'Rose Chart',
  'Radar Chart',
  'Sankey Chart',
  'Funnel Chart',
  'Dual Axis Chart',
  'Waterfall Chart',
  'Box Plot Chart'
];

export const DataProcessPrompt = `你是一个数据分析领域的专家，你的任务是：
1. 请逐步思考问题，将你的思考填入{THOUGHT}
2. 根据用户提供的csv文件内容，总结该文件中所包含的字段名称、字段描述
3. 根据用户意图，从数据中筛选出有用的字段。
4. 从用户意图中提取视频时长
5. 根据用户意图，生成一个具有8个颜色的色板

Constraints:
1. FIELD_INFO中必须包含该字段的类型(字符串、日期、整数、浮点数、百分数等)
2. USEFUL_FIELDS中只包含对用户意图有用的字段
3. 如果用户指定了视频长度，VIDEO_DURATION不能为空
4. 如果用户指定了颜色风格，COLOR_PALETTE不能为空
5. 将回复内容使用\`\`\`包裹，返回内容必须能够直接被JavaScript中的JSON.parse解析

使用以下格式回复：
\`\`\`
{
"THOUGHT": "你的思考",
"FIELD_INFO": 对csv文件中的数据进行总结后的结果
"USEFUL_FIELDS": 根据用户意图筛选的有用的字段
"VIDEO_DURATION": 视频时长，单位为秒。如果用户没有指定视频时长，可以为空
"COLOR_PALETTE": 包含8个颜色的色板。如果用户没有指定颜色风格，可以为空
"REASON": 选择这些字段的原因,
"DOUBLE_CHECK": 检查回复是否符合Constraints中的限制
}
\`\`\`

下面是几个示例：

csv文件内容:
"country,gdp,year,co2_emissions
China,20000000000,2020,1523234234
America,30000000000,2020,31324532214
England,10000000000,2020,913045781
Canada,5000000000,2020,130423578"

用户意图: 帮我展示历年全球各国家GDP排名的对比，时长1分钟

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"FIELD_INFO":[
{
"fieldName": "country",
"description":"表示国家的名称，它是一个字符串。"
},
{
"fieldName": "gdp",
"description":"表示每个国家的gdp总量，它是一个整数。"
},
{
"fieldName": "year",
"description":"表示当前年份，它是一个日期"
},
{
"fieldName": "co2_emissions",
"description":"表示每个国家的二氧化碳排放量，它是一个整数"
}
],
"USEFUL_FIELDS": ["country","gdp","year"],
"VIDEO_DURATION": 60,
"REASON":  "country表示国家名称，gdp表示国家的gdp总量，与用户意图直接相关。用户意图中含有'历年'字样，因此日期字段year也与用户意图相关。co2_emissions表示二氧化碳排放量，与用户意图无关",
"DOUBLE_CHECK": "USEFUL_FIELDS所选字段均有助于完成用户意图，且没有多余字段。FIELD_INFO中包含了每个字段的类型。用户指定了视频时长，VIDEO_DURATION不为空。用户没有指定图表的颜色风格，COLOR_PALETTE可以为空。回复内容可直接被JavaScript中的JSON.parse解析。"
}
\`\`\`

----------------------------------
csv文件内容:
"branch_name,percentage,average_price,quality
Apple,0.5, 6999,1523234234
Samsung,0.3,5630,31324532214
Vivo,0.1, 3020,913045781
Nokia,0.05,150,130423578"
用户意图：帮我展示市场占有率,小清新风格

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"FIELD_INFO":[
{
"fieldName": "branch_name",
"description":"表示手机品牌名称，它是一个字符串。"
},
{
"fieldName": "percentage",
"description":"表示该品牌的市场占有率，它是一个百分数。"
},
{
"fieldName": "average_price",
"description":"表示该品牌的平均价格，它是一个浮点数。"
},
{
"fieldName": "quality",
"description":"表示该品牌的产品质量，它是一个整数。"
}
],
"USEFUL_FIELDS": ["branch_name","percentage"],
"COLOR_PALETTE":["#FF6000","#FFE6C7","#FFA559","#454545","#B70404","#DB005B","#F79327","#FFE569"],
"REASON":  "percentage表示市场占有率，是用户意图中需要的信息。branch_name表示手机品牌名称，市场份额需要按照手机品牌名称分组展示，因此也是有用字段。average_price表示平均价格，与用户意图无关。quality表示产品质量，与用户意图无关",
"DOUBLE_CHECK": "USEFUL_FIELDS所选字段均有助于完成用户意图，且没有多余字段。FIELD_INFO中包含了每个字段的类型。用户没有指定视频时长，VIDEO_DURATION可以为空。用户指定了图表的颜色风格，COLOR_PALETTE不为空。回复内容可直接被JavaScript中的JSON.parse解析。"
}
\`\`\`
----------------------------------
csv文件内容:
"country,year,人口总量
China,2020,1321
America,2020,48
England,2020,10
Canada,2020,81"

用户意图: 帮我展示人口变化趋势

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"FIELD_INFO":[
{
"fieldName": "country",
"description":"表示国家的名称，它是一个字符串。"
},
{
"fieldName": "year",
"description":"表示当前年份，它是一个日期"
},
{
"fieldName": "人口总量",
"description":"表示每个国家的人口总量，它是一个整数。"
}
],
"USEFUL_FIELDS": ["country","year","人口总量"],
"REASON":  "人口总量字段与用户意图直接相关。人口总量需要按国家展示，因此country也是有用字段。用户意图中含有'趋势'字样，因此需要展示不同年份的人口总量，year也是有用字段",
"DOUBLE_CHECK": "USEFUL_FIELDS所选字段均有助于完成用户意图，且没有多余字段。FIELD_INFO中包含了每个字段的类型。用户没有指定视频时长，VIDEO_DURATION可以为空。用户没有指定图表的颜色风格，COLOR_PALETTE可以为空。回复内容可直接被JavaScript中的JSON.parse解析。"
}
\`\`\`
`;

export const ChartAdvisorPrompt = `你是一个数据分析领域的专家.你必须根据用户提供的数据描述和用户意图，从支持的图表列表中选择最能满足用户意图的图表，并将数据中的字段分配到图表的视觉通道中。
请逐步思考问题，将你的思考填入  {THOUGHT}

使用以下格式回复：
\`\`\`
{
"THOUGHT": 你的思考
"CHART_TYPE": 你选择的图表类型。支持的图表列表：[动态条形图、柱状图、折线图、饼图、散点图、词云、玫瑰图、雷达图、桑基图]
"FIELD_MAP":{ //字段映射，可用的视觉通道：["x","y","color","size","angle","time"]
"x": 映射到x轴的字段，可以为空
"y" 映射到y轴的字段，可以为空
"color": 映射到颜色通道的字段，可以为空
"size": 映射到尺寸通道的字段，可以为空
"angle": 映射到饼图扇形角度通道的字段，可以为空
"time": 动态条形图中的时间字段。在每个时间点，用条形图展示当前数据。仅用于动态条形图
},
"DOUBLE_CHECK": 检查回复是否符合Constraints中的限制
}
\`\`\`

Constraints:
1. 选择的图表类型必须在支持的图表列表中
2. 根据用户意图，结合你在数据可视化领域的知识，从支持的图表列表中选择最能满足用户意图的图表，并将数据中的字段映射到图表的视觉通道中
3. 数据映射中必须使用数据的所有字段
4. FIELD_MAP中的字段必须从可用的视觉通道列表中选择
5. 将回复内容使用\`\`\`包裹，返回内容必须能够直接被JavaScript中的JSON.parse解析

下面是几个示例：

用户意图：帮我展示历届奥运会各国金牌数量的对比
数据字段描述：[
{
"fieldName": "country",
"description":"表示国家的名称，它是一个字符串。"
},
{
"fieldName": "金牌数量",
"description":"表示该国家在当前年份的金牌数量，它是一个整数。"
},
{
"fieldName": "year",
"description":"表示当前年份，它是一个日期"
}
]

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"CHART_TYPE": "动态条形图",
"FIELD_MAP":{
"x": "国家",
"y": "金牌数量",
"time": "year"
},
"REASON": "数据中包含年份、国家和奖牌数量，且用户意图中含有”对比“，适合按照年份绘制变化的条形图，展示历届奥运会各国金牌数量的对比。国家字段做条形图的x轴，金牌数量做条形图的y轴，可展示当前年份的各国金牌数量对比。年份做动态条形图的时间字段，可在不同年份展示金牌数量的对比",
"DOUBLE_CHECK": "动态条形图适合用于展示变化的数据，且可以在每个年份进行对比，能够满足用户意图。动态条形图在支持的图表列表中。字段分配结果符合用户意图。数据中的所有字段均已在数据映射中使用。FIELD_MAP中的字段都存在于可用的视觉通道列表中。回复内容可直接被JavaScript中的JSON.parse解析。"
}
\`\`\`

------------------------

用户意图：帮我展示各手机品牌的市场占有率, 赛博朋克风格
数据字段描述：[
{
"fieldName": "品牌名称",
"description":"表示手机品牌名称，它是一个字符串。"
},
{
"fieldName": "市场占有率",
"description":"表示该品牌的市场占有率，它是一个百分数。"
}
]

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"CHART_TYPE": "饼图",
"FIELD_MAP":{
"angle": "市场占有率",
"color": "品牌名称"
},
"REASON": "数据中包含占有率，且用户想展示百分比数据，适合用饼图进行展示。市场占有率做饼图扇区角度，可以展示市场占有率所占份额。品牌名称做颜色，可以对不同品牌进行区分",
"DOUBLE_CHECK": "饼图适合展示占有率、份额等百分比数据，能够满足用户意图。饼图在支持的图表列表中。字段分配结果符合用户意图。数据中的所有字段均已在数据映射中使用。FIELD_MAP中的字段都存在于可用的视觉通道列表中。回复内容可直接被JavaScript中的JSON.parse解析。"
}
\`\`\`

------------------------

用户意图：帮我展示一年之中降雨量的变化趋势
数据字段描述：[
{
"fieldName": "日期",
"description":"表示当前月份，它是一个标准的日期字段"
},
{
"fieldName": "降雨量",
"description":"表示当前月份的降雨量，它是一个数字"
}
]

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"CHART_TYPE": "折线图",
"FIELD_MAP":{
"x": "日期",
"y": "降雨量"
},
"REASON": "数据中包含日期字段，且用户想展示变化趋势，适合用折线图进行展示。日期做x轴，降雨量做y轴，可展示降雨量的变化趋势",
"DOUBLE_CHECK": "折线图适合展示随时间变化的数据，适合展示变化趋势，能够满足用户意图。折线图在支持的图表列表中。字段分配结果符合用户意图。数据中的所有字段均已在数据映射中使用。FIELD_MAP中的字段都存在于可用的视觉通道列表中。回复内容可直接被JavaScript中的JSON.parse解析。",
}
\`\`\``;

export const ChartAdvisorPromptEnglish = `You are an expert in data visualization.
User want to create an visualization chart for data video using data from a csv file. Ignore the duration in User Input.
Your task is:
1. Based on the user's input, infer the user's intention, such as comparison, ranking, trend display, proportion, distribution, etc. If user did not show their intention, just ignore and do the next steps.
2. Select the single chart type that best suites the data from the list of supported charts. Supported chart types: ${JSON.stringify(
  SUPPORTED_CHART_LIST
)}.
3. Map all the fields in the data to the visual channels according to user input and the chart type you choose.

Knowledge:
1. The dynamic Bar Chart is a dynamic chart that is suitable for displaying changing data and can be used to show ranking, comparisons or data changes over time. It usually has a time field. It updates the data dynamically according to the time field and at each time point, the current data is displayed using a bar chart.
2. A number field can not be used as a color field.

Let's think step by step. Fill your thoughts in {THOUGHT}.

Respone in the following format:

\`\`\`
{
"THOUGHT": your thoughts
"CHART_TYPE": the chart type you choose. Supported chart types: ${JSON.stringify(SUPPORTED_CHART_LIST)}.
"FIELD_MAP": { // Visual channels and the fields mapped to them
"x": the field mapped to the x-axis, can be empty. Can Only has one field.
"y": the field mapped to the y-axis, can be empty. Can only has one field.
"color": the field mapped to the color channel. Must use a string field. Can't be empty in Word Cloud, Pie Chart and Rose Chart.
"size": the field mapped to the size channel. Must use a number field. Can be empty
"angle": the field mapped to the angle channel of the pie chart, can be empty.
"time": This is usually a date field and can be used only in Dynamic Bar Chart. Can't be empty in Dynamic Bar Chart.
"source": the field mapped to the source channel. Can't be empty in Sankey Chart.
"target": the field mapped to the target channel. Can't be empty in Sankey Chart.
"value": the field mapped to the value channel. Can't be empty in Sankey Chart.
},
"Reason": the reason for selecting the chart type and visual mapping.
}
\`\`\`

Constraints:
1. No user assistance.
2. The selected chart type in CHART_TYPE must be in the list of supported charts.
3. Just ignore the user's request about duration and style in their input.
4. DO NOT change or translate the field names in FIELD_MAP.
5. The keys in FIELD_MAP must be selected from the list of available visual channels.
6. Wrap the reply content using \`\`\`, and the returned content must be directly parsed by JSON.parse() in JavaScript.

Here are some examples:

User Input: 帮我展示历届奥运会各国金牌数量的对比.
Data field description: [
{
"id": "country",
"description": "Represents the name of the country, which is a string.",
"type": "string",
"role": "dimension",
"location": "dimension"
},
{
"id": "金牌数量",
"description": "Represents the number of gold medals won by the country in the current year, which is an integer.",
"type": "int",
"role": "measure",
"location": "measure"
},
{
"id": "year",
"description": "Represents the current year, which is a date.",
"type": "string",
"role": "dimension",
"location": "dimension"
}
]

Response:
\`\`\`
{
"THOUGHT": "Your thoughts",
"CHART_TYPE": "Dynamic Bar Chart",
"FIELD_MAP": {
"x": "country",
"y": "金牌数量",
"time": "year"
},
"REASON": "The data contains the year, country, and medal count, and the user's intention contains 'comparison', which is suitable for drawing a dynamic bar chart that changes over time to show the comparison of gold medal counts of various countries in each Olympic Games. The 'country' field is used as the x-axis of the bar chart, and '金牌数量' is used as the y-axis to show the comparison of gold medal counts of various countries in the current year. The 'year' field is used as the time field of the dynamic bar chart to show the comparison of gold medal counts of various countries at different years."
}
\`\`\`

------------------------

User Input: 帮我展示各手机品牌的市场占有率, 赛博朋克风格, 时长5s
Data field description: [
{
"id": "品牌名称",
"description": "Represents the name of the mobile phone brand, which is a string.",
"type": "string",
"role": "dimension",
"location": "dimension"
},
{
"id": "市场份额",
"description": "Represents the market share of the brand, which is a percentage.",
"type": "float",
"role": "measure",
"location": "measure"
}
]

Response:
\`\`\`
{
"THOUGHT": "Your thoughts",
"CHART_TYPE": "Pie Chart",
"FIELD_MAP": {
"angle": "市场份额",
"color": "品牌名称"
},
"REASON": "The data contains the market share, and the user wants to show percentage data, which is suitable for displaying with a pie chart. The 市场份额 is used as the angle of the pie chart to show the market share of each brand. The 品牌名称 is used as the color to distinguish different brands. The duration is 5s but we just ignore it."
}
\`\`\`

------------------------

User Input: 帮我展示降雨量变化趋势.
Data field description: [
{
"id": "日期",
"description": "Represents the current month, which is a date.",
"type": "string",
"role": "dimension",
"location": "dimension"
},
{
"id": "降雨量",
"description": "Represents the rainfall in the current month, which is a number.",
"type": "int",
"role": "measure",
"location": "measure"
}
]

Response:
\`\`\`
{
"THOUGHT": "Your thoughts",
"CHART_TYPE": "Line Chart",
"FIELD_MAP": {
"x": "日期",
"y": "降雨量"
},
"REASON": "User wants to show the trend of the rainfall, which is suitable for displaying with a line chart. The '日期' is used as the x-axis because it's a date, and the 降雨量 is used as the y-axis because it's a number. This chart can show the trend of rainfall."
}
\`\`\`

------------------------

User Input: 帮我绘制图表, 时长20s.
Data field description: [
{
"id": "日期",
"description": "Represents the current month, which is a date.",
"type": "date",
"role": "dimension",
"location": "dimension"
},
{
"id": "降雨量",
"description": "Represents the rainfall in the current month, which is a number.",
"type": "int",
"role": "measure",
"location": "measure"
}
]

Response:
\`\`\`
{
"THOUGHT": "Your thoughts",
"CHART_TYPE": "Line Chart",
"FIELD_MAP": {
"x": "日期",
"y": "降雨量"
},
"REASON": "User did not show their intention about the data in their input. The data has two fields and it contains a date field, so Line Chart is best suitable to show the data. The field '日期' is used as the x-axis because it's a date, and the 降雨量 is used as the y-axis because it's a number. The duration is 20s but we just ignore it."
}
\`\`\`
`;

export const NLToChartPrompt = `你是一个数据分析领域的专家, 请你按以下步骤完成任务. 请逐步思考问题, 将你的思考填入{THOUGHT}:
1. 首先, 根据用户提供的csv文件内容, 推断每个字段的含义. 结合用户意图, 从数据中筛选出有用的字段, 写入USEFUL_FIELDS
2. 其次, 从支持的图表列表中选择最能满足用户意图的图表, 写入CHART_TYPE
3. 再次, 将第一步筛选出的有用的字段分配到图表的视觉通道中, 写入FIELD_MAP. 每个通道只能有一个字段或者为空.
4. 最后, 根据用户意图, 生成一个具有8个颜色的色板, 写入COLOR_PALETTE

使用以下格式回复:
\`\`\`
{
"THOUGHT": "你的思考",
"USEFUL_FIELDS": 根据用户意图筛选的有用的字段,
"CHART_TYPE": 你选择的图表类型. 支持的图表列表: [动态条形图、柱状图、折线图、饼图、散点图、词云、玫瑰图、雷达图、桑基图]
"FIELD_MAP":{ //字段映射, 可用的视觉通道: ["x","y","color","size","angle","time"]
"x": 映射到x轴的字段, string类型, 只能有一个字段或为空
"y": 映射到y轴的字段, string类型, 只能有一个字段或为空
"color": 映射到颜色通道的字段, string类型, 只能有一个字段或为空
"size": 映射到尺寸通道的字段, string类型, 只能有一个字段或为空
"angle": 映射到饼图扇形角度通道的字段, string类型, 只能有一个字段或为空
"time": 动态条形图中的时间字段. 在每个时间点, 用条形图展示当前数据, string类型, 只能有一个字段或为空, 仅用于动态条形图
},
"COLOR_PALETTE": 包含8个颜色的色板. 如果用户没有指定颜色风格, 可以为空
"REASON": 解释一下字段筛选结果, 图表类型选择的结果和字段映射的结果
"DOUBLE_CHECK": 检查回复是否符合Constraints中的限制
}
\`\`\`

Constraints:
1. USEFUL_FIELDS中只包含对用户意图有用的字段
2. CHART_TYPE必须在支持的图表列表中
3. 字段映射FIELD_MAP中的key必须从可用的视觉通道中选择
4. 字段映射FIELD_MAP中的value只能有一个字段或者为空, 只能使用USEFUL_FIELDS中的字段
5. 如果用户指定了颜色风格, COLOR_PALETTE不能为空
6. 将回复内容使用\`\`\`包裹, 返回内容必须能够直接被JavaScript中的JSON.parse解析

下面是几个示例:

csv文件内容:
"country,gdp,year,co2_emissions
China,20000000000,2020,1523234234
America,30000000000,2020,31324532214
England,10000000000,2020,913045781
Canada,5000000000,2020,130423578"

用户意图: 帮我展示历年全球各国家GDP排名的对比

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"USEFUL_FIELDS": ["country","gdp","year"],
"CHART_TYPE": "动态条形图",
"FIELD_MAP":{
"x": "country",
"y": "gdp",
"time": "year"
},
"REASON":  "country表示国家名称, gdp表示国家的gdp总量, 与用户意图直接相关. 用户意图中含有'历年'字样, 因此日期字段year也与用户意图相关. co2_emissions表示二氧化碳排放量, 与用户意图无关. USEFUL_FIELDS中包含年份, 且用户意图中含有”对比“, 适合按照年份绘制动态条形图, 展示历年各国家GDP排名. country做x轴, gdp做y轴, 可展示当前年份的各国GDP排名. 年份做动态条形图的时间字段, 可在不同年份展示GDP排名对比",
"DOUBLE_CHECK": "USEFUL_FIELDS所选字段均有助于完成用户意图, 且没有多余字段. 动态条形图适合用于展示变化的数据, 且可以在每个年份进行对比, 能够满足用户意图. 动态条形图在支持的图表列表中. FIELD_MAP中的每个通道只有一个字段或者为空, 字段分配结果符合用户意图. FIELD_MAP中的key都存在于可用的视觉通道列表中. 用户没有指定图表的颜色风格, COLOR_PALETTE可以为空. 回复内容可直接被JavaScript中的JSON.parse解析. "
}
\`\`\`

----------------------------------
csv文件内容:
"branch_name,percentage,average_price,quality
Apple,0.5, 6999,1523234234
Samsung,0.3,5630,31324532214
Vivo,0.1, 3020,913045781
Nokia,0.05,150,130423578"
用户意图: 帮我展示市场占有率,橘色风格

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"USEFUL_FIELDS": ["branch_name","percentage"],
"CHART_TYPE": "饼图",
"FIELD_MAP":{
"angle": "percent",
"color": "branch_name"
},
"COLOR_PALETTE":["#FF6000","#FFE6C7","#FFA559","#454545","#B70404","#DB005B","#F79327","#FFE569"],
"REASON":  "percentage表示市场占有率, 是用户意图中需要的信息. branch_name表示手机品牌名称, 市场份额需要按照手机品牌名称分组展示, 因此也是有用字段. average_price表示平均价格, 与用户意图无关. quality表示产品质量, 与用户意图无关. USEFUL_FIELDS中包含占有率, 且用户想展示百分比数据, 适合用饼图进行展示. percentage做饼图扇区角度, 可以展示市场占有率所占份额. branch_name做颜色, 可以对不同品牌进行区分",
"DOUBLE_CHECK": "USEFUL_FIELDS所选字段均有助于完成用户意图, 且没有多余字段. 饼图适合展示占有率、份额等百分比数据, 能够满足用户意图. 饼图在支持的图表列表中. FIELD_MAP中的每个通道只有一个字段或者为空, 字段分配结果符合用户意图. FIELD_MAP中的key都存在于可用的视觉通道列表中. 用户指定了图表的颜色风格, COLOR_PALETTE符合用户指定风格. 回复内容可直接被JavaScript中的JSON.parse解析. "
}
\`\`\`
----------------------------------
csv文件内容:
"地区,Month,降雨量
South,1,1321
East,1,485
West,1,10
North,1,81"

用户意图: 帮我展示不同地区降雨量变化趋势

Response:
\`\`\`
{
"THOUGHT": "你的思考",
"USEFUL_FIELDS": ["地区","Month","降雨量"],
"CHART_TYPE": "折线图",
"FIELD_MAP":{
"x": "Month",
"y": "降雨量",
"color":"地区"
},
"REASON":  "地区表示地区名, 降雨量表示该地区降雨量, 与用户意图直接相关. 用户需要展示变化趋势, 因此Month也与用户意图相关. USEFUL_FIELDS中包含月份Month, 且用户想展示变化趋势, 适合使用折线图. Month做x轴, 降雨量做y轴, 可展示降雨量在一年之中的变化趋势. 地区做颜色字段, 可对不同地区进行区分",
"DOUBLE_CHECK": "USEFUL_FIELDS所选字段均有助于完成用户意图, 且没有多余字段. 折线图适合展示数据的变化趋势, 能够满足用户意图. 折线图在支持的图表列表中. FIELD_MAP中的每个通道只有一个字段或者为空, 字段分配结果符合用户意图. FIELD_MAP中的key都存在于可用的视觉通道列表中. 用户没有指定图表的颜色风格, COLOR_PALETTE可以为空. 回复内容可直接被JavaScript中的JSON.parse解析. "
}
\`\`\``;

export const animationDuration = 500;
export const oneByOneGroupSize = 10; //one-by-one动画 10个点一组
export const DEFAULT_VIDEO_LENGTH = 2000;
export const DEFAULT_PIE_VIDEO_LENGTH = 5000;
export const DEFAULT_VIDEO_LENGTH_LONG = 10000;
export const CHARTTYP_VIDEO_ELENGTH: Record<string, number> = {
  pie: DEFAULT_PIE_VIDEO_LENGTH,
  wordCloud: DEFAULT_VIDEO_LENGTH_LONG,
  wordcloud: DEFAULT_VIDEO_LENGTH_LONG
};

export const WORDCLOUD_NUM_LIMIT = 100;

export const COLOR_THEMES = {
  default: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55']
};

export const LINEAR_COLOR_THEMES = [
  ['#1DD0F3', '#73EC55'],
  ['#2693FF', '#F6FB17'],
  ['#3259F4', '#FBBB16'],
  ['#1B0CA1', '#FF581D'],
  ['#1DD0F3', '#CB2BC6']
];
