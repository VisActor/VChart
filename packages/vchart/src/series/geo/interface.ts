import type { ISeriesSpec } from '../..';

export interface IGeoSeriesSpec extends ISeriesSpec {
  /** 数值字段 */
  valueField?: string;
}
