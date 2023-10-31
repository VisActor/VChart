import type { ISunburstSeriesSpec } from '../../series/sunburst/interface';
import { BaseChart } from '../base-chart';
import type { ISunburstChartSpec } from './interface';
export declare class SunburstChart extends BaseChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected getDefaultSeriesSpec(spec: ISunburstChartSpec): ISunburstSeriesSpec;
  transformSpec(spec: ISunburstChartSpec): void;
}
export declare const registerSunburstChart: () => void;
