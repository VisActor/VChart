import { Label } from './component/label/label';
import { CartesianCrossHair } from './component/crosshair/cartesian';
import { Tooltip } from './component/tooltip/tooltip';
import { DiscreteLegend } from './component/legend/discrete/legend';
import { CartesianTimeAxis } from './component/axis/cartesian/time-axis';
import { CartesianBandAxis } from './component/axis/cartesian/band-axis';
import { CartesianLinearAxis } from './component/axis/cartesian/linear-axis';
/**
 * @description 包含基础的折柱饼图，提供坐标轴、离散图例以及 tooltip、crosshair、label 组件
 */
import { VChart } from './core';
import { LineChart } from './chart/line';
import { PieChart } from './chart/pie';
import { BarChart } from './chart/bar';

// charts
VChart.useChart([LineChart, BarChart, PieChart]);

// components
VChart.useComponent([
  CartesianLinearAxis,
  CartesianBandAxis,
  CartesianTimeAxis,
  DiscreteLegend,
  Tooltip,
  CartesianCrossHair,
  Label
]);

export { VChart };
