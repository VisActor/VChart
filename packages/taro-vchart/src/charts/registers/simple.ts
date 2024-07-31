import {
  registerContinuousLegend,
  registerDiscreteLegend,
  registerCustomMark,
  registerAllMarks,
  registerTitle,
  registerTooltip,
  registerCanvasTooltipHandler
} from '@visactor/vchart';

export const registers = [
  registerTooltip,
  registerCanvasTooltipHandler,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerCustomMark,
  registerAllMarks,
  registerTitle
];
