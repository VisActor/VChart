import type { TooltipHandlerParams } from '../../component/tooltip/interface';
import type { IToolTipLinePattern, ITooltipPattern, ShapeType, TooltipActiveType } from '../../typings';
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
    protected _getSeriesStyle: (datum: any, styleKey: string | string[], defaultValue?: any) => any;
    contentKeyCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    contentValueCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    contentShapeTypeCallback: (datum: Datum, params?: TooltipHandlerParams) => ShapeType | undefined;
    contentShapeColorCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    titleValueCallback: (datum: Datum, params?: TooltipHandlerParams) => string | undefined;
    getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null;
}
export declare const addExtraInfoToTooltipTitlePattern: <T>(pattern: ITooltipPattern['title'], extraInfo: T | ((line: IToolTipLinePattern) => T), overwrite?: boolean) => ITooltipPattern['title'] | undefined;
export declare const addExtraInfoToTooltipContentPattern: <T>(pattern: ITooltipPattern['content'], extraInfo: T | ((line: IToolTipLinePattern) => T), overwrite?: boolean) => ITooltipPattern['content'] | undefined;
export {};
