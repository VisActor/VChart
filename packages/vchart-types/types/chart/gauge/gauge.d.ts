import { ProgressLikeChart } from '../polar/progress-like';
export declare class GaugeChart extends ProgressLikeChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    readonly seriesType: string;
    protected _getDefaultSeriesSpec(spec: any): any;
    protected _getDefaultCircularProgressSeriesSpec(spec: any): any;
    transformSpec(spec: any): void;
    protected _transformGaugeAxisSpec(spec: any): void;
}
export declare const registerGaugeChart: () => void;
