import type { DataView } from '@visactor/vdataset';
export type StatisticOperations = Array<'max' | 'min' | 'values' | 'array-max' | 'array-min' | 'allValid'>;
export interface IStatisticsOption {
    fields: {
        key: string;
        operations: StatisticOperations;
        customize?: {
            max: number;
            min: number;
        } | any[];
    }[];
    target?: 'parser' | 'latest';
    fieldFollowSource?: (key: string) => boolean;
    sourceStatistics?: () => {
        [key: string]: unknown;
    };
}
export declare const dimensionStatistics: (data: Array<DataView>, op: IStatisticsOption) => {};
