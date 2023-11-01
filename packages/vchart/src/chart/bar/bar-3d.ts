import { registerBar3dSeries } from '../../series/bar/bar-3d';
import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import type { IBar3dChartSpec } from './interface';
import { Factory } from '../../core/factory';

export class Bar3dChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.bar3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.bar3d;
  readonly seriesType: string = SeriesTypeEnum.bar3d;

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: (<IBar3dChartSpec>spec).barWidth,
      barMaxWidth: (<IBar3dChartSpec>spec).barMaxWidth,
      barMinWidth: (<IBar3dChartSpec>spec).barMinWidth,
      barGapInGroup: (<IBar3dChartSpec>spec).barGapInGroup
    };
  }
}

export const registerBar3dChart = () => {
  registerBar3dSeries();
  Factory.registerChart(Bar3dChart.type, Bar3dChart);
};
