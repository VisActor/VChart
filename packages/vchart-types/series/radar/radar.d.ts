import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { Maybe } from '../../typings';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { IRadarSeriesSpec, IRadarSeriesTheme } from './interface';
import { RoseLikeSeries } from '../polar/rose-like';
export interface RadarSeries<T extends IRadarSeriesSpec>
  extends Pick<
      LineLikeSeriesMixin,
      | 'initLineMark'
      | 'initSymbolMark'
      | 'initLabelMarkStyle'
      | 'initLineMarkStyle'
      | 'initSymbolMarkStyle'
      | 'encodeDefined'
      | '_lineMark'
      | '_symbolMark'
    >,
    RoseLikeSeries<T> {}
export declare class RadarSeries<T extends IRadarSeriesSpec = IRadarSeriesSpec> extends RoseLikeSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<IRadarSeriesTheme>;
  private _areaMark;
  protected _sortDataByAxis: boolean;
  initGroups(): void;
  initMark(): void;
  initMarkStyle(): void;
  initAreaMark(progressive: IMarkProgressiveConfig, isSeriesMark: boolean): void;
  initAreaMarkStyle(): void;
  initAnimation(): void;
  getDefaultShapeType(): string;
}
