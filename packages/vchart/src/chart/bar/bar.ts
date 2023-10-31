import { registerBarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IBarChartSpec } from './interface';
import { Factory } from '../../core/factory';

export class BarChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.bar;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.bar;
  readonly seriesType: string = SeriesTypeEnum.bar;
  protected _canStack: boolean = true;

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: (<IBarChartSpec>spec).barWidth,
      barMaxWidth: (<IBarChartSpec>spec).barMaxWidth,
      barMinWidth: (<IBarChartSpec>spec).barMinWidth,
      barGapInGroup: (<IBarChartSpec>spec).barGapInGroup,
      barMinHeight: (<IBarChartSpec>spec).barMinHeight,
      barBackground: (<IBarChartSpec>spec).barBackground
    };
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export const registerBarChart = () => {
  registerBarSeries();
  Factory.registerChart(BarChart.type, BarChart);
};
