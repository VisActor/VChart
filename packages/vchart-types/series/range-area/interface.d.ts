import type { IAreaSeriesSpec } from '../area/interface';
export interface IRangeAreaSeriesSpec extends Omit<IAreaSeriesSpec, 'type'> {
  type: 'rangeArea';
  minField?: string;
  maxField?: string;
}
