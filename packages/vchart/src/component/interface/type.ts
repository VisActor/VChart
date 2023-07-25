export type ComponentType = keyof typeof ComponentTypeEnum | string;

export enum ComponentTypeEnum {
  cartesianAxis = 'cartesianAxis',
  cartesianBandAxis = 'cartesianAxis-band',
  cartesianLinearAxis = 'cartesianAxis-linear',
  cartesianTimeAxis = 'cartesianAxis-time',
  polarAxis = 'polarAxis',
  polarBandAxis = 'polarAxis-band',
  polarLinearAxis = 'polarAxis-linear',
  crosshair = 'crosshair',
  cartesianCrosshair = 'cartesianCrosshair',
  polarCrosshair = 'polarCrosshair',
  dataZoom = 'dataZoom',
  geoCoordinate = 'geoCoordinate',
  indicator = 'indicator',
  discreteLegend = 'discreteLegend',
  continuousLegend = 'continuousLegend',
  colorLegend = 'colorLegend',
  sizeLegend = 'sizeLegend',
  mapLabel = 'mapLabel',
  markLine = 'markLine',
  markArea = 'markArea',
  markPoint = 'markPoint',
  tooltip = 'tooltip',
  title = 'title',
  player = 'player',
  scrollBar = 'scrollBar',
  label = 'label',
  brush = 'brush',

  poptip = 'poptip',

  customMark = 'customMark'
}
