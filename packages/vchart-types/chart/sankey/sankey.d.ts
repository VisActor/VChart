import { BaseChart } from '../base-chart';
import type { ISankeyChartSpec } from './interface';
export declare class SankeyChart extends BaseChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected getDefaultSeriesSpec(spec: ISankeyChartSpec): any;
  transformSpec(spec: any): void;
}
