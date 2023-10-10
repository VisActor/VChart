import { CartesianChart } from '../cartesian/cartesian';
import type { IBoxPlotChartSpec } from './interface';
export declare class BoxPlotChart extends CartesianChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _getDefaultSeriesSpec(spec: IBoxPlotChartSpec): any;
  transformSpec(spec: IBoxPlotChartSpec): void;
}
