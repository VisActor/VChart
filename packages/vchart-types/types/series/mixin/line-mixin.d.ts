import type { ISeriesOption } from '../interface/common';
import type { ISeries } from '../interface/series';
import type { ICompileMarkConfig, IMark, IMarkProgressiveConfig, ILabelMark, ILineMark, ISymbolMark, ITextMark } from '../../mark/interface';
import type { DirectionType, IInvalidType, InterpolateType, Maybe, Datum, ILayoutRect } from '../../typings';
import type { ISeriesMarkInfo, ISeriesMarkInitOption, ISeriesTooltipHelper } from '../interface';
import type { DimensionEventParams } from '../../event/events/dimension';
import type { IRegion } from '../../region/interface';
import type { SeriesData } from '../base/series-data';
import type { ILineLikeSeriesTheme } from './interface';
export interface LineLikeSeriesMixin extends ISeries {
    _spec: any;
    _option: ISeriesOption;
    _seriesField: string;
    _theme: Maybe<ILineLikeSeriesTheme>;
    _tooltipHelper: ISeriesTooltipHelper;
    _invalidType: IInvalidType;
    _region: IRegion;
    _direction: DirectionType;
    _data: SeriesData;
    _lineMark: ILineMark;
    _symbolMark: ISymbolMark;
    _symbolActiveMark: ISymbolMark;
    _labelMark: ITextMark;
    _fieldX?: string[];
    _fieldY?: string[];
    _fieldZ?: string[];
    _createMark: (markInfo: ISeriesMarkInfo, option?: ISeriesMarkInitOption, config?: ICompileMarkConfig) => IMark;
    _getInvalidDefined: (datum: Datum) => boolean;
    _getInvalidConnectType: () => IInvalidType;
    getLayoutRect: () => ILayoutRect;
}
export declare class LineLikeSeriesMixin {
    addSamplingCompile(): void;
    addOverlapCompile(): void;
    reCompileSampling(): void;
    initLineMark(progressive?: IMarkProgressiveConfig, isSeriesMark?: boolean): ILineMark;
    initLineMarkStyle(direction?: DirectionType, areaCurveType?: InterpolateType): ILineMark;
    protected _getEventElement(params: DimensionEventParams, reverse?: boolean): Datum[];
    protected _dimensionTrigger(params: DimensionEventParams): void;
    initSymbolMark(progressive?: IMarkProgressiveConfig, isSeriesMark?: boolean): ISymbolMark;
    initSymbolMarkStyle(): ISymbolMark;
    private _initSymbolMark;
    private _initSymbolActiveMarkAlone;
    initLabelMarkStyle(labelMark?: ILabelMark): void;
    initLineLabelMarkStyle(labelMark?: ILabelMark): void;
    encodeDefined(mark: IMark, attr: string): void;
    protected _isFieldAllValid(): any;
}
