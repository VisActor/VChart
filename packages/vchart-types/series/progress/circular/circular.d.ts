import type { Maybe, Datum } from '../../../typings';
import type { SeriesMarkMap } from '../../interface';
import { SeriesTypeEnum } from '../../interface/type';
import type { ICircularProgressSeriesSpec, ICircularProgressSeriesTheme } from './interface';
import { ProgressLikeSeries } from '../../polar/progress-like/progress-like';
export declare class CircularProgressSeries<
  T extends ICircularProgressSeriesSpec = ICircularProgressSeriesSpec
> extends ProgressLikeSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<ICircularProgressSeriesTheme>;
  private _progressMark;
  private _trackMark;
  getStackGroupFields(): string[];
  getGroupFields(): string[];
  initMark(): void;
  initMarkStyle(): void;
  private _initProgressMark;
  private _initProgressMarkStyle;
  private _initTrackMark;
  private _initTrackMarkStyle;
  protected _getRadiusValueStart: (datum: Datum) => number;
  protected _getRadiusValueEnd: (datum: Datum) => number;
  initAnimation(): void;
}
