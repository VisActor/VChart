import { BasePieChart } from './base';
export declare class PieChart extends BasePieChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
}
export declare const registerPieChart: () => void;
