import type { Datum } from '../../typings';
import type { TreemapNodeElement, SunburstNodeElement } from '@visactor/vgrammar-hierarchy';
export type FlattenNodeElement = TreemapNodeElement | SunburstNodeElement;
export interface IFlattenOpt {
    output?: Datum[];
    maxDepth?: number;
    callback?: <T>(node: FlattenNodeElement) => T;
}
export declare const flatten: (data: Array<Datum>, op?: IFlattenOpt) => FlattenNodeElement[];
