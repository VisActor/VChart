import type { ICartesianAxisCommonSpec } from '../../component/axis/cartesian/interface';
import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { setDefaultCrosshairForChart } from '../util';

class BaseHistogramChart extends CartesianChart {
  transformSpec(spec: any): void {
    super.transformSpec(spec);
    spec.axes.forEach((axis: ICartesianAxisCommonSpec) => (axis.type = 'linear'));
  }

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      x2Field: spec?.x2Field,
      y2Field: spec?.y2Field
    };
  }
}

export class HistogramChart extends BaseHistogramChart {
  static readonly type: string = ChartTypeEnum.histogram;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.histogram;
  readonly seriesType: string = SeriesTypeEnum.bar;

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForChart(spec);
  }
}

export class Histogram3dChart extends BaseHistogramChart {
  static readonly type: string = ChartTypeEnum.histogram3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.histogram3d;
  readonly seriesType: string = SeriesTypeEnum.bar3d;
}
