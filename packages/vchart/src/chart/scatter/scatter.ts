import { registerScatterSeries } from '../../series/scatter/scatter';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IScatterChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { ScatterChartSpecTransformer } from './scatter-transformer';
import { BaseChart } from '../base';
import { StackChartMixin } from '../stack';
import { mixin } from '@visactor/vutils';

export class ScatterChart<T extends IScatterChartSpec = IScatterChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.scatter;
  static readonly seriesType: string = SeriesTypeEnum.scatter;
  static readonly transformerConstructor = ScatterChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = ScatterChartSpecTransformer;
  readonly type: string = ChartTypeEnum.scatter;
  readonly seriesType: string = SeriesTypeEnum.scatter;
}

mixin(ScatterChart, StackChartMixin);

export const registerScatterChart = () => {
  registerScatterSeries();
  Factory.registerChart(ScatterChart.type, ScatterChart);
};
