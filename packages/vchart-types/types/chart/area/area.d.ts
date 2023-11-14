import { CartesianChart } from '../cartesian/cartesian';
import type { IAreaChartSpec } from './interface';
export declare class AreaChart extends CartesianChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    readonly seriesType: string;
    protected _canStack: boolean;
    protected _getDefaultSeriesSpec(spec: IAreaChartSpec): any;
    transformSpec(spec: any): void;
}
export declare const registerAreaChart: () => void;
