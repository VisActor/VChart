import { ChartTypeEnum } from '../../interface';
import { SeriesTypeEnum } from '../../../series/interface/type';
import type { ILinearProgressChartSpec } from './interface';
import { registerLinearProgressSeries } from '../../../series/progress/linear';
import { Factory } from '../../../core/factory';
import { LinearProgressChartSpecTransformer } from './linear-progress-transformer';
import { BaseChart } from '../../base';

export class LinearProgressChart<T extends ILinearProgressChartSpec = ILinearProgressChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.linearProgress;
  static readonly seriesType: string = SeriesTypeEnum.linearProgress;
  static readonly transformerConstructor = LinearProgressChartSpecTransformer;
  readonly transformerConstructor = LinearProgressChartSpecTransformer;
  readonly type: string = ChartTypeEnum.linearProgress;
  readonly seriesType: string = SeriesTypeEnum.linearProgress;
  protected _canStack: boolean = true;
}

export const registerLinearProgressChart = () => {
  registerLinearProgressSeries();
  Factory.registerChart(LinearProgressChart.type, LinearProgressChart);
};
