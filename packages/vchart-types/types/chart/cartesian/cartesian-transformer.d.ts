import { BaseChartSpecTransformer } from '../base';
import type { ICartesianChartSpec } from './interface';
export declare class CartesianChartSpecTransformer<T extends ICartesianChartSpec> extends BaseChartSpecTransformer<T> {
    protected needAxes(): boolean;
    protected _isValidSeries(type: string): boolean;
    protected _getDefaultSeriesSpec(spec: any): any;
    transformSpec(spec: T): void;
}
