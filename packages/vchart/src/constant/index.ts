import { PREFIX } from './base';

export const DEFAULT_MEASURE_CANVAS_ID = `${PREFIX}_MEASURE_CANVAS_ID`;

export const DEFAULT_DATA_INDEX = `${PREFIX}_DEFAULT_DATA_INDEX`;

export const DEFAULT_DATA_KEY = `${PREFIX}_DEFAULT_DATA_KEY`;

export const DEFAULT_DATA_SERIES_FIELD = `${PREFIX}_DEFAULT_DATA_SERIES_FIELD`;

export const DEFAULT_SERIES_STYLE_NAME = `${PREFIX}_DEFAULT_SERIES_STYLE_NAME`;

export enum AttributeLevel {
  Default = 0,
  Theme = 1,
  Chart = 2,
  Base_Series = 3, // general operation in base series
  Series = 4, // specified operation in derived series
  Mark = 5,
  User_Chart = 6,
  User_Series = 7,
  User_Mark = 8,
  Built_In = 99
}

export const STACK_FIELD_START = `${PREFIX}_STACK_START`;
export const STACK_FIELD_END = `${PREFIX}_STACK_END`;
export const STACK_FIELD_START_PERCENT = `${PREFIX}_STACK_START_PERCENT`;
export const STACK_FIELD_END_PERCENT = `${PREFIX}_STACK_END_PERCENT`;
export const STACK_FIELD_START_OffsetSilhouette = `${PREFIX}_STACK_START_OffsetSilhouette`;
export const STACK_FIELD_END_OffsetSilhouette = `${PREFIX}_STACK_END_OffsetSilhouette`;
export const STACK_FIELD_TOTAL = `${PREFIX}_STACK_TOTAL`;
export const STACK_FIELD_TOTAL_PERCENT = `${PREFIX}_STACK_TOTAL_PERCENT`;
export const STACK_FIELD_TOTAL_TOP = `${PREFIX}_STACK_TOTAL_TOP`;

export const SEGMENT_FIELD_START = `${PREFIX}_SEGMENT_START`;
export const SEGMENT_FIELD_END = `${PREFIX}_SEGMENT_END`;

export enum LayoutZIndex {
  Axis_Grid = 50,
  CrossHair_Grid = 100,
  Region = 450,

  Mark = 300,

  Node = 400,

  Axis = 100,

  MarkLine = 500,

  MarkArea = 100,

  MarkPoint = 500,

  DataZoom = 500,

  ScrollBar = 500,

  Player = 500,

  Legend = 500,

  CrossHair = 500,

  Indicator = 500,

  Title = 500,

  Label = 500,

  Brush = 500,

  CustomMark = 500,

  interaction = 700
}
/**
 * 数值越大，越先布局
 */
export enum LayoutLevel {
  Indicator = 10,

  Region = 20,

  Axis = 30,

  DataZoom = 40,

  Player = 40,

  ScrollBar = 40,

  Legend = 50,

  Title = 70,

  CustomMark = 70
}

export const GradientType = ['linear', 'radial', 'conical'];

export const DEFAULT_LINEAR_GRADIENT_CONFIG = {
  x0: 0,
  y0: 0,
  x1: 1,
  y1: 1
};

export const DEFAULT_RADIAL_GRADIENT_CONFIG = {
  x0: 0,
  y0: 0,
  x1: 1,
  y1: 1,
  r0: 0,
  r1: 1
};

export const DEFAULT_CONICAL_GRADIENT_CONFIG = {
  x: 0.5,
  y: 0.5,
  startAngle: 0,
  endAngle: Math.PI * 2
};

export const DEFAULT_GRADIENT_CONFIG = {
  linear: DEFAULT_LINEAR_GRADIENT_CONFIG,
  radial: DEFAULT_RADIAL_GRADIENT_CONFIG,
  conical: DEFAULT_CONICAL_GRADIENT_CONFIG
};

export * from './base';
export * from './label';
export * from './polar';
export * from './layout';
export * from './event';
export * from './waterfall';
export * from './correlation';
