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
  }
};
