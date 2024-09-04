import type { TooltipHandlerParams } from '../../component/tooltip/interface';
import type { ITooltipPattern, ShapeType, TooltipActiveType } from '../../typings';
import type { ISeries, ISeriesTooltipHelper } from '../interface';
import { BaseTooltipHelper } from '../../model/tooltip-helper';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
import type { Datum } from '@visactor/vgrammar-core';
interface ISeriesCacheInfo {
    seriesFields: string[];
    dimensionFields: string[];
    measureFields: string[];
    type: string;
}
export declare class BaseSeriesTooltipHelper extends BaseTooltipHelper implements ISeriesTooltipHelper {
    series: ISeries;
    protected _seriesCacheInfo: ISeriesCacheInfo;
    constructor(series: ISeries);
    updateTooltipSpec(): void;
    protected _getSeriesCacheInfo: () => ISeriesCacheInfo;
    protected _getDimensionData: (datum: any) => any;
    protected _getMeasureData: (datum: any) => any;
    protected _getSeriesFieldData: (datum: any) => any;
    protected _getSeriesStyle: (datum: any, styleKey: string | string[], defaultValue?: any) => any;
    markTooltipKeyCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    markTooltipValueCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    shapeTypeCallback: (datum: Datum, params?: TooltipHandlerParams) => ShapeType | undefined;
    shapeColorCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    shapeStrokeCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    dimensionTooltipTitleCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    groupTooltipTitleCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    groupTooltipKeyCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null;
}
export {};
