import type { ISeriesOption } from '../interface/common';
import type { ITrigger } from '../../interaction/interface';
import type { ISeries } from '../interface/series';
import type { IMark, IMarkProgressiveConfig } from '../../mark/interface';
import type { ILineMark } from '../../mark/line';
import type { ISymbolMark } from '../../mark/symbol';
import type { ITextMark } from '../../mark/text';
import type { DirectionType, IInvalidType, InterpolateType, ILineMarkSpec, ISymbolMarkSpec, Maybe, Datum, IMarkTheme, ILayoutRect } from '../../typings';
import type { ISeriesMarkInfo, ISeriesMarkInitOption, ISeriesTooltipHelper } from '../interface';
import type { ILabelSpec } from '../../component/label';
import { type DimensionEventParams } from '../../event/events/dimension';
import type { ILabelMark } from '../../mark/label';
import type { Functional } from '@visactor/vrender-components';
import type { IRegion } from '../../region/interface';
import type { SeriesData } from '../base/series-data';
export interface ILineLikeSeriesTheme {
    line?: Partial<IMarkTheme<ILineMarkSpec>>;
    point?: Partial<IMarkTheme<ISymbolMarkSpec>> & {
        visibleInActive?: boolean;
    };
    label?: Partial<ILineLikeLabelSpec>;
}
export type ILineLikeLabelSpec = Omit<ILabelSpec, 'position'> & {
    position?: Functional<'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'>;
};
export interface LineLikeSeriesMixin extends ISeries {
    _spec: any;
    _option: ISeriesOption;
    _seriesField: string;
    _theme: Maybe<ILineLikeSeriesTheme>;
    _trigger: ITrigger;
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
    _createMark: (markInfo: ISeriesMarkInfo, option?: ISeriesMarkInitOption) => IMark;
    _getInvalidDefined: () => boolean;
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
}
