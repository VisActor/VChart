import type { ILineSeriesSpec } from '../../series/line/interface';
import type { IAreaSeriesSpec } from '../../series/area/interface';
import type { IChartSpec } from '../../typings/spec/common';
import type { IBar3dSeriesSpec, IBarSeriesSpec } from '../../series/bar/interface';
import type { IRangeColumnChartSpec } from '../range-column';
import type { IRangeAreaChartSpec } from '../range-area';
import type { IDotSeriesSpec } from '../../series/dot/interface';
import type { IMapSeriesSpec } from '../../series/map/interface';
import type { IPie3dSeriesSpec, IPieSeriesSpec } from '../../series/pie/interface';
import type { ILinkSeriesSpec } from '../../series/link/interface';
import type { IRadarSeriesSpec } from '../../series/radar/interface';
import type { IRoseSeriesSpec } from '../../series/rose/interface';
import type { IScatterSeriesSpec } from '../../series/scatter/interface';
import type { IWordCloud3dSeriesSpec, IWordCloudSeriesSpec } from '../../series/word-cloud/interface';
import type { IGaugePointerSeriesSpec, IGaugeSeriesSpec } from '../../series/gauge';
import type { IBoxPlotSeriesSpec } from '../../series/box-plot/interface';
import type { ICirclePackingSeriesSpec } from '../../series/circle-packing/interface';
import type { IFunnelSeriesSpec, IFunnel3dSeriesSpec } from '../../series/funnel/interface';
import type { IHeatmapSeriesSpec } from '../../series/heatmap/interface';
import type { ICircularProgressSeriesSpec } from '../../series/progress/circular/interface';
import type { ILinearProgressSeriesSpec } from '../../series/progress/linear/interface';
import type { ISankeySeriesSpec } from '../../series/sankey/interface';
import type { ISunburstSeriesSpec } from '../../series/sunburst/interface';
import type { ITreemapSeriesSpec } from '../../series/treemap/interface';
import type { IWaterfallSeriesSpec } from '../../series/waterfall/interface';
import type { ICorrelationSeriesSpec } from '../../series/correlation/interface';
import type { ICartesianAxisSpec, IPolarAxisSpec } from '../../component';
import type { ICartesianCrosshairSpec, IPolarCrosshairSpec } from '../../component/crosshair/interface';
import type { IMarkLineSpec } from '../../component/marker/mark-line/interface';
import type { IMarkAreaSpec } from '../../component/marker/mark-area/interface';
import type { IMarkPointSpec } from '../../component/marker/mark-point/interface';
export interface ICommonChartSpec extends Omit<IChartSpec, 'series'> {
  type: 'common';
  seriesField?: string;
  series?: (
    | IAreaSeriesSpec
    | ILineSeriesSpec
    | IBar3dSeriesSpec
    | IBarSeriesSpec
    | IRangeColumnChartSpec
    | IRangeAreaChartSpec
    | IDotSeriesSpec
    | IMapSeriesSpec
    | IPie3dSeriesSpec
    | IPieSeriesSpec
    | ILinkSeriesSpec
    | IRadarSeriesSpec
    | IRoseSeriesSpec
    | IScatterSeriesSpec
    | ICircularProgressSeriesSpec
    | ILinearProgressSeriesSpec
    | IWordCloudSeriesSpec
    | IWordCloud3dSeriesSpec
    | IFunnelSeriesSpec
    | IFunnel3dSeriesSpec
    | IBoxPlotSeriesSpec
    | IGaugeSeriesSpec
    | ISankeySeriesSpec
    | ITreemapSeriesSpec
    | ISunburstSeriesSpec
    | ICirclePackingSeriesSpec
    | IWaterfallSeriesSpec
    | IHeatmapSeriesSpec
    | IGaugePointerSeriesSpec
    | ICorrelationSeriesSpec
  )[];
  axes?: ICartesianAxisSpec[] | IPolarAxisSpec[];
  crosshair?: ICartesianCrosshairSpec | ICartesianCrosshairSpec[] | IPolarCrosshairSpec | IPolarCrosshairSpec[];
  markLine?: IMarkLineSpec;
  markArea?: IMarkAreaSpec;
  markPoint?: IMarkPointSpec;
}
