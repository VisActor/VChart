import { array } from '@visactor/vutils';
import { SeriesTypeEnum } from '../../series/interface';
import { BarChart } from '../bar';
import { ChartTypeEnum } from '../interface';
import type { IWaterfallChartSpec } from './interface';
import { setDefaultCrosshairForCartesianChart } from '../util';

export class WaterfallChart extends BarChart {
  static readonly type: string = ChartTypeEnum.waterfall;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.waterfall;
  readonly seriesType: string = SeriesTypeEnum.waterfall;

  transformSpec(spec: IWaterfallChartSpec): void {
    super.transformSpec(spec);
    if (spec.legends) {
      array(spec.legends).forEach(l => {
        l.select = false;
        l.hover = false;
        l.filter = false;
      });
    }

    setDefaultCrosshairForCartesianChart(spec);
  }

  protected _getDefaultSeriesSpec(spec: IWaterfallChartSpec): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      stackLabel: spec.stackLabel,
      leaderLine: spec.leaderLine,
      total: spec.total
    };
  }
}
