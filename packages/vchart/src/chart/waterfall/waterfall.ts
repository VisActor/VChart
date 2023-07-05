import type { IBarChartSpec } from '@visactor/vchart';
import { array } from '@visactor/vutils';
import { SeriesTypeEnum } from '../../series/interface';
import { BarChart } from '../bar';
import { ChartTypeEnum } from '../interface';
import type { IWaterfallChartSpec } from './interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { VChart } from '../../core/vchart';
import { WaterfallSeries } from '../../series';
VChart.useSeries([WaterfallSeries]);

export class WaterfallChart extends BarChart {
  static readonly type: string = ChartTypeEnum.waterfall;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.waterfall;
  readonly seriesType: string = SeriesTypeEnum.waterfall;

  transformSpec(spec: IWaterfallChartSpec | Omit<IBarChartSpec, 'type'>): void {
    super.transformSpec(spec as IBarChartSpec);
    if (spec.legends) {
      array(spec.legends).forEach(l => {
        l.select = false;
        l.hover = false;
        l.filter = false;
      });
    }

    setDefaultCrosshairForCartesianChart(spec as IWaterfallChartSpec);
  }

  protected _getDefaultSeriesSpec(spec: IWaterfallChartSpec | Omit<IBarChartSpec, 'type'>): any {
    return {
      ...super._getDefaultSeriesSpec(spec as IBarChartSpec),
      stackLabel: spec.stackLabel,
      leaderLine: spec.leaderLine,
      total: spec.total
    };
  }
}
