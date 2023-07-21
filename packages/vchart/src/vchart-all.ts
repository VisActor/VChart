import { VChart, Factory } from './core';
import {
  AreaChart,
  LineChart,
  BarChart,
  Bar3dChart,
  ScatterChart,
  MapChart,
  PieChart,
  Pie3dChart,
  RoseChart,
  RadarChart,
  CommonChart,
  SequenceChart,
  HistogramChart,
  Histogram3dChart,
  CircularProgressChart,
  WordCloudChart,
  WordCloud3dChart,
  FunnelChart,
  Funnel3dChart,
  LinearProgressChart,
  RangeColumnChart,
  RangeColumn3dChart,
  SunburstChart,
  CirclePackingChart,
  TreeMapChart,
  WaterfallChart,
  BoxPlotChart,
  SankeyChart,
  GaugeChart,
  RangeAreaChart,
  HeatmapChart
} from './chart';

import {
  CartesianLinearAxis,
  CartesianBandAxis,
  CartesianTimeAxis,
  PolarBandAxis,
  PolarLinearAxis,
  DiscreteLegend,
  ContinuousLegend,
  Tooltip,
  CartesianCrossHair,
  PolarCrossHair,
  DataZoom,
  ScrollBar,
  Indicator,
  GeoCoordinate,
  MarkLine,
  Title,
  MarkArea,
  Player,
  Label,
  MarkPoint,
  Brush,
  CustomMark,
  MapLabelComponent
} from './component';
import { GridLayout, Layout3d } from './layout';
import { loadPoptip } from '@visactor/vrender-components';

// TODO：主题无法定义
loadPoptip(VChart.ThemeManager.getCurrentTheme().component?.poptip ?? {});

// charts
VChart.useChart([
  AreaChart,
  LineChart,
  BarChart,
  Bar3dChart,
  ScatterChart,
  MapChart,
  PieChart,
  Pie3dChart,
  RoseChart,
  RadarChart,
  CommonChart,
  SequenceChart,
  HistogramChart,
  Histogram3dChart,
  CircularProgressChart,
  WordCloudChart,
  WordCloud3dChart,
  FunnelChart,
  Funnel3dChart,
  LinearProgressChart,
  RangeColumnChart,
  RangeColumn3dChart,
  SunburstChart,
  CirclePackingChart,
  TreeMapChart,
  WaterfallChart,
  BoxPlotChart,
  SankeyChart,
  GaugeChart,
  RangeAreaChart,
  HeatmapChart
]);

// components
VChart.useComponent([
  CartesianLinearAxis,
  CartesianBandAxis,
  CartesianTimeAxis,
  PolarBandAxis,
  PolarLinearAxis,
  DiscreteLegend,
  ContinuousLegend,
  Tooltip,
  CartesianCrossHair,
  PolarCrossHair,
  DataZoom,
  ScrollBar,
  Indicator,
  GeoCoordinate,
  MarkLine,
  Title,
  MarkArea,
  Player,
  Label,
  MarkPoint,
  Brush,
  CustomMark,
  MapLabelComponent
]);

// layout
Factory.registerLayout('grid', GridLayout as any);
Factory.registerLayout('layout3d', Layout3d as any);

export { VChart };
