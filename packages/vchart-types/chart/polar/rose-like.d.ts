import { PolarChart } from './polar';
export declare class RoseLikeChart extends PolarChart {
  protected needAxes(): boolean;
  protected _getDefaultSeriesSpec(spec: any): any;
  transformSpec(spec: any): void;
}
