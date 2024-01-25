export type MarkType = keyof typeof MarkTypeEnum | string;

export const enum MarkTypeEnum {
  group = 'group',

  symbol = 'symbol',
  rule = 'rule',
  line = 'line',
  text = 'text',
  rect = 'rect',
  rect3d = 'rect3d',
  image = 'image',
  path = 'path',
  area = 'area',
  arc = 'arc',
  arc3d = 'arc3d',
  polygon = 'polygon',
  pyramid3d = 'pyramid3d',
  boxPlot = 'boxPlot',
  linkPath = 'linkPath',
  progressArc = 'progressArc',
  cell = 'cell',
  ripple = 'ripple',

  component = 'component',
  label = 'label'
}
