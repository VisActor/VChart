import { registerAreaSeries } from '../../series/area/area';
import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import type { IChartOption } from '../interface';
import { ChartTypeEnum } from '../interface';
import type { IAreaChartSpec } from './interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { Factory } from '../../core/factory';
import { Stack } from '../stack';

export class AreaChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.area;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.area;
  readonly seriesType: string = SeriesTypeEnum.area;
  protected _canStack: boolean = true;

  protected _getDefaultSeriesSpec(spec: IAreaChartSpec): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      point: spec.point,
      line: spec.line,
      area: spec.area,
      seriesMark: spec.seriesMark ?? 'area',
      activePoint: spec.activePoint
    };
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export const registerAreaChart = () => {
  registerAreaSeries();
  Factory.registerChart(AreaChart.type, AreaChart);
};
