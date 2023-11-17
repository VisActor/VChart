export const mockGPTResponseLineChart = {
  THOUGHT:
    "The user wants to show the sales trend of each product, and the user wants to use a line chart. The data contains the date field, product type, and sales value, which can be used to draw a line chart. The 'date' field is used as the x-axis because it's a date, and the 'value' field is used as the y-axis because it's a number. The 'type' field is used to distinguish different products.",
  CHART_TYPE: 'Line Chart',
  FIELD_MAP: {
    x: 'date',
    y: 'value',
    color: 'type'
  },
  REASON:
    "The line chart is suitable for displaying data that changes over time and can show the change trend, which can meet the user's intent. Line Chart is in the list of supported charts. The visual mapping result meets the user's intent. All fields in the data are used in the visual mapping. The keys in FIELD_MAP are all available visual channels.",
  DOUBLE_CHECK:
    "The line chart is suitable for displaying data that changes over time and can show the change trend, which can meet the user's intent. Line Chart is in the list of supported charts. The visual mapping result meets the user's intent. All fields in the data are used in the visual mapping. The keys in FIELD_MAP are all available visual channels. The reply content can be directly parsed by JSON.parse() in JavaScript.",
  VIDEO_DURATION: 10
};

export const mockGPTResponseBarChart = {
  VIDEO_DURATION: 20,
  THOUGHT:
    "The user wants to show the sales of different products in different regions, which is suitable for displaying with a bar chart. The 'region' field can be used as the x-axis to show the sales of different regions, and the '销售额' field can be used as the y-axis to show the sales of different products. The '商品名称' field can be used as the color to distinguish different products. Since the user wants a business style, a Bar Chart is chosen.",
  CHART_TYPE: 'Bar Chart',
  FIELD_MAP: {
    x: 'region',
    y: '销售额',
    color: '商品名称'
  },
  REASON:
    "The user wants to show the sales of different products in different regions, which is suitable for displaying with a bar chart. The 'region' field can be used as the x-axis to show the sales of different regions, and the '销售额' field can be used as the y-axis to show the sales of different products. The '商品名称' field can be used as the color to distinguish different products. Since the user wants a business style, a Bar Chart is chosen.",
  DOUBLE_CHECK:
    "The Bar Chart is suitable for displaying the sales of different products in different regions, which can meet the user's intent. Bar Chart is in the list of supported charts. The visual mapping result meets the user's intent. All fields in the data are used in the visual mapping. The keys in FIELD_MAP are all available visual channels. The reply content can be directly parsed by JSON.parse() in JavaScript."
};

export const mockGPTResponsePieChart = {
  VIDEO_DURATION: 10,
  THOUGHT:
    "The user wants to show the market share of different mobile phone brands, and the user prefers a Chinese style. The data has two fields, one is the brand name, and the other is the market share, which is a percentage. The user's intention is to show the proportion of market share of different brands, which is suitable for a pie chart. The '品牌名称' field is used as the color to distinguish different brands, and the '市场份额' field is used as the angle of the pie chart to show the market share of each brand.",
  CHART_TYPE: 'Pie Chart',
  FIELD_MAP: {
    angle: '市场份额',
    color: '品牌名称'
  },
  REASON:
    'The data contains the market share, and the user wants to show percentage data, which is suitable for displaying with a pie chart. The 市场份额 is used as the angle of the pie chart to show the market share of each brand. The 品牌名称 is used as the color to distinguish different brands. The Chinese style is not related to the chart type or visual mapping.',
  DOUBLE_CHECK:
    "The pie chart is suitable for displaying percentage data such as market share, which can meet the user's intent. Pie Chart is in the list of supported charts. The visual mapping result meets the user's intent. All fields in the data are used in the visual mapping. The keys in FIELD_MAP are all available visual channels. The reply content can be directly parsed by JSON.parse() in JavaScript.",
  COLOR_PALETTE: ['#FF6000', '#FFE6C7', '#FFA559', '#454545', '#B70404', '#DB005B', '#F79327', '#FFE569']
};

export const mockGPTResponseFunnelChart = {
  THOUGHT:
    "The user wants to show the proportion of conversion rate between different processes, which is suitable for displaying with a funnel chart. The data contains the conversion rate, process name, and month, and the user wants to show the data in a forest style. The '流程' field is used as the x-axis of the funnel chart to show the name of each process. The '转化率' field is used as the y-axis of the funnel chart to show the proportion of conversion rate between different processes. The 'Month' field is not used in the visual mapping because it's not necessary for the funnel chart.",
  CHART_TYPE: 'Funnel Chart',
  FIELD_MAP: {
    x: '流程',
    y: '转化率'
  },
  REASON:
    "The user wants to show the proportion of conversion rate between different processes, which is suitable for displaying with a funnel chart. The data contains the conversion rate, process name, and month, and the user wants to show the data in a forest style. The '流程' field is used as the x-axis of the funnel chart to show the name of each process. The '转化率' field is used as the y-axis of the funnel chart to show the proportion of conversion rate between different processes. The 'Month' field is not used in the visual mapping because it's not necessary for the funnel chart.",
  DOUBLE_CHECK:
    "The funnel chart is suitable for displaying the proportion of conversion rate between different processes, which can meet the user's intent. Funnel Chart is in the list of supported charts. The visual mapping result meets the user's intent. All fields in the data are used in the visual mapping. The keys in FIELD_MAP are all available visual channels. The reply content can be directly parsed by JSON.parse() in JavaScript."
};

export const mockGPTResponseDualAxisChart = {
  THOUGHT:
    'The user wants to compare the breakfast consumption of male and female students, which is suitable for displaying with a bar chart. The data contains the breakfast consumption of male and female students and the day of the week, and the user wants to show the data in a forest style.',
  CHART_TYPE: 'Bar Chart',
  FIELD_MAP: {
    x: '时间',
    y: ['男-早餐', '女-早餐'],
    color: '性别'
  },
  REASON:
    "The user wants to compare the breakfast consumption of male and female students, which is suitable for displaying with a bar chart. The '时间' field is used as the x-axis of the bar chart to show the day of the week. The '男-早餐' and '女-早餐' fields are used as the y-axis of the bar chart to show the breakfast consumption of male and female students. The '性别' field is used as the color to distinguish between male and female students. The forest style is used to make the chart more visually appealing.",
  DOUBLE_CHECK:
    "The bar chart is suitable for comparing data between different categories, which can meet the user's intent. Bar Chart is in the list of supported charts. The visual mapping result meets the user's intent. All fields in the data are used in the visual mapping. The keys in FIELD_MAP are all available visual channels. The reply content can be directly parsed by JSON.parse() in JavaScript."
};
