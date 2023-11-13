import { BaseHistogramChart } from './base';
export declare class HistogramChart extends BaseHistogramChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    readonly seriesType: string;
    transformSpec(spec: any): void;
}
export declare const registerHistogramChart: () => void;
