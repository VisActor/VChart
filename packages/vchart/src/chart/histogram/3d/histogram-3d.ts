import { registerBar3dSeries } from '../../../series/bar/bar-3d';
import { SeriesTypeEnum } from '../../../series/interface/type';
import { ChartTypeEnum } from '../../interface/type';
import { BaseHistogramChart } from '../base/base';
import { Factory } from '../../../core/factory';
import type { IHistogram3dChartSpec } from '../interface';
import type { AdaptiveSpec } from '../../../typings';
import { HistogramChartSpecTransformer } from '../histogram-transformer';
import { register3DPlugin } from '../../../plugin/other';
import { registerDimensionHover } from '../../../interaction/triggers/dimension-hover';

export class Histogram3dChart<T extends IHistogram3dChartSpec> extends BaseHistogramChart<AdaptiveSpec<T, 'type'>> {
  static readonly type: string = ChartTypeEnum.histogram3d;
  static readonly seriesType: string = SeriesTypeEnum.bar3d;
  static readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly type: string = ChartTypeEnum.histogram3d;
  readonly seriesType: string = SeriesTypeEnum.bar3d;
}
export const registerHistogram3dChart = () => {
  registerDimensionHover();
  register3DPlugin();
  registerBar3dSeries();
  Factory.registerChart(Histogram3dChart.type, Histogram3dChart);
};
