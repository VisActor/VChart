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
import { rangeColumn3dSeriesMark, rangeColumnSeriesMark } from '../range-column/constant';
import { circlePackingSeriesMark } from '../circle-packing/constant';
import { heatmapSeriesMark } from '../heatmap/constant';
import { correlationSeriesMark } from '../correlation/constant';
import { rangeAreaSeriesMark } from '../range-area/constant';
import type { IRangeAreaSeriesTheme } from '../range-area/interface';
import { baseSeriesMark } from '../base/constant';

export interface ISeriesTheme {
  [SeriesTypeEnum.bar]?: IBarSeriesTheme;
  [SeriesTypeForThemeEnum.bar_vertical]?: IBarSeriesTheme;
  [SeriesTypeForThemeEnum.bar_horizontal]?: IBarSeriesTheme;

  [SeriesTypeEnum.bar3d]?: IBar3dSeriesTheme;
  [SeriesTypeForThemeEnum.bar3d_vertical]?: IBar3dSeriesTheme;
  [SeriesTypeForThemeEnum.bar3d_horizontal]?: IBar3dSeriesTheme;

  [SeriesTypeEnum.line]?: ILineSeriesTheme;
  [SeriesTypeForThemeEnum.line_vertical]?: ILineSeriesTheme;
  [SeriesTypeForThemeEnum.line_horizontal]?: ILineSeriesTheme;

  [SeriesTypeEnum.area]?: IAreaSeriesTheme;
  [SeriesTypeForThemeEnum.area_vertical]?: IAreaSeriesTheme;
  [SeriesTypeForThemeEnum.area_horizontal]?: IAreaSeriesTheme;

  [SeriesTypeEnum.rangeColumn]?: IRangeColumnSeriesTheme;
  [SeriesTypeForThemeEnum.rangeColumn_vertical]?: IRangeColumnSeriesTheme;
  [SeriesTypeForThemeEnum.rangeColumn_horizontal]?: IRangeColumnSeriesTheme;

  [SeriesTypeEnum.rangeArea]?: IRangeAreaSeriesTheme;
  [SeriesTypeForThemeEnum.rangeArea_vertical]?: IRangeAreaSeriesTheme;
  [SeriesTypeForThemeEnum.rangeArea_horizontal]?: IRangeAreaSeriesTheme;

  [SeriesTypeEnum.linearProgress]?: ILinearProgressSeriesTheme;
  [SeriesTypeForThemeEnum.linearProgress_vertical]?: ILinearProgressSeriesTheme;
  [SeriesTypeForThemeEnum.linearProgress_horizontal]?: ILinearProgressSeriesTheme;

  [SeriesTypeEnum.boxPlot]?: IBoxPlotSeriesTheme;
  [SeriesTypeForThemeEnum.boxPlot_vertical]?: IBoxPlotSeriesTheme;
  [SeriesTypeForThemeEnum.boxPlot_horizontal]?: IBoxPlotSeriesTheme;

  [SeriesTypeEnum.sankey]?: ISankeySeriesTheme;
  [SeriesTypeForThemeEnum.sankey_vertical]?: ISankeySeriesTheme;
  [SeriesTypeForThemeEnum.sankey_horizontal]?: ISankeySeriesTheme;

  [SeriesTypeEnum.waterfall]?: IWaterfallSeriesTheme;
  [SeriesTypeForThemeEnum.waterfall_vertical]?: IWaterfallSeriesTheme;
  [SeriesTypeForThemeEnum.waterfall_horizontal]?: IWaterfallSeriesTheme;

  [SeriesTypeEnum.scatter]?: IScatterSeriesTheme;
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
  [SeriesTypeEnum.treemap]?: ITreemapSeriesTheme;
  [SeriesTypeEnum.gauge]?: IGaugeSeriesTheme;
  [SeriesTypeEnum.gaugePointer]?: IGaugePointerSeriesTheme;
  [SeriesTypeEnum.sunburst]?: ISunburstSeriesTheme;
  [SeriesTypeEnum.circlePacking]?: ICirclePackingSeriesTheme;
  [SeriesTypeEnum.heatmap]?: IHeatmapSeriesTheme;
  [SeriesTypeEnum.correlation]?: ICorrelationSeriesTheme;
}

/** 带有方向信息的系列类型，作为主题相关的补充类型 */
export enum SeriesTypeForThemeEnum {
  area_horizontal = 'area_horizontal',
  area_vertical = 'area_vertical',

  line_horizontal = 'line_horizontal',
  line_vertical = 'line_vertical',

  bar_horizontal = 'bar_horizontal',
  bar_vertical = 'bar_vertical',

  bar3d_horizontal = 'bar3d_horizontal',
  bar3d_vertical = 'bar3d_vertical',

  rangeColumn_horizontal = 'rangeColumn_horizontal',
  rangeColumn_vertical = 'rangeColumn_vertical',

  rangeColumn3d_horizontal = 'rangeColumn3d_horizontal',
  rangeColumn3d_vertical = 'rangeColumn3d_vertical',

  rangeArea_horizontal = 'rangeArea_horizontal',
  rangeArea_vertical = 'rangeArea_vertical',

  linearProgress_horizontal = 'linearProgress_horizontal',
  linearProgress_vertical = 'linearProgress_vertical',

  boxPlot_horizontal = 'boxPlot_horizontal',
  boxPlot_vertical = 'boxPlot_vertical',

  sankey_horizontal = 'sankey_horizontal',
  sankey_vertical = 'sankey_vertical',

  waterfall_horizontal = 'waterfall_horizontal',
  waterfall_vertical = 'waterfall_vertical'
}

export const seriesMarkInfoMap: Record<SeriesTypeEnum, SeriesMarkMap> = {
  [SeriesTypeEnum.bar]: barSeriesMark,
  [SeriesTypeEnum.bar3d]: bar3dSeriesMark,
  [SeriesTypeEnum.line]: lineSeriesMark,
  [SeriesTypeEnum.scatter]: scatterSeriesMark,
  [SeriesTypeEnum.area]: areaSeriesMark,
  [SeriesTypeEnum.radar]: radarSeriesMark,
  [SeriesTypeEnum.pie]: pieSeriesMark,
  [SeriesTypeEnum.pie3d]: pie3dSeriesMark,
  [SeriesTypeEnum.rose]: roseSeriesMark,
  [SeriesTypeEnum.geo]: baseSeriesMark,
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
  [SeriesTypeEnum.rangeColumn3d]: rangeColumn3dSeriesMark,
  [SeriesTypeEnum.circlePacking]: circlePackingSeriesMark,
  [SeriesTypeEnum.heatmap]: heatmapSeriesMark,
  [SeriesTypeEnum.correlation]: correlationSeriesMark,
  [SeriesTypeEnum.rangeArea]: rangeAreaSeriesMark
};
