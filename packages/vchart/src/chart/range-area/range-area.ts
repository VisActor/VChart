import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import { Direction } from '../../typings';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { VChart } from '../../core/vchart';
import { RangeAreaSeries, registerRangeAreaSeries } from '../../series/range-area/range-area';
import { Factory } from '../../core/factory';

export class RangeAreaChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.rangeArea;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.rangeArea;
  readonly seriesType: string = SeriesTypeEnum.rangeArea;

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec)
    };
    series.area = spec.area;
    if (spec.direction === Direction.horizontal) {
      series.xField = spec.xField ?? [spec.minField, spec.maxField];
    } else {
      series.yField = spec.yField ?? [spec.minField, spec.maxField];
    }
    series.stack = false;
    return series;
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export const registerRangeAreaChart = () => {
  registerRangeAreaSeries();
  Factory.registerChart(RangeAreaChart.type, RangeAreaChart);
};
