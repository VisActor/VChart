/* eslint-disable no-duplicate-imports */
/**
 * @description export all chart modules
 */
import type { IAreaChartSpec } from './area';
import { AreaChart, registerAreaChart } from './area';
import type { IBarChartSpec } from './bar';
import { BarChart, registerBarChart, BarChartSpecTransformer } from './bar';
import type { IBoxPlotChartSpec } from './box-plot';
import { BoxPlotChart, registerBoxplotChart } from './box-plot';
import type { ICirclePackingChartSpec } from './circle-packing';
import { CirclePackingChart, registerCirclePackingChart } from './circle-packing';
import type { ICommonChartSpec } from './common';
import { CommonChart, registerCommonChart } from './common';
import type { IFunnelChartSpec } from './funnel';
import { FunnelChart, registerFunnelChart, FunnelChartSpecTransformer } from './funnel';
import type { IGaugeChartSpec } from './gauge';
import { GaugeChart, registerGaugeChart } from './gauge';
import type { IHeatmapChartSpec } from './heatmap';
import { HeatmapChart, registerHeatmapChart } from './heatmap';
import type { IHistogramChartSpec } from './histogram';
import { HistogramChartSpecTransformer, HistogramChart, registerHistogramChart } from './histogram';
import type { ILineChartSpec } from './line';
import { LineChart, registerLineChart } from './line';
import type { IMapChartSpec } from './map';
import { MapChart, registerMapChart } from './map';
import type { IPieChartSpec } from './pie';
import { BasePieChart, BasePieChartSpecTransformer, PieChart, registerPieChart } from './pie';
import type { ICircularProgressChartSpec } from './progress/circular';
import { CircularProgressChart, registerCircularProgressChart } from './progress/circular';
import type { ILinearProgressChartSpec } from './progress/linear';
import { LinearProgressChart, registerLinearProgressChart } from './progress/linear';
import type { IRadarChartSpec } from './radar';
import { RadarChart, registerRadarChart } from './radar';
import type { IRangeAreaChartSpec } from './range-area';
import { RangeAreaChart, registerRangeAreaChart } from './range-area';
import type { IRangeColumnChartSpec } from './range-column';
import { RangeColumnChart, registerRangeColumnChart } from './range-column';
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
import type { IWordCloudChartSpec } from './word-cloud';
import { WordCloudChart, registerWordCloudChart, registerWordCloudShapeChart } from './word-cloud';
import { BaseChart } from './base/base-chart';
import type { ICartesianChartSpec } from './cartesian';
import type { IPolarChartSpec } from './polar';
import type { IVennChartSpec } from './venn';
import { VennChart, registerVennChart } from './venn';
import type { IMosaicChartSpec } from './mosaic';
import { MosaicChart, registerMosaicChart } from './mosaic';
import type { IChart } from './interface/chart';
import { BaseWordCloudChart } from './word-cloud/base/base';
import { BaseWordCloudChartSpecTransformer } from './word-cloud/base/word-cloud-base-transformer';
import { BaseHistogramChart } from './histogram/base/base';

export {
  AreaChart,
  BarChart,
  BarChartSpecTransformer,
  BoxPlotChart,
  CirclePackingChart,
  CommonChart,
  FunnelChartSpecTransformer,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  HistogramChartSpecTransformer,
  BaseHistogramChart,
  HistogramChart,
  LineChart,
  MapChart,
  BasePieChartSpecTransformer,
  BasePieChart,
  PieChart,
  CircularProgressChart,
  LinearProgressChart,
  RadarChart,
  RangeColumnChart,
  RangeAreaChart,
  RoseChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  SequenceChart,
  WaterfallChart,
  CorrelationChart,
  LiquidChart,
  BaseWordCloudChartSpecTransformer,
  BaseWordCloudChart,
  WordCloudChart,
  TreemapChart,
  VennChart,
  BaseChart,
  MosaicChart
};

export {
  registerLineChart,
  registerAreaChart,
  registerBarChart,
  registerBoxplotChart,
  registerCirclePackingChart,
  registerCircularProgressChart,
  registerCommonChart,
  registerFunnelChart,
  registerGaugeChart,
  registerHeatmapChart,
  registerHistogramChart,
  registerLinearProgressChart,
  registerMapChart,
  registerPieChart,
  registerRadarChart,
  registerRangeAreaChart,
  registerRangeColumnChart,
  registerRoseChart,
  registerSankeyChart,
  registerScatterChart,
  registerSequenceChart,
  registerSunburstChart,
  registerTreemapChart,
  registerWaterfallChart,
  registerWordCloudChart,
  registerCorrelationChart,
  registerLiquidChart,
  registerWordCloudShapeChart,
  registerVennChart,
  registerMosaicChart
};

export type {
  IChart,
  IAreaChartSpec,
  IBarChartSpec,
  IBoxPlotChartSpec,
  ICirclePackingChartSpec,
  ICommonChartSpec,
  IFunnelChartSpec,
  IGaugeChartSpec,
  IHeatmapChartSpec,
  IHistogramChartSpec,
  ILineChartSpec,
  IMapChartSpec,
  IPieChartSpec,
  ICircularProgressChartSpec,
  ILinearProgressChartSpec,
  IRadarChartSpec,
  IRangeColumnChartSpec,
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
  IWordCloudChartSpec,
  IPolarChartSpec,
  ICartesianChartSpec,
  IVennChartSpec,
  IMosaicChartSpec
};
