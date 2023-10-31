import { BaseChart } from '../base-chart';
import type { ITreemapChartSpec } from './interface';
export declare class TreemapChart extends BaseChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected getDefaultSeriesSpec(spec: ITreemapChartSpec): any;
  transformSpec(spec: any): void;
}
export declare const registerTreemapChart: () => void;
