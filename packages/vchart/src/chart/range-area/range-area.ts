import { CartesianChart, CartesianChartSpecTransformer } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import { Direction } from '../../typings';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { registerRangeAreaSeries } from '../../series/range-area/range-area';
import { Factory } from '../../core/factory';
import type { IRangeAreaChartSpec } from './interface';

export class RangeAreaChartSpecTransformer<
  T extends IRangeAreaChartSpec = IRangeAreaChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
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

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export class RangeAreaChart<T extends IRangeAreaChartSpec = IRangeAreaChartSpec> extends CartesianChart<T> {
  static readonly type: string = ChartTypeEnum.rangeArea;
  static readonly seriesType: string = SeriesTypeEnum.rangeArea;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = RangeAreaChartSpecTransformer;
  readonly transformerConstructor = RangeAreaChartSpecTransformer;
  readonly type: string = ChartTypeEnum.rangeArea;
  readonly seriesType: string = SeriesTypeEnum.rangeArea;
}

export const registerRangeAreaChart = () => {
  registerRangeAreaSeries();
  Factory.registerChart(RangeAreaChart.type, RangeAreaChart);
};
