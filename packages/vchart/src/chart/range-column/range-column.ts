import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { SeriesTypeEnum } from '../../series/interface';
import { Direction } from '../../typings';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { VChart } from '../../core/vchart';
import { RangeColumnSeries } from '../../series';
import type { IRangeColumnChartSpec } from './interface';
VChart.useSeries([RangeColumnSeries]);

export class RangeColumnChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.rangeColumn;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.rangeColumn;
  readonly seriesType: string = SeriesTypeEnum.rangeColumn;

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      barGapInGroup: (spec as IRangeColumnChartSpec).barGapInGroup ?? 0
    };
    series.bar = spec.bar;
    if (spec.direction === Direction.horizontal) {
      series.xField = spec.xField ?? [spec.minField, spec.maxField];
    } else {
      series.yField = spec.yField ?? [spec.minField, spec.maxField];
    }
    return series;
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
