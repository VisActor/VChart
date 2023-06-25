/* eslint-disable no-duplicate-imports */
/**
 * @description export all chart modules
 */
import type { IAreaChartSpec } from '../chart/area';
import { AreaChart } from '../chart/area';
import type { IBarChartSpec, IBar3dChartSpec } from '../chart/bar';
import { BarChart, Bar3dChart } from '../chart/bar';
import type { IBoxPlotChartSpec } from '../chart/box-plot';
import { BoxPlotChart } from '../chart/box-plot';
import type { ICirclePackingChartSpec } from '../chart/circle-packing';
import { CirclePackingChart } from '../chart/circle-packing';
import type { ICommonChartSpec } from '../chart/common';
import { CommonChart } from '../chart/common';
import type { IFunnelChartSpec, IFunnel3dChartSpec } from '../chart/funnel';
import { FunnelChart, Funnel3dChart } from '../chart/funnel';
import type { IGaugeChartSpec } from '../chart/gauge';
import { GaugeChart } from '../chart/gauge';
import type { IHeatmapChartSpec } from '../chart/heatmap';
import { HeatmapChart } from '../chart/heatmap';
import type { IHistogramChartSpec, IHistogram3dChartSpec } from '../chart/histogram';
import { HistogramChart, Histogram3dChart } from '../chart/histogram';
import type { ILineChartSpec } from '../chart/line';
import { LineChart } from '../chart/line';
import type { IMapChartSpec } from '../chart/map';
import { MapChart } from '../chart/map';
import type { IPieChartSpec, IPie3dChartSpec } from '../chart/pie';
import { PieChart, Pie3dChart } from '../chart/pie';
import type { ICircularProgressChartSpec } from '../chart/progress/circular';
import { CircularProgressChart } from '../chart/progress/circular';
import type { ILinearProgressChartSpec } from '../chart/progress/linear';
import { LinearProgressChart } from '../chart/progress/linear';
import type { IRadarChartSpec } from '../chart/radar';
import { RadarChart } from '../chart/radar';
import type { IRangeAreaChartSpec } from '../chart/range-area';
import { RangeAreaChart } from '../chart/range-area';
import type { IRangeColumnChartSpec, IRangeColumn3dChartSpec } from '../chart/range-column';
import { RangeColumnChart, RangeColumn3dChart } from '../chart/range-column';
import type { IRoseChartSpec } from '../chart/rose';
import { RoseChart } from '../chart/rose';
import type { ISankeyChartSpec } from '../chart/sankey';
import { SankeyChart } from '../chart/sankey';
import type { IScatterChartSpec } from '../chart/scatter';
import { ScatterChart } from '../chart/scatter';
import type { ISequenceChartSpec } from '../chart/sequence';
import { SequenceChart } from '../chart/sequence';
import type { ISunburstChartSpec } from '../chart/sunburst';
import { SunburstChart } from '../chart/sunburst';
import type { ITreemapChartSpec } from '../chart/treemap';
import { TreeMapChart } from '../chart/treemap';
import type { IWaterfallChartSpec } from '../chart/waterfall';
import { WaterfallChart } from '../chart/waterfall';
import type { IWordCloudChartSpec, IWordCloud3dChartSpec } from '../chart/word-cloud';
import { WordCloudChart, WordCloud3dChart } from '../chart/word-cloud';
import { BaseChart } from '../chart/base-chart';
import type { ICartesianChartSpec } from '../chart/cartesian';
import { CartesianChart } from '../chart/cartesian';
import type { IPolarChartSpec } from '../chart/polar';
import { PolarChart, RoseLikeChart, ProgressLikeChart } from '../chart/polar';

export {
  AreaChart,
  BarChart,
  Bar3dChart,
  BoxPlotChart,
  CirclePackingChart,
  CommonChart,
  FunnelChart,
  Funnel3dChart,
  GaugeChart,
  HeatmapChart,
  HistogramChart,
  Histogram3dChart,
  LineChart,
  MapChart,
  PieChart,
  Pie3dChart,
  CircularProgressChart,
  LinearProgressChart,
  RadarChart,
  RangeColumnChart,
  RangeColumn3dChart,
  RangeAreaChart,
  RoseChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  SequenceChart,
  WaterfallChart,
  WordCloudChart,
  WordCloud3dChart,
  TreeMapChart,
  BaseChart,
  PolarChart,
  ProgressLikeChart,
  RoseLikeChart,
  CartesianChart
};

export type {
  IAreaChartSpec,
  IBarChartSpec,
  IBar3dChartSpec,
  IBoxPlotChartSpec,
  ICirclePackingChartSpec,
  ICommonChartSpec,
  IFunnelChartSpec,
  IFunnel3dChartSpec,
  IGaugeChartSpec,
  IHeatmapChartSpec,
  IHistogramChartSpec,
  IHistogram3dChartSpec,
  ILineChartSpec,
  IMapChartSpec,
  IPieChartSpec,
  IPie3dChartSpec,
  ICircularProgressChartSpec,
  ILinearProgressChartSpec,
  IRadarChartSpec,
  IRangeColumnChartSpec,
  IRangeColumn3dChartSpec,
  IRangeAreaChartSpec,
  IRoseChartSpec,
  IScatterChartSpec,
  ISankeyChartSpec,
  ISequenceChartSpec,
  ISunburstChartSpec,
  ITreemapChartSpec,
  IWaterfallChartSpec,
  IWordCloud3dChartSpec,
  IWordCloudChartSpec,
  IPolarChartSpec,
  ICartesianChartSpec
};
