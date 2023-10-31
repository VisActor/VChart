import { CartesianChart } from '../cartesian/cartesian';
import type { IScatterChartSpec } from './interface';
export declare class ScatterChart extends CartesianChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _canStack: boolean;
  protected _getDefaultSeriesSpec(spec: IScatterChartSpec): any;
}
export declare const registerScatterChart: () => void;
