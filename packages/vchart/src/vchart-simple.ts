/**
 * @description 包含基础的折柱饼图，提供坐标轴、离散图例以及 tooltip、crosshair、label 组件
 */
import { VChart } from './core';
import { registerLineChart } from './chart/line/line';
import { registerBarChart } from './chart/bar/bar';
import { registerAreaChart } from './chart/area/area';
import { registerPieChart } from './chart/pie/pie';
import { registerCommonChart } from './chart/common/common';

import { registerLabel } from './component/label/label';
import { registerCartesianCrossHair } from './component/crosshair/cartesian';
import { registerTooltip } from './component/tooltip/tooltip';
import { registerDiscreteLegend } from './component/legend/discrete/legend';
import { registerCartesianBandAxis } from './component/axis/cartesian/band-axis';
import { registerCartesianLinearAxis } from './component/axis/cartesian/linear-axis';
import { registerCanvasTooltipHandler, registerDomTooltipHandler } from './plugin';
import {
  registerElementActive,
  registerElementActiveByLegend,
  registerElementHighlightByLegend,
  registerElementHighlightByName,
  registerElementHighlightByGroup,
  registerElementHighlightByKey
} from './interaction';

export * from './core';

VChart.useRegisters([
  // charts
  registerLineChart,
  registerAreaChart,
  registerBarChart,
  registerPieChart,
  registerCommonChart,

  // components
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerDiscreteLegend,
  registerTooltip,
  registerCartesianCrossHair,
  registerLabel,

  // plugin
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,

  // vgrammar interactions,
  registerElementActive,

  registerElementActiveByLegend,
  registerElementHighlightByLegend,

  registerElementHighlightByName,
  registerElementHighlightByGroup,
  registerElementHighlightByKey
]);

export { VChart };

export default VChart;
