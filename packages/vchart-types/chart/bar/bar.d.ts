import { CartesianChart } from '../cartesian/cartesian';
export declare class BarChart extends CartesianChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _canStack: boolean;
  protected _getDefaultSeriesSpec(spec: any): any;
  transformSpec(spec: any): void;
}
export declare const registerBarChart: () => void;
