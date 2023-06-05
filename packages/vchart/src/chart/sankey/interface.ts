import type { ISankeySeriesSpec } from '../../series/sankey/interface';
import type { IChartExtendsSeriesSpec, IChartSpec } from '../../typings/spec/common';
import type { SeriesTypeEnum } from '../../series/interface';

export interface ISankeyChartSpec extends Omit<IChartSpec, 'padding'>, IChartExtendsSeriesSpec<ISankeySeriesSpec> {
  type: SeriesTypeEnum.sankey;
  series?: ISankeySeriesSpec[];
}
