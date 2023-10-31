import { ProgressLikeChart } from '../../polar/progress-like';
export declare class CircularProgressChart extends ProgressLikeChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _canStack: boolean;
  protected _getDefaultSeriesSpec(spec: any): any;
  transformSpec(spec: any): void;
}
export declare const registerCircularProgressChart: () => void;
