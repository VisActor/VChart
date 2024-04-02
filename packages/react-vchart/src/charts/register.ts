import {
  registerBrush, // optional
  registerContinuousLegend,
  registerDataZoom,
  registerDiscreteLegend,
  registerCustomMark,
  registerAllMarks,
  registerMarkArea,
  registerMarkLine,
  registerMarkPoint,
  registerScrollBar,
  registerTitle
} from '@visactor/vchart';

export const cartesianComponentsRegisters = [
  registerBrush, // optional
  registerContinuousLegend,
  registerDataZoom,
  registerDiscreteLegend,
  registerCustomMark,
  registerAllMarks,
  registerMarkArea,
  registerMarkLine,
  registerMarkPoint,
  registerScrollBar,
  registerTitle
];

export const polarComponentsRegisters = [
  registerBrush, // optional
  registerContinuousLegend,
  registerDataZoom,
  registerDiscreteLegend,
  registerCustomMark,
  registerAllMarks,
  registerScrollBar,
  registerTitle
];

export const simpleComponentsRegisters = [
  registerDiscreteLegend,
  registerContinuousLegend,
  registerCustomMark,
  registerAllMarks,
  registerTitle
];
