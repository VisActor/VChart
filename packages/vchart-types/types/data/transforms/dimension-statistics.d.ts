import type { IFieldsMeta } from '../../typings/spec';
import type { DataView } from '@visactor/vdataset';
import type { Datum } from '../../typings';
export type StatisticOperations = Array<'max' | 'min' | 'values' | 'array-max' | 'array-min' | 'allValid'>;
export interface IStatisticsOption {
    fields: {
        key: string;
        operations: StatisticOperations;
        filter?: (fv: any) => boolean;
        customize?: {
            max: number;
            min: number;
        } | any[];
    }[];
    target?: 'parser' | 'latest';
}
export declare const dimensionStatistics: (data: Array<DataView>, op: IStatisticsOption) => {};
export declare const dimensionStatisticsOfSimpleData: (latestData: Datum[], fields: {
    key: string;
    operations: StatisticOperations;
    filter?: (fv: any) => boolean;
    customize?: {
        max: number;
        min: number;
    } | any[];
}[], dataFields?: Record<string, IFieldsMeta>) => {};
