import { BaseHistogramChart } from './base/base';
import type { IHistogramChartSpec } from './interface';
import { HistogramChartSpecTransformer } from './histogram-transformer';
export declare class HistogramChart<T extends IHistogramChartSpec = IHistogramChartSpec> extends BaseHistogramChart<T> {
    static readonly type: string;
    static readonly seriesType: string;
    static readonly view: string;
    static readonly transformerConstructor: typeof HistogramChartSpecTransformer;
    readonly transformerConstructor: typeof HistogramChartSpecTransformer;
    readonly type: string;
    readonly seriesType: string;
}
export declare const registerHistogramChart: () => void;
