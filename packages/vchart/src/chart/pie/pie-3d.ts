import type { ISeries } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
import { BasePieChart } from './base';
import { VChart } from '../../core/vchart';
import { Pie3dSeries } from '../../series';
VChart.useSeries([Pie3dSeries]);

export class Pie3dChart extends BasePieChart {
  static readonly type: string = ChartTypeEnum.pie3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.pie3d;
  readonly seriesType: string = SeriesTypeEnum.pie3d;

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    spec.series.forEach((s: ISeries) => {
      if (s.type === 'pie3d') {
        (s as any).angle3d = spec.angle3d;
      }
    });
  }
}
