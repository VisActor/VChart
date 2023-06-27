import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { setDefaultCrosshairForChart } from '../util';
import type { ILineChartSpec } from './interface';

export class LineChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.line;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.line;
  readonly seriesType: string = SeriesTypeEnum.line;

  protected _getDefaultSeriesSpec(spec: ILineChartSpec): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      invalidType: spec.invalidType || 'break',
      point: spec.point,
      line: spec.line
    };
  }
  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForChart(spec);
  }
}
