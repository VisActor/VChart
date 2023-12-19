import type { IRangeColumnChartSpec } from './interface';
import { RangeColumnChartSpecTransformer } from './range-column-transformer';
import { BaseChart } from '../base';
export declare class RangeColumnChart<T extends IRangeColumnChartSpec = IRangeColumnChartSpec> extends BaseChart<T> {
    static readonly type: string;
    static readonly seriesType: string;
    static readonly view: string;
    static readonly transformerConstructor: typeof RangeColumnChartSpecTransformer;
    readonly transformerConstructor: typeof RangeColumnChartSpecTransformer;
    readonly type: string;
    readonly seriesType: string;
}
export declare const registerRangeColumnChart: () => void;
