import { ChartTypeEnum } from '../../interface/type';
import { SeriesTypeEnum } from '../../../series/interface/type';
import type { IRangeColumn3dChartSpec } from '../interface';
import { Factory } from '../../../core/factory';
import { registerRangeColumn3dSeries } from '../../../series/range-column/3d/range-column-3d';
import { RangeColumn3dChartSpecTransformer } from './spec-transformer';
import { BaseChart } from '../../base';

export class RangeColumn3dChart<T extends IRangeColumn3dChartSpec = IRangeColumn3dChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.rangeColumn3d;
  static readonly seriesType: string = SeriesTypeEnum.rangeColumn3d;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = RangeColumn3dChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = RangeColumn3dChartSpecTransformer;
  readonly type: string = ChartTypeEnum.rangeColumn3d;
  readonly seriesType: string = SeriesTypeEnum.rangeColumn3d;
}

export const registerRangeColumn3dChart = () => {
  registerRangeColumn3dSeries();
  Factory.registerChart(RangeColumn3dChart.type, RangeColumn3dChart);
};
