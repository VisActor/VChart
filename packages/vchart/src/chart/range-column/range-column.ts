import { CartesianChart, CartesianChartSpecTransformer } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import { Direction } from '../../typings';
import { setDefaultCrosshairForCartesianChart } from '../util';
import type { IRangeColumnChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { registerRangeColumnSeries } from '../../series/range-column/range-column';

export class RangeColumnChartSpecTransformer<
  T extends IRangeColumnChartSpec = IRangeColumnChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      barGapInGroup: (spec as IRangeColumnChartSpec).barGapInGroup,
      barBackground: (spec as IRangeColumnChartSpec).barBackground
    };
    series.bar = spec.bar;
    if (spec.direction === Direction.horizontal) {
      series.xField = spec.xField ?? [spec.minField, spec.maxField];
    } else {
      series.yField = spec.yField ?? [spec.minField, spec.maxField];
    }
    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export class RangeColumnChart<T extends IRangeColumnChartSpec = IRangeColumnChartSpec> extends CartesianChart<T> {
  static readonly type: string = ChartTypeEnum.rangeColumn;
  static readonly seriesType: string = SeriesTypeEnum.rangeColumn;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = RangeColumnChartSpecTransformer;
  readonly transformerConstructor = RangeColumnChartSpecTransformer;
  readonly type: string = ChartTypeEnum.rangeColumn;
  readonly seriesType: string = SeriesTypeEnum.rangeColumn;
}

export const registerRangeColumnChart = () => {
  registerRangeColumnSeries();
  Factory.registerChart(RangeColumnChart.type, RangeColumnChart);
};
