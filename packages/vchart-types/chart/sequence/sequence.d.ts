import { BaseChart } from '../base-chart';
import type { ISequenceChartSpec, ISequenceSeriesSpec } from './interface';
export declare class SequenceChart extends BaseChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  transformSpec(spec: ISequenceChartSpec): void;
  createSeries(seriesSpec: ISequenceSeriesSpec[]): void;
  addAttrToComponentSpec(componentSpec: any, attr: string, value: any): any;
  private _getSeriesDataLength;
}
