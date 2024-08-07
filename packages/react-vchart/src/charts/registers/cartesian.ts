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
  registerDomTooltipHandler
} from '@visactor/vchart';

export const registers = [
  registerTooltip,
  registerDomTooltipHandler,
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
