import type { ISeriesOption } from '../interface/common';
import type { ITrigger } from '../../interaction/interface';
import type { ISeries } from '../interface/series';
import type { IMark, IMarkProgressiveConfig } from '../../mark/interface';
import type { ILineMark } from '../../mark/line';
import type { ISymbolMark } from '../../mark/symbol';
import type { ITextMark } from '../../mark/text';
import type {
  DirectionType,
  IInvalidType,
  InterpolateType,
  ILineMarkSpec,
  ISymbolMarkSpec,
  Maybe,
  Datum,
  IMarkTheme
} from '../../typings';
import type { ISeriesMarkInfo, ISeriesMarkInitOption, ISeriesTooltipHelper } from '../interface';
import type { ILabelSpec } from '../../component/label';
import { type DimensionEventParams } from '../../event/events/dimension';
export interface ILineLikeSeriesTheme {
  line?: Partial<IMarkTheme<ILineMarkSpec>>;
  point?: Partial<IMarkTheme<ISymbolMarkSpec>> & {
    visibleInActive?: boolean;
  };
  label?: Partial<ILabelSpec>;
}
export interface LineLikeSeriesMixin extends ISeries {
  _spec: any;
  _option: ISeriesOption;
  _seriesField: string;
  _theme: Maybe<ILineLikeSeriesTheme>;
  _trigger: ITrigger;
  _tooltipHelper: ISeriesTooltipHelper;
  _invalidType: IInvalidType;
  _lineMark: ILineMark;
  _symbolMark: ISymbolMark;
  _symbolActiveMark: ISymbolMark;
  _labelMark: ITextMark;
  _fieldZ?: string[];
  _createMark: (markInfo: ISeriesMarkInfo, option?: ISeriesMarkInitOption) => IMark;
  _getInvalidDefined: () => boolean;
  _getInvalidConnectType: () => IInvalidType;
}
export declare class LineLikeSeriesMixin {
  initLineMark(progressive?: IMarkProgressiveConfig, isSeriesMark?: boolean): ILineMark;
  initLineMarkStyle(direction?: DirectionType, areaCurveType?: InterpolateType): ILineMark;
  protected _getEventElement(params: DimensionEventParams, reverse?: boolean): Datum[];
  protected _dimensionTrigger(params: DimensionEventParams): void;
  initSymbolMark(progressive?: IMarkProgressiveConfig, isSeriesMark?: boolean): ISymbolMark;
  initSymbolMarkStyle(): ISymbolMark;
  initLabelMarkStyle(labelMark?: ITextMark): void;
  encodeDefined(mark: IMark, attr: string): void;
}
