import { registerLabel } from './component/label/label';
import { registerCartesianCrossHair } from './component/crosshair/cartesian';
import { registerTooltip } from './component/tooltip/tooltip';
import { registerDiscreteLegend } from './component/legend/discrete/legend';
import { registerCartesianTimeAxis } from './component/axis/cartesian/time-axis';
import { registerCartesianBandAxis } from './component/axis/cartesian/band-axis';
import { registerCartesianLinearAxis } from './component/axis/cartesian/linear-axis';
/**
 * @description 包含基础的折柱饼图，提供坐标轴、离散图例以及 tooltip、crosshair、label 组件
 */
import { VChart } from './core';
import { registerLineChart } from './chart/line';
import { registerBarChart } from './chart/bar';
import { registerPieChart } from './chart/pie';
import { registerAllEnv } from './env';

export * from './core';

VChart.useRegisters([
  // charts
  registerLineChart,
  registerBarChart,
  registerPieChart,

  // components
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis,
  registerDiscreteLegend,
  registerTooltip,
  registerCartesianCrossHair,
  registerLabel
]);

// load env code
VChart.useRegisters([registerAllEnv]);

export { VChart };
