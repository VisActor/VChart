export enum AeolusChartType {
  /** 自动 */
  AUTO = 'auto',

  /** 表格 */
  TABLE = 'table',
  /** 明细表 */
  RAW_TABLE = 'raw_table',
  /** 透视表 */
  PIVOT_TABLE = 'pivot_table',
  /** 趋势分析表格 */
  TREND_TABLE = 'trend_table',
  /** xTable透视表 */
  // PIVOT_XTABLE = 'pivot_xtable',
  /** 柱状图 */
  COLUMN = 'column',
  /** 百分比柱状图 */
  COLUMN_PERCENT = 'column_percent',
  /** 并列柱状图 */
  COLUMN_PARALLEL = 'column_parallel',
  /** 条形图 */
  BAR = 'bar',
  /** 百分比条形图 */
  BAR_PERCENT = 'bar_percent',
  /** 并列条形图 */
  BAR_PARALLEL = 'bar_parallel',

  /** 折线图 */
  LINE = 'line',
  /** 面积图 */
  AREA = 'area',
  /** 百分比面积图 */
  AREA_PERCENT = 'area_percent',

  /** 饼图 */
  PIE = 'pie',
  /** 环形饼图 */
  ANNULAR = 'annular',
  /** 南丁格尔玫瑰图 */
  ROSE = 'rose',

  /** 散点图 */
  SCATTER = 'scatter',
  /** 圆视图 */
  CIRCLE_VIEWS = 'circle_views',

  /** 双轴图 */
  DUAL_AXIS = 'double_axis',
  /** 双向条形图 */
  BILATERAL = 'bilateral',
  /** 组合图 */
  COMBINATION = 'combination',

  /** 填充地图 */
  MAP = 'map',
  /** 标记地图 */
  SCATTER_MAP = 'scatter_map',

  /** GIS地图 */
  GIS_MAP = 'gis_map',
  /** GIS标记地图 */
  GIS_MARK_MAP = 'gis_mark_map',
  /** 热力地图 */
  GIS_HEAT_MAP = 'gis_heat_map',
  /** 飞线地图 */
  GIS_PULSE_MAP = 'gis_pulse_map',
  /** 轨迹地图 */
  GIS_TRACE_MAP = 'gis_trace_map',
  /** GIS 3D 柱状地图 */
  GIS_BAR_MAP = 'gis_bar_map',

  /** 指标卡 */
  MEASURE_CARD = 'measure_card',
  /** 对比指标卡 */
  COMPARATIVE_MEASURE_CARD = 'comparative_measure_card',
  /** 指标趋势图 */
  MEASURE_TREND = 'measure_trend',
  /** 词云 */
  WORD_CLOUD = 'word_cloud',
  /** 直方图 */
  HISTOGRAM = 'histogram',
  /** 漏斗图 */
  FUNNEL = 'funnel',
  /** 雷达图 */
  RADAR = 'radar',
  /** 桑基图 */
  SANKEY = 'sankey',

  /** 仪表图 */
  GAUGE = 'gauge',
  /** 进度图 */
  PROGRESS = 'progress',

  /** 构成瀑布图 */
  WATERFALL = 'waterfall',
  /** 变化瀑布图 */
  WATERFALL_CHANGE = 'waterfall_change',

  /** 扩展自定义类型 */
  EXTEND = 'extend'
}

export const barLinkAeolusChartList = [
  AeolusChartType.COLUMN,
  AeolusChartType.COLUMN_PERCENT,
  AeolusChartType.BAR,
  AeolusChartType.BAR_PERCENT,
  AeolusChartType.DUAL_AXIS,
  AeolusChartType.COMBINATION
];

export enum TemplateChartType {
  bar = 'BarChart',
  barGroup = 'barGroup',
  barPercent = 'barPercent',
  horizontalBar = 'horizontalBar',
  horizontalBarGroup = 'horizontalBarGroup',
  horizontalBarPercent = 'horizontalBarPercent',
  area = 'area',
  areaPercent = 'areaPercent',
  line = 'LineChart',
  pie = 'pie',
  dualAxis = 'dualAxis',
  waterfall = 'waterfall'
}

export const seriesLabelChartList: string[] = [
  TemplateChartType.bar,
  TemplateChartType.barPercent,
  TemplateChartType.horizontalBar,
  TemplateChartType.horizontalBarPercent,
  TemplateChartType.area,
  TemplateChartType.line,
  TemplateChartType.areaPercent,
  TemplateChartType.waterfall
];

export const seriesLabelAeolusChartList = [
  AeolusChartType.COLUMN,
  AeolusChartType.COLUMN_PERCENT,

  AeolusChartType.BAR,
  AeolusChartType.BAR_PERCENT,

  AeolusChartType.LINE,
  AeolusChartType.AREA,
  AeolusChartType.AREA_PERCENT,

  AeolusChartType.WATERFALL,
  AeolusChartType.WATERFALL_CHANGE
];
