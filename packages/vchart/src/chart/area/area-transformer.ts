import { CartesianChartSpecTransformer } from '../cartesian';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IAreaChartSpec } from './interface';

export class AreaChartSpecTransformer<
  T extends IAreaChartSpec = IAreaChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      point: spec.point,
      line: spec.line,
      area: spec.area,
      seriesMark: spec.seriesMark ?? 'area',
      activePoint: spec.activePoint,
      sampling: spec.sampling,
      samplingFactor: spec.samplingFactor,
      pointDis: spec.pointDis,
      pointDisMul: spec.pointDisMul,
      markOverlap: spec.markOverlap,
      areaLabel: spec.areaLabel
    };
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
