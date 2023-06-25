/* eslint-disable no-duplicate-imports */
/**
 * @description export all mark modules
 */
import { WaterfallSeries } from '../series/waterfall/waterfall';
import type { IWaterfallSeriesSpec } from '../series/waterfall/interface';
import { BoxPlotSeries } from '../series/box-plot/box-plot';
import type { IBoxPlotSeriesSpec } from '../series/box-plot/interface';
import { LineSeries } from '../series/line/line';
import type { ILineSeriesSpec } from '../series/line/interface';
import { Bar3dSeries, BarSeries } from '../series/bar/bar';
import type { IBar3dSeriesSpec, IBarSeriesSpec } from '../series/bar/interface';
import { RangeColumn3dSeries, RangeColumnSeries } from '../series/range-column/rangeColumn';
import type { IRangeColumn3dSeriesSpec, IRangeColumnSeriesSpec } from '../series/range-column/interface';
import { RangeAreaSeries } from '../series/range-area/range-area';
import type { IRangeAreaSeriesSpec } from '../series/range-area/interface';
import { MapSeries } from '../series/map/map';
import type { IMapSeriesSpec } from '../series/map/interface';
import { Pie3dSeries, PieSeries } from '../series/pie/pie';
import type { IPie3dSeriesSpec } from '../series/pie/interface';
import type { IPieSeriesSpec } from '../series/pie/interface';
import { ScatterSeries } from '../series/scatter/scatter';
import type { IScatterSeriesSpec } from '../series/scatter/interface';
import { RoseSeries } from '../series/rose/rose';
import type { IRoseSeriesSpec } from '../series/rose/interface';
import { RadarSeries } from '../series/radar/radar';
import type { IRadarSeriesSpec } from '../series/radar/interface';
import { AreaSeries } from '../series/area/area';
import type { IAreaSeriesSpec } from '../series/area/interface';
import { DotSeries } from '../series/dot/dot';
import type { IDotSeriesSpec } from '../series/dot/interface';
import { LinkSeries } from '../series/link/link';
import type { ILinkSeriesSpec } from '../series/link/interface';
import { CircularProgressSeries } from '../series/progress/circular/circular';
import type { ICircularProgressSeriesSpec } from '../series/progress/circular/interface';
import { LinearProgressSeries } from '../series/progress/linear/linear';
import type { ILinearProgressSeriesSpec } from '../series/progress/linear/interface';
import { WordCloud3dSeries, WordCloudSeries } from '../series/word-cloud/word-cloud';
import type { IWordCloud3dSeriesSpec, IWordCloudSeriesSpec } from '../series/word-cloud/interface';
import { Funnel3dSeries, FunnelSeries } from '../series/funnel/funnel';
import type { IFunnel3dSeriesSpec, IFunnelSeriesSpec } from '../series/funnel/interface';
import { SunburstSeries } from '../series/sunburst/sunburst';
import type { ISunburstSeriesSpec } from '../series/sunburst/interface';
import { CirclePackingSeries } from '../series/circle-packing/circle-packing';
import type { ICirclePackingSeriesSpec } from '../series/circle-packing/interface';
import { SankeySeries } from '../series/sankey/sankey';
import type { ISankeySeriesSpec } from '../series/sankey/interface';
import { TreeMapSeries } from '../series/treemap/treemap';
import type { ITreemapSeriesSpec } from '../series/treemap/interface';
import type { IGaugePointerSeriesSpec, IGaugeSeriesSpec } from '../series/gauge';
import { GaugePointerSeries, GaugeSeries } from '../series/gauge';
import { HeatmapSeries } from '../series/heatmap/heatmap';
import type { IHeatmapSeriesSpec } from '../series/heatmap/interface';
import { BaseSeries } from '../series/base/base-series';
import type { ICartesianSeriesSpec } from '../series/cartesian';
import { CartesianSeries } from '../series/cartesian';
import { PolarSeries } from '../series/polar/polar';
import type { IPolarSeriesSpec } from '../series/polar/interface';
import type { IProgressLikeSeriesSpec } from '../series/polar/progress-like';
import { ProgressLikeSeries } from '../series/polar/progress-like';
import type { IRoseLikeSeriesSpec } from '../series/polar/rose-like';
import { RoseLikeSeries } from '../series/polar/rose-like';

import type { ISeries } from '../series/interface';

export {
  WaterfallSeries,
  Bar3dSeries,
  BarSeries,
  BoxPlotSeries,
  LineSeries,
  RadarSeries,
  RangeAreaSeries,
  RangeColumn3dSeries,
  RangeColumnSeries,
  MapSeries,
  Pie3dSeries,
  PieSeries,
  SankeySeries,
  ScatterSeries,
  SunburstSeries,
  RoseLikeSeries,
  RoseSeries,
  AreaSeries,
  DotSeries,
  LinearProgressSeries,
  LinkSeries,
  CirclePackingSeries,
  CircularProgressSeries,
  WordCloud3dSeries,
  WordCloudSeries,
  Funnel3dSeries,
  FunnelSeries,
  TreeMapSeries,
  GaugePointerSeries,
  GaugeSeries,
  HeatmapSeries,
  BaseSeries,
  CartesianSeries,
  PolarSeries,
  ProgressLikeSeries
};

export type {
  ISeries,
  IRoseLikeSeriesSpec,
  IAreaSeriesSpec,
  IBar3dSeriesSpec,
  IBarSeriesSpec,
  IBoxPlotSeriesSpec,
  ICartesianSeriesSpec,
  ICirclePackingSeriesSpec,
  ICircularProgressSeriesSpec,
  IDotSeriesSpec,
  IFunnel3dSeriesSpec,
  IFunnelSeriesSpec,
  IGaugePointerSeriesSpec,
  IGaugeSeriesSpec,
  IHeatmapSeriesSpec,
  ILineSeriesSpec,
  ILinearProgressSeriesSpec,
  ILinkSeriesSpec,
  IMapSeriesSpec,
  IPie3dSeriesSpec,
  IPieSeriesSpec,
  IPolarSeriesSpec,
  IProgressLikeSeriesSpec,
  IRadarSeriesSpec,
  IRangeAreaSeriesSpec,
  IRangeColumn3dSeriesSpec,
  IRangeColumnSeriesSpec,
  IRoseSeriesSpec,
  ISankeySeriesSpec,
  IScatterSeriesSpec,
  ISunburstSeriesSpec,
  ITreemapSeriesSpec,
  IWaterfallSeriesSpec,
  IWordCloud3dSeriesSpec,
  IWordCloudSeriesSpec
};
