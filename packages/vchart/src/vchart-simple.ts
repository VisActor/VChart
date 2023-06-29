/**
 * @description 包含基础的折柱饼图，提供坐标轴、离散图例以及 tooltip、crosshair、label 组件
 */
import { VChart } from './core';
import { LineChart, BarChart, PieChart } from './chart';
import {
  CartesianLinearAxis,
  CartesianBandAxis,
  CartesianTimeAxis,
  DiscreteLegend,
  Tooltip,
  CartesianCrossHair,
  Label
} from './component';

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
