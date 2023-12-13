import { registerRoseSeries } from '../../series/rose/rose';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { Factory } from '../../core/factory';
import type { IRoseChartSpec } from './interface';
import { RoseChartSpecTransformer } from './spec-transformer';
import { BaseChart } from '../base';

export class RoseChart<T extends IRoseChartSpec = IRoseChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.rose;
  static readonly seriesType: string = SeriesTypeEnum.rose;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = RoseChartSpecTransformer;
  readonly transformerConstructor = RoseChartSpecTransformer;
  readonly type: string = ChartTypeEnum.rose;
  readonly seriesType: string = SeriesTypeEnum.rose;
  protected _canStack: boolean = true;
}

export const registerRoseChart = () => {
  registerRoseSeries();
  Factory.registerChart(RoseChart.type, RoseChart);
};
