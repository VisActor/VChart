import type { DataView } from '@visactor/vdataset';
import type { IAggrType, IDataPointSpec, IMarkerSupportSeries } from '../../component/marker/interface';
import type { CoordinateType, Datum, StringOrNumber } from '../../typings';
export type IOption = {
    field: string;
};
export type IOptionAggrField = {
    field: string;
    aggrType: IAggrType;
};
export type IOptionPos = IOptionAggrField | string | number | StringOrNumber[];
export type IOptionSeries = {
    getRelativeSeries: () => IMarkerSupportSeries;
    getStartRelativeSeries: () => IMarkerSupportSeries;
    getEndRelativeSeries: () => IMarkerSupportSeries;
};
export type IOptionCallback = (relativeSeriesData: any, startRelativeSeriesData: any, endRelativeSeriesData: any, relativeSeries: IMarkerSupportSeries, startRelative: IMarkerSupportSeries, endRelative: IMarkerSupportSeries) => IOptionPos;
export type IOptionAggr = {
    x?: IOptionPos | IOptionCallback;
    y?: IOptionPos | IOptionCallback;
    angle?: IOptionPos | IOptionCallback;
    radius?: IOptionPos | IOptionCallback;
    areaName?: string | IOptionCallback;
    getRefRelativeSeries?: () => IMarkerSupportSeries;
} & IOptionSeries;
export type IOptionWithCoordinates = {
    coordinates: ((seriesData: Datum[], relativeSeries: IMarkerSupportSeries) => IDataPointSpec[] | IDataPointSpec) | IDataPointSpec | IDataPointSpec[];
    getSeriesByIdOrIndex: (seriesUserId: StringOrNumber, seriesIndex: number) => IMarkerSupportSeries;
    coordinateType: CoordinateType;
} & IOptionSeries;
export declare const markerMin: (_data: Array<DataView>, opt: IOption) => number;
export declare const markerMax: (_data: Array<DataView>, opt: IOption) => number;
export declare function markerSum(_data: Array<DataView>, opt: IOption): number;
export declare function markerAverage(_data: Array<DataView>, opt: IOption): number;
export declare function markerVariance(_data: Array<DataView>, opt: IOption): number;
export declare function markerStandardDeviation(_data: Array<DataView>, opt: IOption): number;
export declare function markerMedian(_data: Array<DataView>, opt: IOption): number;
export declare function markerAggregation(_data: Array<DataView>, options: IOptionWithCoordinates | IOptionAggr[]): {
    x: StringOrNumber[] | StringOrNumber | IOptionCallback | null;
    y: StringOrNumber[] | StringOrNumber | IOptionCallback | null;
    angle: StringOrNumber[] | StringOrNumber | IOptionCallback | null;
    radius: StringOrNumber[] | StringOrNumber | IOptionCallback | null;
    areaName: string | IOptionCallback | null;
}[];
