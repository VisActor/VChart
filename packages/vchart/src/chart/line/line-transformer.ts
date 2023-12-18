import { CartesianChartSpecTransformer } from '../cartesian';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { ILineChartSpec } from './interface';

export class LineChartSpecTransformer<T extends ILineChartSpec> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      point: spec.point,
      line: spec.line,
      seriesMark: spec.seriesMark ?? 'line',
      activePoint: spec.activePoint,
      sampling: spec.sampling,
      samplingFactor: spec.samplingFactor,
      pointDis: spec.pointDis,
      pointDisMul: spec.pointDisMul,
      markOverlap: spec.markOverlap,
      lineLabel: spec.lineLabel
    };
  }
  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
