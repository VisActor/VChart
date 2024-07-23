import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { ILineChartSpec } from './interface';
import { registerLineSeries } from '../../series/line/line';
import { Factory } from '../../core/factory';
import { LineChartSpecTransformer } from './line-transformer';
import { BaseChart } from '../base';
import { StackChartMixin } from '../stack';
import { mixin } from '@visactor/vutils';

export class LineChart<T extends ILineChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.line;
  static readonly seriesType: string = SeriesTypeEnum.line;
  static readonly transformerConstructor = LineChartSpecTransformer;
  readonly transformerConstructor = LineChartSpecTransformer;
  readonly type: string = ChartTypeEnum.line;
  readonly seriesType: string = SeriesTypeEnum.line;
}

mixin(LineChart, StackChartMixin);

export const registerLineChart = () => {
  registerLineSeries();
  Factory.registerChart(LineChart.type, LineChart);
};
