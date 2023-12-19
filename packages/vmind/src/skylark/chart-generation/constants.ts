import { ChannelInfo } from '../typings';

export const ChartFieldInfo: ChannelInfo = {
  'BAR CHART': {
    visualChannels: {
      x: "x-axis of bar chart. Can't be empty. Only string fields",
      y: "y-axis of bar chart. Can't be empty. Only number fields",
      color:
        'color channel of bar chart. Used to distinguish different bars. Only string fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.']
  },
  'PIE CHART': {
    visualChannels: {
      angle: 'angle of sectors in the pie chart. Only number fields',
      color:
        "color of sectors in the pie chart. Used to distinguish different sectors. Only string fields. Can't be empty."
    },
    responseDescription: {
      angle: 'field assigned to angle channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.']
  },
  'LINE CHART': {
    visualChannels: {
      x: "x-axis of line chart. Can't be empty. Only string fields",
      y: "y-axis of line chart. Can't be empty. Only number fields",
      color:
        'color channel of line chart. Used to distinguish different lines. Only string fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.']
  },
  'SCATTER PLOT': {
    visualChannels: {
      x: "x-axis of scatter plot. Can't be empty.",
      y: "y-axis of scatter plot. Can't be empty.",
      color: 'color channel of scatter plot. Used to distinguish different points. Can be empty if no suitable field.',
      size: 'size channel of scatter plot. Mapped to the size of each point. Only number fields. Can be empty if no suitable field.'
    },
    responseDescription: {
      x: 'field assigned to x channel',
      y: 'field assigned to y channel',
      color: 'field assigned to color channel',
      size: 'field assigned to size channel'
    },
    knowledge: ['Only number fields can be used in size channel.']
  },
  'WORD CLOUD': {
    visualChannels: {
      size: "size channel of wordcloud. Mapped to the size of each word. Only number fields. Can't be empty",
      color:
        "color channel of wordcloud. Mapped to the color of each word. Used to distinguish different words. Only string fields. Can't be empty."
    },
    responseDescription: {
      size: 'field assigned to x channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.', 'Only number fields can be used in size channel.']
  },
  'RADAR CHART': {
    visualChannels: {
      angle: "angle channel of radar chart. Used to distinguish different variables. Can't be empty.",
      value: "Used to show the value of each variable in radar chart. Can't be empty.",
      color: 'color channel of radar chart. Used to distinguish different variables. Can be empty if no suitable field.'
    },
    responseDescription: {
      angle: 'field assigned to angle channel',
      value: 'field assigned to value channel',
      color: 'field assigned to color channel'
    },
    knowledge: [
      'Only string fields can be used in angle channel.',
      'Only number fields can be used in value channel.',
      'Only string fields can be used in color channel.'
    ]
  },
  'SANKEY CHART': {
    visualChannels: {
      source: "mapped to the source node of flow in sankey chart. Can't be empty.",
      target: "mapped to the target node of flow in sankey chart. Can't be empty.",
      value: "mapped to the amount of the flow in sankey chart. Can't be empty."
    },
    responseDescription: {
      source: 'field assigned to source channel',
      target: 'field assigned to target channel',
      value: 'field assigned to value channel'
    },
    knowledge: [
      'Only string fields can be used in source channel.',
      'Only number fields can be used in value channel.',
      'Only string fields can be used in target channel.'
    ]
  },
  'ROSE CHART': {
    visualChannels: {
      radius: 'radius of sectors in the rose chart. Only number fields',
      color:
        "color of sectors in rose chart. Used to distinguish different sectors. Only string fields. Can't be empty."
    },
    responseDescription: {
      radius: 'field assigned to radius channel',
      color: 'field assigned to color channel'
    },
    knowledge: ['Only string fields can be used in color channel.']
  }
};

export const chartRecommendKnowledge = [
  'Bar chart shows the changes or comparisons of various categories of data.',
  'Line Chart shows the trend of data over time.',
  'Pie chart shows the proportion of each part in the total.',
  'Scatter plot shows the relationship between two variables',
  'Word cloud shows word frequency of text data, usually used to show trends, comparison or popularity of keywords.',
  'Dual-axis chart shows the changes of two variables with different ranges or units.',
  'Sankey chart shows the transfer of flow or energy, reflecting the relationship between various parts.',
  'Radar chart shows data of multiple variables, allowing comparisons between various variables.',
  'Rose chart shows the distribution of periodic data.',
  'Waterfall chart shows the cumulative effect of data, such as the contribution of each part to the total.',
  'Funnel chart shows the process or stages of data, such as the contribution of each stage to the total.',
  'Box plot shows the distribution and outliers of data.',
  'Dynamic Bar Chart is a dynamic chart that is suitable for displaying changing data and can be used to show ranking, comparisons or data changes over time. It usually has a time field. It updates the data dynamically according to the time field and at each time point, the current data is displayed using a bar chart.',
  'Dynamic Bar Chart can only be used when data has a field that is date type.'
];
