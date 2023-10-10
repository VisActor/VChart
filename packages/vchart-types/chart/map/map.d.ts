import { BaseChart } from '../base-chart';
import type { IMapChartSpec } from './interface';
import type { IMapSeriesSpec } from '../../series/map/interface';
export declare class MapChart extends BaseChart {
  static readonly type: string;
  static readonly view: string;
  readonly type: string;
  readonly seriesType: string;
  protected _getDefaultSeriesSpec(spec: IMapChartSpec): IMapSeriesSpec;
  protected isValidSeries(type: string): boolean;
  transformSpec(spec: IMapChartSpec): void;
}
