export * from './charts';
export * from './series';
export * from './components';
export * from './VChart';
export * from './VChartSimple';

// export the version, since @1.8.3
export const version = __VERSION__;

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
  ISunburstChartSpec,
  ITreemapChartSpec,
  IWaterfallChartSpec,
  ICorrelationChartSpec,
  ILiquidChartSpec,
  IWordCloud3dChartSpec,
  IWordCloudChartSpec,
  IPolarChartSpec,
  ICartesianChartSpec,
  ITheme,
  IInitOption,
  ISpec,
  IVChart
} from '@visactor/vchart';

export type { ISequenceChartSpec } from '@visactor/vchart-extension';
