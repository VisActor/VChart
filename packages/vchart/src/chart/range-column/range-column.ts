import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { IRangeColumnChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { registerRangeColumnSeries } from '../../series/range-column/range-column';
import { RangeColumnChartSpecTransformer } from './range-column-transformer';
import { BaseChart } from '../base';

export class RangeColumnChart<T extends IRangeColumnChartSpec = IRangeColumnChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.rangeColumn;
  static readonly seriesType: string = SeriesTypeEnum.rangeColumn;
  static readonly transformerConstructor = RangeColumnChartSpecTransformer;
  readonly transformerConstructor = RangeColumnChartSpecTransformer;
  readonly type: string = ChartTypeEnum.rangeColumn;
  readonly seriesType: string = SeriesTypeEnum.rangeColumn;
}

export const registerRangeColumnChart = () => {
  registerRangeColumnSeries();
  Factory.registerChart(RangeColumnChart.type, RangeColumnChart);
};
