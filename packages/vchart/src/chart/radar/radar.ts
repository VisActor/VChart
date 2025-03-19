import { registerRadarSeries } from '../../series/radar/radar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { Factory } from '../../core/factory';
import type { IRoseChartSpec } from '../rose';
import { RadarChartSpecTransformer } from './radar-transformer';
import { BaseChart } from '../base';
import { StackChartMixin } from '../stack';
import { mixin } from '@visactor/vutils';
import { registerDimensionHover } from '../../interaction/triggers/dimension-hover';

export class RadarChart<T extends IRoseChartSpec = IRoseChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.radar;
  static readonly seriesType: string = SeriesTypeEnum.radar;
  static readonly transformerConstructor = RadarChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = RadarChartSpecTransformer;
  readonly type: string = ChartTypeEnum.radar;
  readonly seriesType: string = SeriesTypeEnum.radar;
}

mixin(RadarChart, StackChartMixin);

export const registerRadarChart = () => {
  registerDimensionHover();
  registerRadarSeries();
  Factory.registerChart(RadarChart.type, RadarChart);
};
