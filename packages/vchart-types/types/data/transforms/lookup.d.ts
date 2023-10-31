import type { DataView } from '@visactor/vdataset';
import type { Datum } from '../../typings';
export interface ILookUpOpt {
    from: () => object[];
    key: string;
    fields: string;
    values?: string[];
    as?: string[];
    default?: any;
    set?: (A: Datum, B: Datum) => void;
}
export declare const lookup: (data: Array<DataView>, opt: ILookUpOpt) => DataView[];
