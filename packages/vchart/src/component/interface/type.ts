export type ComponentType = keyof typeof ComponentTypeEnum | string;

export enum ComponentTypeEnum {
  cartesianAxis = 'cartesianAxis',
  cartesianBandAxis = 'cartesianAxis-band',
  cartesianLinearAxis = 'cartesianAxis-linear',
  cartesianTimeAxis = 'cartesianAxis-time',
  cartesianLogAxis = 'cartesianAxis-log',
  cartesianSymlogAxis = 'cartesianAxis-symlog',
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
  totalLabel = 'totalLabel',

  brush = 'brush',

  poptip = 'poptip',

  customMark = 'customMark'
}

/**
 * 简化过的组件类型枚举，用于媒体查询。
 * 如果一些组件在 ComponentTypeEnum 里分类太细（如"cartesianAxis-symlog"），导致用户对这些具体的 type 字符串不熟悉，那么可以将简化版放进这个枚举
 */
export enum SimplifiedComponentTypeEnum {
  axis = 'axis',
  legend = 'legend',
  crosshair = 'crosshair'
}

/**
 * 所有轴相关的组件类型枚举
 */
export const axisComponentTypes: ComponentTypeEnum[] = [
  ComponentTypeEnum.cartesianAxis,
  ComponentTypeEnum.cartesianBandAxis,
  ComponentTypeEnum.cartesianLinearAxis,
  ComponentTypeEnum.cartesianTimeAxis,
  ComponentTypeEnum.cartesianLogAxis,
  ComponentTypeEnum.cartesianSymlogAxis,
  ComponentTypeEnum.polarAxis,
  ComponentTypeEnum.polarBandAxis,
  ComponentTypeEnum.polarLinearAxis
];

/**
 * 所有图例相关的组件类型枚举
 */
export const legendComponentTypes: ComponentTypeEnum[] = [
  ComponentTypeEnum.discreteLegend,
  ComponentTypeEnum.continuousLegend,
  ComponentTypeEnum.colorLegend,
  ComponentTypeEnum.sizeLegend
];

/**
 * 所有 crosshair 相关的组件类型枚举
 */
export const crosshairComponentTypes: ComponentTypeEnum[] = [
  ComponentTypeEnum.crosshair,
  ComponentTypeEnum.cartesianCrosshair,
  ComponentTypeEnum.polarCrosshair
];
