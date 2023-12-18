import type { AdaptiveSpec } from '../../../typings';
import type { IBar3dChartSpec } from '../interface';
import { BarChartSpecTransformer } from '../bar-transformer';

export class Bar3dChartSpecTransformer<T extends IBar3dChartSpec = IBar3dChartSpec> extends BarChartSpecTransformer<
  AdaptiveSpec<T, 'type' | 'series'>
> {
  protected _getDefaultSeriesSpec(spec: AdaptiveSpec<T, 'type' | 'series'>): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: spec.barWidth,
      barMaxWidth: spec.barMaxWidth,
      barMinWidth: spec.barMinWidth,
      barGapInGroup: spec.barGapInGroup
    };
  }
}
