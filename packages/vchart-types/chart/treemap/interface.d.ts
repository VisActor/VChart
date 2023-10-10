import type { ITreemapSeriesSpec } from '../../series/treemap/interface';
import type { IChartSpec } from '../../typings/spec/common';
export interface ITreemapChartSpec extends Omit<IChartSpec, 'data' | 'series'>, ITreemapSeriesSpec {
  type: 'treemap';
  series?: ITreemapSeriesSpec[];
}
