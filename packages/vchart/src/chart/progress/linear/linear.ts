import { ChartTypeEnum } from '../../interface';
import { SeriesTypeEnum } from '../../../series/interface/type';
import type { ILinearProgressChartSpec } from './interface';
import { registerLinearProgressSeries } from '../../../series/progress/linear';
import { Factory } from '../../../core/factory';
import { LinearProgressChartSpecTransformer } from './linear-progress-transformer';
import { BaseChart } from '../../base';
import { StackChartMixin } from '../../stack';
import { mixin } from '@visactor/vutils';

export class LinearProgressChart<T extends ILinearProgressChartSpec = ILinearProgressChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.linearProgress;
  static readonly seriesType: string = SeriesTypeEnum.linearProgress;
  static readonly transformerConstructor = LinearProgressChartSpecTransformer;
  readonly transformerConstructor = LinearProgressChartSpecTransformer;
  readonly type: string = ChartTypeEnum.linearProgress;
  readonly seriesType: string = SeriesTypeEnum.linearProgress;
}

mixin(LinearProgressChart, StackChartMixin);

export const registerLinearProgressChart = () => {
  registerLinearProgressSeries();
  Factory.registerChart(LinearProgressChart.type, LinearProgressChart);
};
