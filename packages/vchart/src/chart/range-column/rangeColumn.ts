import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { SeriesTypeEnum } from '../../series/interface';
import { Direction } from '../../typings';
import { setDefaultCrosshairForChart } from '../util';

export class RangeColumnChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.rangeColumn;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.rangeColumn;
  readonly seriesType: string = SeriesTypeEnum.rangeColumn;

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec)
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
    setDefaultCrosshairForChart(spec);
  }
}

export class RangeColumn3dChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.rangeColumn3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.rangeColumn3d;
  readonly seriesType: string = SeriesTypeEnum.rangeColumn3d;

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec)
    };
    series.bar3d = spec.bar3d;
    if (spec.direction === Direction.horizontal) {
      series.xField = spec.xField ?? [spec.minField, spec.maxField];
    } else {
      series.yField = spec.yField ?? [spec.minField, spec.maxField];
    }
    return series;
  }
}
