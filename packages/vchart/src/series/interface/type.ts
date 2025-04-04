export type SeriesType = keyof typeof SeriesTypeEnum | string;

export enum SeriesTypeEnum {
  area = 'area',
  line = 'line',
  bar = 'bar',
  bar3d = 'bar3d',
  rangeColumn = 'rangeColumn',
  rangeColumn3d = 'rangeColumn3d',
  rangeArea = 'rangeArea',
  dot = 'dot',
  geo = 'geo',
  link = 'link',
  map = 'map',
  pie = 'pie',
  pie3d = 'pie3d',
  radar = 'radar',
  rose = 'rose',
  scatter = 'scatter',
  circularProgress = 'circularProgress',
  wordCloud = 'wordCloud',
  wordCloud3d = 'wordCloud3d',
  funnel = 'funnel',
  funnel3d = 'funnel3d',
  linearProgress = 'linearProgress',
  boxPlot = 'boxPlot',
  sankey = 'sankey',
  gaugePointer = 'gaugePointer',
  gauge = 'gauge',
  treemap = 'treemap',
  sunburst = 'sunburst',
  circlePacking = 'circlePacking',
  waterfall = 'waterfall',
  heatmap = 'heatmap',
  correlation = 'correlation',
  liquid = 'liquid',
  venn = 'venn',
  mosaic = 'mosaic',
  pictogram = 'pictogram'
}

export const enum SeriesMarkNameEnum {
  label = 'label',
  point = 'point',
  line = 'line',
  area = 'area',
  bar = 'bar',
  bar3d = 'bar3d',
  boxPlot = 'boxPlot',
  outlier = 'outlier',
  circlePacking = 'circlePacking',
  group = 'group',
  gridBackground = 'gridBackground',
  grid = 'grid',
  dot = 'dot',
  title = 'title',
  subTitle = 'subTitle',
  symbol = 'symbol',
  funnel = 'funnel',
  funnel3d = 'funnel3d',
  transform = 'transform',
  transform3d = 'transform3d',
  transformLabel = 'transformLabel',
  outerLabel = 'outerLabel',
  outerLabelLine = 'outerLabelLine',
  pin = 'pin',
  pinBackground = 'pinBackground',
  pointer = 'pointer',
  segment = 'segment',
  track = 'track',
  cell = 'cell',
  cellBackground = 'cellBackground',
  link = 'link',
  arrow = 'arrow',
  pie = 'pie',
  pie3d = 'pie3d',
  labelLine = 'labelLine',
  progress = 'progress',
  minLabel = 'minLabel',
  maxLabel = 'maxLabel',
  rose = 'rose',
  node = 'node',
  sunburst = 'sunburst',
  nonLeaf = 'nonLeaf',
  leaf = 'leaf',
  nonLeafLabel = 'nonLeafLabel',
  leaderLine = 'leaderLine',
  stackLabel = 'stackLabel',
  word = 'word',
  fillingWord = 'fillingWord',
  wordMask = 'wordMask',
  nodePoint = 'nodePoint',
  ripplePoint = 'ripplePoint',
  centerPoint = 'centerPoint',
  centerLabel = 'centerLabel',
  barBackground = 'barBackground',
  lineLabel = 'lineLabel',
  areaLabel = 'areaLabel',
  liquidGroup = 'liquidGroup',
  liquid = 'liquid',
  liquidBackground = 'liquidBackground',
  liquidOutline = 'liquidOutline',
  circle = 'circle',
  overlap = 'overlap',
  overlapLabel = 'overlapLabel',
  pictogram = 'pictogram'
}
