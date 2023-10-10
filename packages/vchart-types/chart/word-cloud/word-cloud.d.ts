import type { IWordCloudChartSpec } from './interface';
import { BaseWordCloudChart } from './base';
export declare class WordCloudChart extends BaseWordCloudChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _getDefaultSeriesSpec(spec: IWordCloudChartSpec): any;
}
