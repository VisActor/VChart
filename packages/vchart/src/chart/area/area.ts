import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import type { IAreaChartSpec } from './interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { VChart } from '../../core/vchart';
import { AreaSeries } from '../../series';
VChart.useSeries([AreaSeries]);

export class AreaChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.area;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.area;
  readonly seriesType: string = SeriesTypeEnum.area;

  protected _getDefaultSeriesSpec(spec: IAreaChartSpec): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      point: spec.point,
      line: spec.line,
      area: spec.area,
      seriesMark: spec.seriesMark ?? 'area'
    };
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
