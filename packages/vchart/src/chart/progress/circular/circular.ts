import { SeriesTypeEnum } from '../../../series/interface/type';
import { ChartTypeEnum } from '../../interface';
import { registerCircularProgressSeries } from '../../../series/progress/circular';
import { Factory } from '../../../core/factory';
import type { ICircularProgressChartSpec } from './interface';
import { CircularProgressChartSpecTransformer } from './spec-transformer';
import type { AdaptiveSpec } from '../../../typings';
import { BaseChart } from '../../base';

export class CircularProgressChart<T extends ICircularProgressChartSpec = ICircularProgressChartSpec> extends BaseChart<
  AdaptiveSpec<T, 'axes'>
> {
  static readonly type: string = ChartTypeEnum.circularProgress;
  static readonly seriesType: string = SeriesTypeEnum.circularProgress;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = CircularProgressChartSpecTransformer;
  readonly transformerConstructor = CircularProgressChartSpecTransformer;
  readonly type: string = ChartTypeEnum.circularProgress;
  readonly seriesType: string = SeriesTypeEnum.circularProgress;
  protected _canStack: boolean = true;
}

export const registerCircularProgressChart = () => {
  registerCircularProgressSeries();
  Factory.registerChart(CircularProgressChart.type, CircularProgressChart);
};
