import { BaseChart } from '../base-chart';
import type { ICorrelationChartSpec } from './interface';
export declare class CorrelationChart extends BaseChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    readonly seriesType: string;
    protected _getDefaultSeriesSpec(spec: ICorrelationChartSpec): any;
    transformSpec(spec: ICorrelationChartSpec): void;
}
export declare const registerCorrelationChart: () => void;
