import type { ICartesianSeries } from '../../series/interface';
import type { DataView } from '@visactor/vdataset';
import type { IPointLike } from '@visactor/vutils';
export declare function xLayout(
  data: DataView,
  startRelativeSeries: ICartesianSeries,
  endRelativeSeries: ICartesianSeries,
  relativeSeries: ICartesianSeries,
  autoRange: boolean
): [IPointLike, IPointLike][];
export declare function yLayout(
  data: DataView,
  startRelativeSeries: ICartesianSeries,
  endRelativeSeries: ICartesianSeries,
  relativeSeries: ICartesianSeries,
  autoRange: boolean
): [IPointLike, IPointLike][];
export declare function coordinateLayout(
  data: DataView,
  relativeSeries: ICartesianSeries,
  autoRange: boolean
): IPointLike[];
