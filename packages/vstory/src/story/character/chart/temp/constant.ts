import { StoryChartType } from '../../../../dsl/constant';

export enum TemplateChartType {
  bar = StoryChartType.BAR,
  area = StoryChartType.AREA,
  line = StoryChartType.LINE,
  pie = StoryChartType.PIE,
  scatter = StoryChartType.SCATTER,
  rangeColumn = StoryChartType.RANGE_COLUMN,
  rose = StoryChartType.ROSE,
  radar = StoryChartType.RADAR,
  wordcloud = StoryChartType.WORD_CLOUD,
  treemap = StoryChartType.TREE_MAP,
  sunburst = StoryChartType.SUNBURST
}
