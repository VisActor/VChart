import { BarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { VChart } from '../../core/vchart';
import type { IBarChartSpec } from './interface';
VChart.useSeries([BarSeries]);

export class BarChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.bar;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.bar;
  readonly seriesType: string = SeriesTypeEnum.bar;

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: (<IBarChartSpec>spec).barWidth,
      barMaxWidth: (<IBarChartSpec>spec).barMaxWidth,
      barMinWidth: (<IBarChartSpec>spec).barMinWidth,
      barGapInGroup: (<IBarChartSpec>spec).barGapInGroup,
      barMinHeight: (<IBarChartSpec>spec).barMinHeight
    };
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
