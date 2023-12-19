import { registerCorrelationSeries } from '../../series/correlation/correlation';
import { BaseChart } from '../base/base-chart';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ICorrelationChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { CorrelationChartSpecTransformer } from './correlation-transformer';

export class CorrelationChart<T extends ICorrelationChartSpec = ICorrelationChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.correlation;
  static readonly seriesType: string = SeriesTypeEnum.correlation;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = CorrelationChartSpecTransformer;
  readonly transformerConstructor = CorrelationChartSpecTransformer;
  readonly type: string = ChartTypeEnum.correlation;
  readonly seriesType: string = SeriesTypeEnum.correlation;
}

export const registerCorrelationChart = () => {
  registerCorrelationSeries();
  Factory.registerChart(CorrelationChart.type, CorrelationChart);
};
