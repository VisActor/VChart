import { CartesianChart } from '../cartesian/cartesian';
import type { ILineChartSpec } from './interface';
export declare class LineChart extends CartesianChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    readonly seriesType: string;
    protected _canStack: boolean;
    protected _getDefaultSeriesSpec(spec: ILineChartSpec): any;
    transformSpec(spec: any): void;
}
export declare const registerLineChart: () => void;
