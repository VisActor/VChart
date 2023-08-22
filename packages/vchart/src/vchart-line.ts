/**
 * @description 包含基础的折线图，提供坐标轴、离散图例以及 tooltip、crosshair、label 组件
 */
import { VChart } from './core';
import { LineChart } from './chart/line/index';
import { CartesianLinearAxis } from './component/axis/cartesian/linear-axis';
import { CartesianBandAxis } from './component/axis/cartesian/band-axis';
import { CartesianTimeAxis } from './component/axis/cartesian/time-axis';
import { Tooltip } from './component/tooltip/index';
import { DiscreteLegend } from './component/legend/discrete/index';
import { Label } from './component/label/index';
import { CartesianCrossHair } from './component/crosshair/cartesian';

// import {
//   CartesianLinearAxis,
//   CartesianBandAxis,
//   CartesianTimeAxis,
//   DiscreteLegend,
//   Tooltip,
//   CartesianCrossHair,
//   Label
// } from './component';

// charts
VChart.useChart([LineChart]);

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
