import { CartesianChart } from '../cartesian/cartesian';
export declare class HeatmapChart extends CartesianChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _getDefaultSeriesSpec(spec: any): any;
}
export declare const registerHeatmapChart: () => void;
