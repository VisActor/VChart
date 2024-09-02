import { registerBarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IBarChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { BarChartSpecTransformer } from './bar-transformer';
import { BaseChart } from '../base';
import { mixin } from '@visactor/vutils';
import { StackChartMixin } from '../stack';

export class BarChart<T extends IBarChartSpec = IBarChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.bar;
  static readonly seriesType: string = SeriesTypeEnum.bar;
  static readonly transformerConstructor = BarChartSpecTransformer;
  readonly transformerConstructor = BarChartSpecTransformer;
  readonly type: string = ChartTypeEnum.bar;
  readonly seriesType: string = SeriesTypeEnum.bar;
}

mixin(BarChart, StackChartMixin);

export const registerBarChart = () => {
  registerBarSeries();
  Factory.registerChart(BarChart.type, BarChart);
};
