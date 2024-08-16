/* eslint-disable no-duplicate-imports */
/**
 * @description export all chart modules
 */
import type { IAreaChartSpec } from './area';
import { AreaChart, registerAreaChart } from './area';
import type { IBarChartSpec, IBar3dChartSpec } from './bar';
import { BarChart, Bar3dChart, registerBarChart, registerBar3dChart } from './bar';
import type { IBoxPlotChartSpec } from './box-plot';
import { BoxPlotChart, registerBoxplotChart } from './box-plot';
import type { ICirclePackingChartSpec } from './circle-packing';
import { CirclePackingChart, registerCirclePackingChart } from './circle-packing';
import type { ICommonChartSpec } from './common';
import { CommonChart, registerCommonChart } from './common';
import type { IFunnelChartSpec, IFunnel3dChartSpec } from './funnel';
import { FunnelChart, Funnel3dChart, registerFunnelChart, registerFunnel3dChart } from './funnel';
import type { IGaugeChartSpec } from './gauge';
import { GaugeChart, registerGaugeChart } from './gauge';
import type { IHeatmapChartSpec } from './heatmap';
import { HeatmapChart, registerHeatmapChart } from './heatmap';
import type { IHistogramChartSpec, IHistogram3dChartSpec } from './histogram';
import { HistogramChart, Histogram3dChart, registerHistogramChart, registerHistogram3dChart } from './histogram';
import type { ILineChartSpec } from './line';
import { LineChart, registerLineChart } from './line';
import type { IMapChartSpec } from './map';
import { MapChart, registerMapChart } from './map';
import type { IPieChartSpec, IPie3dChartSpec } from './pie';
import { PieChart, Pie3dChart, registerPieChart, registerPie3dChart } from './pie';
import type { ICircularProgressChartSpec } from './progress/circular';
import { CircularProgressChart, registerCircularProgressChart } from './progress/circular';
import type { ILinearProgressChartSpec } from './progress/linear';
import { LinearProgressChart, registerLinearProgressChart } from './progress/linear';
import type { IRadarChartSpec } from './radar';
import { RadarChart, registerRadarChart } from './radar';
import type { IRangeAreaChartSpec } from './range-area';
import { RangeAreaChart, registerRangeAreaChart } from './range-area';
import type { IRangeColumnChartSpec, IRangeColumn3dChartSpec } from './range-column';
import {
  RangeColumnChart,
  RangeColumn3dChart,
  registerRangeColumnChart,
  registerRangeColumn3dChart
} from './range-column';
import type { IRoseChartSpec } from './rose';
import { RoseChart, registerRoseChart } from './rose';
import type { ISankeyChartSpec } from './sankey';
import { SankeyChart, registerSankeyChart } from './sankey';
import type { IScatterChartSpec } from './scatter';
import { ScatterChart, registerScatterChart } from './scatter';
import type { ISequenceChartSpec } from './sequence';
import { SequenceChart, registerSequenceChart } from './sequence';
import type { ISunburstChartSpec } from './sunburst';
import { SunburstChart, registerSunburstChart } from './sunburst';
import type { ITreemapChartSpec } from './treemap';
import { TreemapChart, registerTreemapChart } from './treemap';
import type { IWaterfallChartSpec } from './waterfall';
import { WaterfallChart, registerWaterfallChart } from './waterfall';
import type { ICorrelationChartSpec } from './correlation';
import { CorrelationChart, registerCorrelationChart } from './correlation';
import type { ILiquidChartSpec } from './liquid';
import { LiquidChart, registerLiquidChart } from './liquid';
import type { IWordCloudChartSpec, IWordCloud3dChartSpec } from './word-cloud';
import {
  WordCloudChart,
  WordCloud3dChart,
  registerWordCloudChart,
  registerWordCloudShapeChart,
  registerWordCloud3dChart
} from './word-cloud';
import { BaseChart } from './base/base-chart';
import type { ICartesianChartSpec } from './cartesian';
import type { IPolarChartSpec } from './polar';
import type { IVennChartSpec } from './venn';
import { VennChart, registerVennChart } from './venn';
import type { IMosaicChartSpec } from './mosaic';
import { MosaicChart, registerMosaicChart } from './mosaic';
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
  CorrelationChart,
  LiquidChart,
  WordCloudChart,
  WordCloud3dChart,
  TreemapChart,
  VennChart,
  BaseChart,
  MosaicChart
};

export {
  registerLineChart,
  registerAreaChart,
  registerBarChart,
  registerBar3dChart,
  registerBoxplotChart,
  registerCirclePackingChart,
  registerCircularProgressChart,
  registerCommonChart,
  registerFunnelChart,
  registerFunnel3dChart,
  registerGaugeChart,
  registerHeatmapChart,
  registerHistogramChart,
  registerHistogram3dChart,
  registerLinearProgressChart,
  registerMapChart,
  registerPie3dChart,
  registerPieChart,
  registerRadarChart,
  registerRangeAreaChart,
  registerRangeColumn3dChart,
  registerRangeColumnChart,
  registerRoseChart,
  registerSankeyChart,
  registerScatterChart,
  registerSequenceChart,
  registerSunburstChart,
  registerTreemapChart,
  registerWaterfallChart,
  registerWordCloud3dChart,
  registerWordCloudChart,
  registerCorrelationChart,
  registerLiquidChart,
  registerWordCloudShapeChart,
  registerVennChart,
  registerMosaicChart
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
  ICorrelationChartSpec,
  ILiquidChartSpec,
  IWordCloud3dChartSpec,
  IWordCloudChartSpec,
  IPolarChartSpec,
  ICartesianChartSpec,
  IVennChartSpec,
  IMosaicChartSpec
};
