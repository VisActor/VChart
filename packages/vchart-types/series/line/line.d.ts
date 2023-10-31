import { CartesianSeries } from '../cartesian/cartesian';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface';
import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import type { Datum, Maybe } from '../../typings';
import type { ILineSeriesSpec, ILineSeriesTheme } from './interface';
import type { IMark } from '../../mark/interface';
export interface LineSeries<T extends ILineSeriesSpec = ILineSeriesSpec>
  extends Pick<
      LineLikeSeriesMixin,
      | 'initLineMark'
      | 'initSymbolMark'
      | 'initLabelMarkStyle'
      | 'initLineMarkStyle'
      | 'initSymbolMarkStyle'
      | '_lineMark'
      | '_symbolMark'
    >,
    CartesianSeries<T> {}
export declare class LineSeries<T extends ILineSeriesSpec = ILineSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<ILineSeriesTheme>;
  protected _sortDataByAxis: boolean;
  initMark(): void;
  protected initTooltip(): void;
  initMarkStyle(): void;
  initAnimation(): void;
  getSeriesStyle(datum: Datum): (attribute: string) => unknown;
  getDefaultShapeType(): string;
  getActiveMarks(): IMark[];
}
export declare const registerLineSeries: () => void;
