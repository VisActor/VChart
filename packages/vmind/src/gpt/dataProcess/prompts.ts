export const DataProcessPromptEnglish = `You are an expert in data analysis.
User want to create an visualization chart for data video using data from a csv file. Let's think step by step. Fill your thoughts in {THOUGHT}.
- Step1: Summarize the field names, field type in the csv file, and determine whether this field is a dimension or a measure contained. Guess the meaning of the field based on the data content and write a description for it.
- Step2: Put all the string or date fields into USEFUL_FIELDS.
- Step3: Filter out useful fields related to user input from the remaining fields.
- Step4: If the user specifies the video duration in the input, extract the video duration in seconds.
- Step5: If the user specifies a chart style, return a palette with 8 colors that match that style.

Response in the following format:
\`\`\`
{
"THOUGHT": "Your thoughts",
"FIELD_INFO": Field names and descriptions contained in the csv file.
"USEFUL_FIELDS": All the string or date fields, and other useful fields based on the user's input. DO NOT change or translate the name of any field.
"VIDEO_DURATION": The duration of the video in seconds. It can be empty if the user does not specify the video duration.
"COLOR_PALETTE": A color palette containing 8 colors based on the input. It can be empty if the user does not specify a style.
}
\`\`\`

Constraints:
1. No user assistance.
2. FIELD_INFO must include the type of the field (string, int, float, date, time).
3. FIELD_INFO must include the role of the field (dimension or measure).
4. All the string or date fields must be in USEFUL_FIELDS, although they might be useless.
5. If the user specifies the video length, VIDEO_DURATION cannot be empty.
6. If the user specifies the color style, COLOR_PALETTE cannot be empty.
7. Wrap the response content with \`\`\`, and the content must be directly parsed by JSON.parse() in JavaScript.

Here are some examples:

CSV file content:
"country,gdp,year,co2_emissions
China,20000000000,2020,1523234234
America,30000000000,2020,31324532214
England,10000000000,2020,913045781
Canada,5000000000,2020,130423578"

User Input: 帮我展示历年全球各国家GDP排名的对比，时长1分钟.

Response:
\`\`\`
{
"THOUGHT": "Your thoughts",
"FIELD_INFO":[
{
"fieldName": "country",
"description":"Represents the name of the country, which is a string.",
"type": "string",
"role": "dimension"
},
{
"fieldName": "gdp",
"description":"Represents the total GDP of each country, which is an integer.",
"type": "int",
"role": "measure"
},
{
"fieldName": "year",
"description":"Represents the current year, which is a date.",
"type": "date",
"role": "dimension"
},
{
"fieldName": "co2_emissions",
"description":"Represents the carbon dioxide emissions of each country, which is an integer.",
"type": "int",
"role": "measure"
}
],
"USEFUL_FIELDS": ["country","gdp","year"],
"VIDEO_DURATION": 60,
"REASON":  "The field 'country' is a string field, and 'year' is a date field, so they must be in USEFUL_FIELDS. User's intention is to show a comparison of the GDP rankings of different countries worldwide over the years, and 'gdp' represents the total GDP of each country. 'co2_emissions' represents carbon dioxide emissions, which is a is a numerical field and is irrelevant to the user's intention."
}
\`\`\`

----------------------------------
CSV file content:
"branch_name,percentage,average_price,quality
Apple,0.5, 6999,1523234234
Samsung,0.3,5630,31324532214
Vivo,0.1, 3020,913045781
Nokia,0.05,150,130423578"
User Input: 帮我展示市场占有率, 科技风格.

Response:
\`\`\`
{
"THOUGHT": "Your thoughts",
"FIELD_INFO":[
{
"fieldName": "branch_name",
"description":"Represents the name of the mobile phone brand, which is a string."
},
{
"fieldName": "percentage",
"description":"Represents the market share of the brand, which is a percentage."
},
{
"fieldName": "average_price",
"description":"Represents the average price of the brand, which is a float."
},
{
"fieldName": "quality",
"description":"Represents the product quality of the brand, which is an integer."
}
],
"USEFUL_FIELDS": ["branch_name","percentage"],
"COLOR_PALETTE":["#1DD0F3", "#2693FF", "#3259F4", "#1B0CA1", "#CB2BC6", "#FF581D", "#FBBB16", "#F6FB17"],
"REASON": "User's intention is to show the market share, and 'percentage' represents the market share, which is the information needed. 'branch_name' is a string field, so it must be in USEFUL_FIELDS. 'average_price' represents the average price, and 'quality' represents the product quality. They are both numerical fields and are irrelevant to the user's intention."
}
\`\`\`
----------------------------------
CSV file content:
"country,year,population
China,2020,1321
America,2020,48
England,2020,10
Canada,2020,81"

User Input: 帮我展示人口变化趋势.

Response:
\`\`\`
{
"THOUGHT": "Your thoughts",
"FIELD_INFO":[
{
"fieldName": "country",
"description":"Represents the name of the country, which is a string.",
"type": "string",
"role": "dimension"
},
{
"fieldName": "year",
"description":"Represents the current year, which is a date.",
"type": "date",
"role": "dimension"
},
{
"fieldName": "population",
"description":"Represents the total population of each country, which is an integer.",
"type": "int",
"role": "measure"
}
],
"USEFUL_FIELDS": ["country","year","population"],
"REASON": "The field 'population' is directly related to the user's intention, so it need to be selected. 'country' and 'year' are string and date fields, so they must be in USEFUL_FIELDS"
}
\`\`\`

----------------------------------
CSV file content:
"branch_name,percentage,average_price,quality
Apple,0.5, 6999,1523234234
Samsung,0.3,5630,31324532214
Vivo,0.1, 3020,913045781
Nokia,0.05,150,130423578"
User Input: 帮我绘制图表, 展示平均价格.

Response:
\`\`\`
{
"THOUGHT": "Your thoughts",
"FIELD_INFO":[
{
"fieldName": "branch_name",
"description":"Represents the name of the mobile phone brand, which is a string.",
"type": "string",
"role": "dimension"
},
{
"fieldName": "percentage",
"description":"Represents the market share of the brand, which is a percentage.",
"type": "float",
"role": "measure"
},
{
"fieldName": "average_price",
"description":"Represents the average price of the brand, which is a float.",
"type": "float",
"role": "measure"
},
{
"fieldName": "quality",
"description":"Represents the product quality of the brand, which is an integer.",
"type": "int",
"role": "measure"
}
],
"USEFUL_FIELDS": ["branch_name","average_price"],
"REASON":  "The user wants to show average price, so average_price must be in USEFUL_FIELDS. 'branch_name' is a string field, so it is a useful field "
}
\`\`\`
`;

