import { BarChart } from '../bar';
import type { IWaterfallChartSpec } from './interface';
export declare class WaterfallChart extends BarChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    readonly seriesType: string;
    transformSpec(spec: IWaterfallChartSpec): void;
    protected _getDefaultSeriesSpec(spec: IWaterfallChartSpec): any;
}
export declare const registerWaterfallChart: () => void;
