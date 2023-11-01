import type { DataView } from '@visactor/vdataset';
export type IOptionRegr = {
    fieldX: string;
    fieldY: string;
};
export declare function markerRegression(_data: Array<DataView>, opt: IOptionRegr): any[];
