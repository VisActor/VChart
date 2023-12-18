import { array } from '@visactor/vutils';
import type { AdaptiveSpec } from '../../typings';
import { BarChartSpecTransformer } from '../bar';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IWaterfallChartSpec } from './interface';

export class WaterfallChartSpecTransformer<
  T extends IWaterfallChartSpec = IWaterfallChartSpec
> extends BarChartSpecTransformer<AdaptiveSpec<T, 'type' | 'series' | 'label'>> {
  transformSpec(spec: AdaptiveSpec<T, 'type' | 'series' | 'label'>): void {
    super.transformSpec(spec);
    if (spec.legends) {
      array(spec.legends).forEach((l: any) => {
        l.select = false;
        l.hover = false;
        l.filter = false;
      });
    }

    setDefaultCrosshairForCartesianChart(spec);
  }

  protected _getDefaultSeriesSpec(spec: AdaptiveSpec<T, 'type' | 'series' | 'label'>): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      bar: spec.bar,
      stackLabel: spec.stackLabel,
      leaderLine: spec.leaderLine,
      total: spec.total
    };
  }
}
