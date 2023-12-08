import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import { Direction } from '../../typings';
import type { IRangeColumn3dChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { registerRangeColumn3dSeries } from '../../series/range-column/range-column-3d';

export class RangeColumn3dChart<T extends IRangeColumn3dChartSpec = IRangeColumn3dChartSpec> extends CartesianChart<T> {
  static readonly type: string = ChartTypeEnum.rangeColumn3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.rangeColumn3d;
  readonly seriesType: string = SeriesTypeEnum.rangeColumn3d;

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      barGapInGroup: (spec as IRangeColumn3dChartSpec).barGapInGroup
    };
    series.bar3d = spec.bar3d;
    if (spec.direction === Direction.horizontal) {
      series.xField = spec.xField ?? [spec.minField, spec.maxField];
    } else {
      series.yField = spec.yField ?? [spec.minField, spec.maxField];
    }
    return series;
  }
}

export const registerRangeColumn3dChart = () => {
  registerRangeColumn3dSeries();
  Factory.registerChart(RangeColumn3dChart.type, RangeColumn3dChart);
};
