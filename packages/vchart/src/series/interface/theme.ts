import type { IWaterfallSeriesTheme } from '../waterfall/interface';
import type { IBoxPlotSeriesTheme } from '../box-plot/interface';
import type { IBar3dSeriesTheme, IBarSeriesTheme } from '../bar/interface';
import type { ILineSeriesTheme } from '../line/interface';
import type { IScatterSeriesTheme } from '../scatter/interface';
import type { IAreaSeriesTheme } from '../area/interface';
import type { IRadarSeriesTheme } from '../radar/interface';
import type { IPie3dSeriesTheme, IPieSeriesTheme } from '../pie/interface';
import type { IRoseSeriesTheme } from '../rose/interface';
import type { IMapSeriesTheme } from '../map/interface';
import type { ICircularProgressSeriesTheme } from '../progress/circular/interface';
import type { ILinkSeriesTheme } from '../link/interface';
import type { IDotSeriesTheme } from '../dot/interface';
import type { IWordCloud3dSeriesTheme, IWordCloudSeriesTheme } from '../word-cloud/interface';
import type { IFunnel3dSeriesTheme, IFunnelSeriesTheme } from '../funnel/interface';
import type { ILinearProgressSeriesTheme } from '../progress/linear/interface';
import type { IGaugePointerSeriesTheme, IGaugeSeriesTheme } from '../gauge';
import type { ISankeySeriesTheme } from '../sankey/interface';
import type { ITreemapSeriesTheme } from '../treemap/interface';
import type { ISunburstSeriesTheme } from '../sunburst/interface';
import type { IRangeColumnSeriesTheme } from '../range-column/interface';
import type { ICirclePackingSeriesTheme } from '../circle-packing/interface';
import type { IHeatmapSeriesTheme } from '../heatmap/interface';
import type { ICorrelationSeriesTheme } from '../correlation/interface';
import { SeriesTypeEnum } from './type';
import type { SeriesMarkMap } from './common';
import { bar3dSeriesMark, barSeriesMark } from '../bar/constant';
import { lineSeriesMark } from '../line/constant';
import { scatterSeriesMark } from '../scatter/constant';
import { areaSeriesMark } from '../area/constant';
import { radarSeriesMark } from '../radar/constant';
import { pie3dSeriesMark, pieSeriesMark } from '../pie/constant';
import { roseSeriesMark } from '../rose/constant';
import { mapSeriesMark } from '../map/constant';
import { circularProgressSeriesMark } from '../progress/circular/constant';
import { linkSeriesMark } from '../link/constant';
import { dotSeriesMark } from '../dot/constant';
import { wordCloudSeriesMark } from '../word-cloud/constant';
import { funnel3dSeriesMark, funnelSeriesMark } from '../funnel/constant';
import { linearProgressSeriesMark } from '../progress/linear/constant';
import { waterfallSeriesMark } from '../waterfall/constant';
import { boxPlotSeriesMark } from '../box-plot/constant';
import { treemapSeriesMark } from '../treemap/constant';
import { sankeySeriesMark } from '../sankey/constant';
import { gaugePointerSeriesMark, gaugeSeriesMark } from '../gauge/constant';
import { sunburstSeriesMark } from '../sunburst/constant';
import { rangeColumnSeriesMark } from '../range-column/constant';
import { circlePackingSeriesMark } from '../circle-packing/constant';
import { heatmapSeriesMark } from '../heatmap/constant';
import { correlationSeriesMark } from '../correlation/constant';
import { rangeAreaSeriesMark } from '../range-area/constant';
import type { IRangeAreaSeriesTheme } from '../range-area/interface';

