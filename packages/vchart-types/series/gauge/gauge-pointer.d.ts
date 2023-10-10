import { MarkTypeEnum } from '../../mark/interface';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { IGaugePointerSeriesSpec, IGaugePointerSeriesTheme } from './interface';
import type { Datum, Maybe } from '../../typings';
import { ProgressLikeSeries } from '../polar/progress-like';
export declare class GaugePointerSeries<
  T extends IGaugePointerSeriesSpec = IGaugePointerSeriesSpec
> extends ProgressLikeSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<IGaugePointerSeriesTheme>;
  private _pinMark;
  private _pointerMark;
  private _pinBackgroundMark;
  protected _pointerType: MarkTypeEnum;
  setAttrFromSpec(): void;
  initMark(): void;
  initMarkStyle(): void;
  initGroups(): void;
  private initPointerMarkStyle;
  protected _getPointerWidth(): number;
  protected _getPointerHeight(datum: Datum): number;
  protected _getPointerAngle(datum: Datum): number;
  protected _getRotatedPointerCenterOffset(datum: Datum): {
    x: number;
    y: number;
  };
  private initPinBackgroundMarkStyle;
  private initPinMarkStyle;
  initAnimation(): void;
  getDefaultShapeType(): string;
}
