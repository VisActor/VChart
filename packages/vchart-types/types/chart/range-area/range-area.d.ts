import type { IRangeAreaChartSpec } from './interface';
import { RangeAreaChartSpecTransformer } from './range-area-transformer';
import { BaseChart } from '../base';
export declare class RangeAreaChart<T extends IRangeAreaChartSpec = IRangeAreaChartSpec> extends BaseChart<T> {
    static readonly type: string;
    static readonly seriesType: string;
    static readonly view: string;
    static readonly transformerConstructor: typeof RangeAreaChartSpecTransformer;
    readonly transformerConstructor: typeof RangeAreaChartSpecTransformer;
    readonly type: string;
    readonly seriesType: string;
}
export declare const registerRangeAreaChart: () => void;
