import { registerBar3dSeries } from '../../series/bar/bar-3d';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseHistogramChart } from './base';
import { Factory } from '../../core/factory';
import type { IHistogram3dChartSpec } from './interface';
import type { AdaptiveSpec } from '../..';
import { HistogramChartSpecTransformer } from './histogram';

export class Histogram3dChart<T extends IHistogram3dChartSpec> extends BaseHistogramChart<AdaptiveSpec<T, 'type'>> {
  static readonly type: string = ChartTypeEnum.histogram3d;
  static readonly seriesType: string = SeriesTypeEnum.bar3d;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly type: string = ChartTypeEnum.histogram3d;
  readonly seriesType: string = SeriesTypeEnum.bar3d;
}
export const registerHistogram3dChart = () => {
  registerBar3dSeries();
  Factory.registerChart(Histogram3dChart.type, Histogram3dChart);
};
