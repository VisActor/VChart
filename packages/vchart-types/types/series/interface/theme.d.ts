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
import type { IRangeAreaSeriesTheme } from '../range-area/interface';
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
export declare enum SeriesTypeForThemeEnum {
    area_horizontal = "area_horizontal",
    area_vertical = "area_vertical",
    line_horizontal = "line_horizontal",
    line_vertical = "line_vertical",
    bar_horizontal = "bar_horizontal",
    bar_vertical = "bar_vertical",
    bar3d_horizontal = "bar3d_horizontal",
    bar3d_vertical = "bar3d_vertical",
    rangeColumn_horizontal = "rangeColumn_horizontal",
    rangeColumn_vertical = "rangeColumn_vertical",
    rangeColumn3d_horizontal = "rangeColumn3d_horizontal",
    rangeColumn3d_vertical = "rangeColumn3d_vertical",
    rangeArea_horizontal = "rangeArea_horizontal",
    rangeArea_vertical = "rangeArea_vertical",
    linearProgress_horizontal = "linearProgress_horizontal",
    linearProgress_vertical = "linearProgress_vertical",
    boxPlot_horizontal = "boxPlot_horizontal",
    boxPlot_vertical = "boxPlot_vertical",
    sankey_horizontal = "sankey_horizontal",
    sankey_vertical = "sankey_vertical",
    waterfall_horizontal = "waterfall_horizontal",
    waterfall_vertical = "waterfall_vertical"
}
export declare const seriesMarkInfoMap: Record<SeriesTypeEnum, SeriesMarkMap>;
