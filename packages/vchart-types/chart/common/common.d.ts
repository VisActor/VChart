import { BaseChart } from '../base-chart';
export declare class CommonChart extends BaseChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  protected _canStack: boolean;
  protected _getDefaultSeriesSpec(spec: any): any;
  transformSpec(spec: any): void;
}
export declare const registerCommonChart: () => void;
