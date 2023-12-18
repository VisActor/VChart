import { CartesianChartSpecTransformer } from '../cartesian';
import type { IHeatmapChartSpec } from './interface';

export class HeatmapChartSpecTransformer<
  T extends IHeatmapChartSpec = IHeatmapChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series = super._getDefaultSeriesSpec(spec);
    return {
      ...series,
      valueField: spec.valueField,
      cell: spec.cell
    };
  }
}
