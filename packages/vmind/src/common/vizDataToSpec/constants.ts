export const SUPPORTED_CHART_LIST = [
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
  'Box Plot Chart',
  'Dynamic Bar Chart'
];

export const animationDuration = 500;
export const oneByOneGroupSize = 10; //one-by-one动画 10个点一组
export const DEFAULT_VIDEO_LENGTH = 2000;
export const DEFAULT_PIE_VIDEO_LENGTH = 5000;
export const DEFAULT_VIDEO_LENGTH_LONG = 10000;
export const VIDEO_LENGTH_BY_CHART_TYPE: Record<string, number> = {
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
