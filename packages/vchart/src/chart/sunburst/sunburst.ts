import { registerSunBurstSeries } from './../../series/sunburst/sunburst';
import { SeriesTypeEnum } from '../../series/interface/type';
import { BaseChart } from '../base/base-chart';
import { ChartTypeEnum } from '../interface/type';
import type { ISunburstChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { SunburstChartSpecTransformer } from './spec-transformer';

export class SunburstChart<T extends ISunburstChartSpec = ISunburstChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.sunburst;
  static readonly seriesType: string = SeriesTypeEnum.sunburst;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = SunburstChartSpecTransformer;
  readonly transformerConstructor = SunburstChartSpecTransformer;
  readonly type: string = ChartTypeEnum.sunburst;
  readonly seriesType: string = SeriesTypeEnum.sunburst;
}

export const registerSunburstChart = () => {
  registerSunBurstSeries();
  Factory.registerChart(SunburstChart.type, SunburstChart);
};
