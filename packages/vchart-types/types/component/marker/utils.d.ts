import type { ICartesianSeries } from '../../series/interface';
import type { DataView } from '@visactor/vdataset';
import type { IPoint } from '../../typings';
export declare function xyLayout(data: DataView, startRelativeSeries: ICartesianSeries, endRelativeSeries: ICartesianSeries, relativeSeries: ICartesianSeries, autoRange: boolean): IPoint[][];
export declare function coordinateLayout(data: DataView, relativeSeries: ICartesianSeries, autoRange: boolean): IPoint[];
