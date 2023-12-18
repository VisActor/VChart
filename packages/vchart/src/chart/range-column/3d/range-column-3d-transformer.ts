import { Direction } from '../../../typings';
import { CartesianChartSpecTransformer } from '../../cartesian';
import type { IRangeColumn3dChartSpec } from '../interface';

export class RangeColumn3dChartSpecTransformer<
  T extends IRangeColumn3dChartSpec = IRangeColumn3dChartSpec
> extends CartesianChartSpecTransformer<T> {
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
