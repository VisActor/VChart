import { registerBarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IBarChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { BarChartSpecTransformer } from './bar-transformer';
import { BaseChart } from '../base';

export class BarChart<T extends IBarChartSpec = IBarChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.bar;
  static readonly seriesType: string = SeriesTypeEnum.bar;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = BarChartSpecTransformer;
  readonly transformerConstructor = BarChartSpecTransformer;
  readonly type: string = ChartTypeEnum.bar;
  readonly seriesType: string = SeriesTypeEnum.bar;
  protected _canStack: boolean = true;
}

export const registerBarChart = () => {
  registerBarSeries();
  Factory.registerChart(BarChart.type, BarChart);
};