export interface ISeriesTheme {
  [SeriesTypeEnum.bar]?: IBarSeriesTheme;
  [SeriesTypeEnum.bar3d]?: IBar3dSeriesTheme;
  [SeriesTypeEnum.line]?: ILineSeriesTheme;
  [SeriesTypeEnum.scatter]?: IScatterSeriesTheme;
  [SeriesTypeEnum.area]?: IAreaSeriesTheme;
  [SeriesTypeEnum.radar]?: IRadarSeriesTheme;
  [SeriesTypeEnum.pie]?: IPieSeriesTheme;
  [SeriesTypeEnum.pie3d]?: IPie3dSeriesTheme;
  [SeriesTypeEnum.rose]?: IRoseSeriesTheme;
  [SeriesTypeEnum.map]?: IMapSeriesTheme;
  [SeriesTypeEnum.circularProgress]?: ICircularProgressSeriesTheme;
  [SeriesTypeEnum.link]?: ILinkSeriesTheme;
  [SeriesTypeEnum.dot]?: IDotSeriesTheme;
  [SeriesTypeEnum.wordCloud]?: IWordCloudSeriesTheme;
  [SeriesTypeEnum.wordCloud3d]?: IWordCloud3dSeriesTheme;
  [SeriesTypeEnum.funnel]?: IFunnelSeriesTheme;
  [SeriesTypeEnum.funnel3d]?: IFunnel3dSeriesTheme;
  [SeriesTypeEnum.linearProgress]?: ILinearProgressSeriesTheme;
  [SeriesTypeEnum.waterfall]?: IWaterfallSeriesTheme;
  [SeriesTypeEnum.boxPlot]?: IBoxPlotSeriesTheme;
  [SeriesTypeEnum.treemap]?: ITreemapSeriesTheme;
  [SeriesTypeEnum.sankey]?: ISankeySeriesTheme;
  [SeriesTypeEnum.gauge]?: IGaugeSeriesTheme;
  [SeriesTypeEnum.gaugePointer]?: IGaugePointerSeriesTheme;
  [SeriesTypeEnum.sunburst]?: ISunburstSeriesTheme;
  [SeriesTypeEnum.rangeColumn]?: IRangeColumnSeriesTheme;
  [SeriesTypeEnum.circlePacking]?: ICirclePackingSeriesTheme;
  [SeriesTypeEnum.heatmap]?: IHeatmapSeriesTheme;
  [SeriesTypeEnum.correlation]?: ICorrelationSeriesTheme;
  [SeriesTypeEnum.rangeArea]?: IRangeAreaSeriesTheme;
}

export const seriesMarkInfoMap: Record<keyof ISeriesTheme, SeriesMarkMap> = {
  [SeriesTypeEnum.bar]: barSeriesMark,
  [SeriesTypeEnum.bar3d]: bar3dSeriesMark,
  [SeriesTypeEnum.line]: lineSeriesMark,
  [SeriesTypeEnum.scatter]: scatterSeriesMark,
  [SeriesTypeEnum.area]: areaSeriesMark,
  [SeriesTypeEnum.radar]: radarSeriesMark,
  [SeriesTypeEnum.pie]: pieSeriesMark,
  [SeriesTypeEnum.pie3d]: pie3dSeriesMark,
  [SeriesTypeEnum.rose]: roseSeriesMark,
  [SeriesTypeEnum.map]: mapSeriesMark,
  [SeriesTypeEnum.circularProgress]: circularProgressSeriesMark,
  [SeriesTypeEnum.link]: linkSeriesMark,
  [SeriesTypeEnum.dot]: dotSeriesMark,
  [SeriesTypeEnum.wordCloud]: wordCloudSeriesMark,
  [SeriesTypeEnum.wordCloud3d]: wordCloudSeriesMark,
  [SeriesTypeEnum.funnel]: funnelSeriesMark,
  [SeriesTypeEnum.funnel3d]: funnel3dSeriesMark,
  [SeriesTypeEnum.linearProgress]: linearProgressSeriesMark,
  [SeriesTypeEnum.waterfall]: waterfallSeriesMark,
  [SeriesTypeEnum.boxPlot]: boxPlotSeriesMark,
  [SeriesTypeEnum.treemap]: treemapSeriesMark,
  [SeriesTypeEnum.sankey]: sankeySeriesMark,
  [SeriesTypeEnum.gauge]: gaugeSeriesMark,
  [SeriesTypeEnum.gaugePointer]: gaugePointerSeriesMark,
  [SeriesTypeEnum.sunburst]: sunburstSeriesMark,
  [SeriesTypeEnum.rangeColumn]: rangeColumnSeriesMark,
  [SeriesTypeEnum.circlePacking]: circlePackingSeriesMark,
  [SeriesTypeEnum.heatmap]: heatmapSeriesMark,
  [SeriesTypeEnum.correlation]: correlationSeriesMark,
  [SeriesTypeEnum.rangeArea]: rangeAreaSeriesMark
};
