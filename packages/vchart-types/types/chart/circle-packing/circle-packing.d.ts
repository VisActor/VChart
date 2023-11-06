import type { ICirclePackingSeriesSpec } from '../../series/circle-packing/interface';
import { BaseChart } from '../base-chart';
import type { ICirclePackingChartSpec } from './interface';
export declare class CirclePackingChart extends BaseChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    readonly seriesType: string;
    protected getDefaultSeriesSpec(spec: ICirclePackingChartSpec): ICirclePackingSeriesSpec;
    transformSpec(spec: ICirclePackingChartSpec): void;
}
export declare const registerCirclePackingChart: () => void;
