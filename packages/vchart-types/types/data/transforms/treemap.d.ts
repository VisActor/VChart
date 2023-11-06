import type { TreemapOptions } from '@visactor/vgrammar-hierarchy';
import type { Datum } from '../../typings';
export interface ITreemapOpt extends TreemapOptions {
    range: () => {
        x0: number;
        x1: number;
        y0: number;
        y1: number;
    };
}
export declare const treemap: (data: Array<Datum>, op: ITreemapOpt) => Datum[];
