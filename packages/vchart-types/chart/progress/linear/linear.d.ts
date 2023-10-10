import { CartesianChart } from '../../cartesian/cartesian';
import type { ILinearProgressChartSpec } from './interface';
export declare class LinearProgressChart extends CartesianChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected needAxes(): boolean;
  protected _getDefaultSeriesSpec(spec: ILinearProgressChartSpec): ILinearProgressChartSpec;
  transformSpec(spec: ILinearProgressChartSpec): void;
}