export const getQueryDatasetPrompt = (
  showThoughts: boolean
) => `You are an expert in data analysis. Here is a raw dataset named dataSource. User want to do data query and generate a chart with this dataset.
Your task is:
1. Detect the meaning of each field in the dataset. According to user's command and data field description, write one SQL statement to query the data user needs from the data set. A dimension field must be placed in the groupBy statement of the SQL.
2. If the fields in the current data set cannot meet user needs, please generate a new field and write it in SQL. You can aggregate fields when you think it's necessary.
3. Write a description for each field in the SQL query result, describing its aggregation method and other information and fill it in the fieldInfo array.
4. Response in JSON format without any additional descriptions

Let's think step by step. ${showThoughts ? 'Fill your thoughts in {thoughts}.' : ''}

Response in the following JSON format:
\`\`\`
{
${
  showThoughts ? 'thoughts: string; //Your thoughts\n' : ''
}SQL: string; //your sql statement. Note that it's a string in a JSON object so it must be in one line without any \\n.
fieldInfo: {
  fieldName: string; //name of the field.
  description?: string; //description of the field. If it is an aggregated field, please describe how it is generated in detail.
}[]
}
\`\`\`

Constraints:
1. No user assistance.
2. Make sure your SQL includes all useful fields.
3. DO NOT change or translate the field names in your SQL statement.
4. Wrap the response content with \`\`\`, and the content must be directly parsed by JSON.parse() in JavaScript.
5. Response without any additional descriptions and other formats.
`;
