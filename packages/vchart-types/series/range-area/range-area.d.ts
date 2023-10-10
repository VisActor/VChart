import type { DataView } from '@visactor/vdataset';
import { AreaSeries } from '../area/area';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface';
import type { IAreaSeriesSpec } from '../area/interface';
export declare class RangeAreaSeries<T extends IAreaSeriesSpec = IAreaSeriesSpec> extends AreaSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  initMark(): void;
  initMarkStyle(): void;
  protected initTooltip(): void;
  viewDataStatisticsUpdate(d: DataView): void;
}
