import { registerAreaSeries } from '../../series/area/area';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IAreaChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { AreaChartSpecTransformer } from './area-transformer';
import { BaseChart } from '../base';
import { mixin } from '@visactor/vutils';
import { StackChartMixin } from '../stack';
import { registerDimensionHover } from '../../interaction/triggers/dimension-hover';

export class AreaChart<T extends IAreaChartSpec = IAreaChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.area;
  static readonly seriesType: string = SeriesTypeEnum.area;
  static readonly transformerConstructor = AreaChartSpecTransformer;
  readonly transformerConstructor = AreaChartSpecTransformer;
  readonly type: string = ChartTypeEnum.area;
  readonly seriesType: string = SeriesTypeEnum.area;
}
mixin(AreaChart, StackChartMixin);

export const registerAreaChart = () => {
  registerDimensionHover();
  registerAreaSeries();
  Factory.registerChart(AreaChart.type, AreaChart);
};
