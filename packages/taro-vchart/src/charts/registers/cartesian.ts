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
  registerTitle,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis,
  registerCartesianLogAxis,
  registerCartesianCrossHair,
  registerTooltip,
  registerCanvasTooltipHandler
} from '@visactor/vchart';

export const registers = [
  registerTooltip,
  registerCanvasTooltipHandler,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis,
  registerCartesianLogAxis,
  registerCartesianCrossHair,
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
