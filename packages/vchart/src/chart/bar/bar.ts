import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { VChart } from '../../core/vchart';
import { BarSeries } from '../../series';
import type { IBarChartSpec } from './interface';
VChart.useSeries([BarSeries]);

export class BarChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.bar;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.bar;
  readonly seriesType: string = SeriesTypeEnum.bar;

  transformSpec(spec: IBarChartSpec): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }

  protected _getDefaultSeriesSpec(spec: IBarChartSpec): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: spec.barWidth,
      barMinWidth: spec.barMinWidth,
      barMaxWidth: spec.barMaxWidth
    };
  }
}
