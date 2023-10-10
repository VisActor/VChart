import { CartesianSeries } from '../../cartesian/cartesian';
import type { SeriesMarkMap } from '../../interface';
import { SeriesTypeEnum } from '../../interface/type';
import type { Maybe } from '../../../typings';
import type { ILinearProgressSeriesSpec, ILinearProgressSeriesTheme } from './interface';
export declare class LinearProgressSeries<
  T extends ILinearProgressSeriesSpec = ILinearProgressSeriesSpec
> extends CartesianSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<ILinearProgressSeriesTheme>;
  private _progressMark;
  private _trackMark;
  private _progressGroupMark;
  initMark(): void;
  initMarkStyle(): void;
  private _initProgressMark;
  private _initProgressMarkStyle;
  private _initTrackMark;
  private _initTrackMarkStyle;
  private _initProgressGroupMark;
  private _initProgressGroupMarkStyle;
  initAnimation(): void;
  protected initTooltip(): void;
}
