import type { IBarSeriesSpec } from '../../series';
import { CartesianChartSpecTransformer } from '../cartesian';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IBarChartSpec } from './interface';

export class BarChartSpecTransformer<T extends IBarChartSpec = IBarChartSpec> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: spec.barWidth,
      barMaxWidth: spec.barMaxWidth,
      barMinWidth: spec.barMinWidth,
      barGapInGroup: spec.barGapInGroup,
      barMinHeight: spec.barMinHeight,
      sampling: spec.sampling,
      samplingFactor: spec.samplingFactor,
      barBackground: spec.barBackground,
      stackCornerRadius: spec.stackCornerRadius
    } as IBarSeriesSpec;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
