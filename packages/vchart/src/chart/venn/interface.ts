import type { IVennSeriesSpec } from '../../series/venn/interface';
import type { IChartSpec } from '../../typings/spec/common';

export interface IVennChartSpec extends Omit<IChartSpec, 'data' | 'series'>, IVennSeriesSpec {
  type: 'venn';
  series?: IVennSeriesSpec[];
}
