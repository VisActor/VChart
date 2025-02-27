import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import { registerRangeAreaSeries } from '../../series/range-area/range-area';
import { Factory } from '../../core/factory';
import type { IRangeAreaChartSpec } from './interface';
import { RangeAreaChartSpecTransformer } from './range-area-transformer';
import { BaseChart } from '../base';
import { registerDimensionHover } from '../../interaction/triggers/dimension-hover';

export class RangeAreaChart<T extends IRangeAreaChartSpec = IRangeAreaChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.rangeArea;
  static readonly seriesType: string = SeriesTypeEnum.rangeArea;
  static readonly transformerConstructor = RangeAreaChartSpecTransformer;
  readonly transformerConstructor = RangeAreaChartSpecTransformer;
  readonly type: string = ChartTypeEnum.rangeArea;
  readonly seriesType: string = SeriesTypeEnum.rangeArea;
}

export const registerRangeAreaChart = () => {
  registerDimensionHover();
  registerRangeAreaSeries();
  Factory.registerChart(RangeAreaChart.type, RangeAreaChart);
};
