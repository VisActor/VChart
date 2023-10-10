import type { DataView } from '@visactor/vdataset';
import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import type { IAreaMark } from '../../mark/area';
import { CartesianSeries } from '../cartesian/cartesian';
import type { Maybe } from '../../typings';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface';
import type { IAreaSeriesSpec, IAreaSeriesTheme } from './interface';
export interface AreaSeries<T extends IAreaSeriesSpec = IAreaSeriesSpec>
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
    CartesianSeries<T> {}
export declare class AreaSeries<T extends IAreaSeriesSpec = IAreaSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<IAreaSeriesTheme>;
  protected _areaMark: IAreaMark;
  protected _stack: boolean;
  protected _sortDataByAxis: boolean;
  setAttrFromSpec(): void;
  initMark(): void;
  initMarkStyle(): void;
  initAnimation(): void;
  protected initTooltip(): void;
  viewDataStatisticsUpdate(d: DataView): void;
  getDefaultShapeType(): string;
}
