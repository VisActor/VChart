import type { ICartesianSeries, ISeries } from '../../series/interface';
import type { DataView } from '@visactor/vdataset';
import type { IPoint } from '../../typings';
import type { IDataPos, MarkerPositionPoint } from './interface';
import type { IRegion } from '../../region/interface';
import type { OffsetPoint } from './interface';
export declare function isAggrSpec(spec: IDataPos): boolean;
export declare function xyLayout(data: DataView, startRelativeSeries: ICartesianSeries, endRelativeSeries: ICartesianSeries, relativeSeries: ICartesianSeries, autoRange: boolean): IPoint[][];
export declare function coordinateLayout(data: DataView, relativeSeries: ICartesianSeries, autoRange: boolean, coordinatesOffset: OffsetPoint[] | OffsetPoint): IPoint[];
export declare function positionLayout(positions: MarkerPositionPoint[], series: ISeries, regionRelative: boolean): IPoint[];
export declare function computeClipRange(regions: IRegion[]): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};
