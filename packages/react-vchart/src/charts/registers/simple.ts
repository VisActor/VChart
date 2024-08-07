import {
  registerContinuousLegend,
  registerDiscreteLegend,
  registerCustomMark,
  registerAllMarks,
  registerTitle,
  registerTooltip,
  registerDomTooltipHandler
} from '@visactor/vchart';

export const registers = [
  registerTooltip,
  registerDomTooltipHandler,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerCustomMark,
  registerAllMarks,
  registerTitle
];
