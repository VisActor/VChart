import { BaseChartSpecTransformer } from '../base';
import type { ISequenceChartSpec } from './interface';
export declare class SequenceChartSpecTransformer<T extends ISequenceChartSpec = ISequenceChartSpec> extends BaseChartSpecTransformer<T> {
    private _getSeriesDataLength;
    addAttrToComponentSpec(componentSpec: any, attr: string, value: any): any;
    transformSpec(spec: T): void;
}
