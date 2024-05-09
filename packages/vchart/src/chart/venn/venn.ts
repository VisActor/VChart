import { SeriesTypeEnum } from '../../series/interface/type';
import { BaseChart } from '../base/base-chart';
import { ChartTypeEnum } from '../interface/type';
import type { IVennChartSpec } from './interface';
import { registerVennSeries } from '../../series/venn/venn';
import { Factory } from '../../core/factory';
import type { AdaptiveSpec } from '../../typings';
import { VennChartSpecTransformer } from './venn-transformer';

export class VennChart<T extends IVennChartSpec = IVennChartSpec> extends BaseChart<
  AdaptiveSpec<T, 'data' | 'series'>
> {
  static readonly type: string = ChartTypeEnum.venn;
  static readonly seriesType: string = SeriesTypeEnum.venn;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = VennChartSpecTransformer;
  readonly transformerConstructor = VennChartSpecTransformer;
  readonly type: string = ChartTypeEnum.venn;
  readonly seriesType: string = SeriesTypeEnum.venn;
}

export const registerVennChart = () => {
  registerVennSeries();
  Factory.registerChart(VennChart.type, VennChart);
};
