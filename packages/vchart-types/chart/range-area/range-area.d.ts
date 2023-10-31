import { CartesianChart } from '../cartesian/cartesian';
export declare class RangeAreaChart extends CartesianChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _getDefaultSeriesSpec(spec: any): any;
  transformSpec(spec: any): void;
}
export declare const registerRangeAreaChart: () => void;
