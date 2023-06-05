import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
import { PolarChart } from '../polar/polar';

class BasePieChart extends PolarChart {
  protected needAxes(): boolean {
    return false;
  }

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),

      // 兼容旧版写法
      categoryField: spec.categoryField || spec.seriesField,
      valueField: spec.valueField || spec.angleField,

      center: spec.center,
      centerOffset: spec.centerOffset,

      cornerRadius: spec.cornerRadius,

      padAngle: spec.padAngle
    };
  }
}

export class PieChart extends BasePieChart {
  static readonly type: string = ChartTypeEnum.pie;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.pie;
  readonly seriesType: string = SeriesTypeEnum.pie;
}

export class Pie3dChart extends BasePieChart {
  static readonly type: string = ChartTypeEnum.pie3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.pie3d;
  readonly seriesType: string = SeriesTypeEnum.pie3d;
}
