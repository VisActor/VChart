import { CartesianChart } from '../cartesian/cartesian';
export declare class BaseHistogramChart extends CartesianChart {
  transformSpec(spec: any): void;
  protected _getDefaultSeriesSpec(spec: any): any;
}
