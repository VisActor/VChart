import { BaseChart } from '../base-chart';
export declare class CommonChart extends BaseChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  protected _getDefaultSeriesSpec(spec: any): any;
  transformSpec(spec: any): void;
}
