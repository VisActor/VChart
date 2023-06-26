import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { VChart } from '../../core/vchart';
import { Bar3dSeries } from '../../series';
VChart.useSeries([Bar3dSeries]);

export class Bar3dChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.bar3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.bar3d;
  readonly seriesType: string = SeriesTypeEnum.bar3d;
}
