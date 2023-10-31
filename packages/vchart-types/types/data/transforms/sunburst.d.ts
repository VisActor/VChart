import type { SunburstOptions } from '@visactor/vgrammar-hierarchy';
import type { Datum } from '../../typings';
export interface ISunburstOpt extends SunburstOptions {
    width: number;
    height: number;
}
export declare const sunburstLayout: (data: Array<Datum>, op: () => ISunburstOpt) => Datum[];
