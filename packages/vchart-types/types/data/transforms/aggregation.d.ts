import type { DataView } from '@visactor/vdataset';
import type { IAggrType } from '../../component/marker/interface';
import type { ICartesianSeries } from '../../series/interface';
export type IOption = {
    field: string;
};
export type IOptionAggrField = {
    field: string;
    aggrType: IAggrType;
};
export type IOptionPos = IOptionAggrField | string | number;
export type IOptionSeries = {
    getRelativeSeries: () => ICartesianSeries;
    getStartRelativeSeries: () => ICartesianSeries;
    getEndRelativeSeries: () => ICartesianSeries;
};
export type IOptionCallback = (relativeSeriesData: any, startRelativeSeriesData: any, endRelativeSeriesData: any) => IOptionPos;
export type IOptionAggr = {
    x?: IOptionPos | IOptionCallback;
    y?: IOptionPos | IOptionCallback;
    getRefRelativeSeries?: () => ICartesianSeries;
} & IOptionSeries;
export declare const markerMin: (_data: Array<DataView>, opt: IOption) => number;
export declare const markerMax: (_data: Array<DataView>, opt: IOption) => number;
export declare function markerSum(_data: Array<DataView>, opt: IOption): number;
export declare function markerAverage(_data: Array<DataView>, opt: IOption): number;
export declare function markerVariance(_data: Array<DataView>, opt: IOption): number;
export declare function markerStandardDeviation(_data: Array<DataView>, opt: IOption): number;
export declare function markerMedian(_data: Array<DataView>, opt: IOption): number;
export declare function markerAggregation(_data: Array<DataView>, options: IOptionAggr[]): {
    x: string | number | null;
    y: string | number | null;
}[];
