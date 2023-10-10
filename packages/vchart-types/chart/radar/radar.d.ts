import { RoseLikeChart } from '../polar/rose-like';
export declare class RadarChart extends RoseLikeChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _getDefaultSeriesSpec(spec: any): any;
  transformSpec(spec: any): void;
}
