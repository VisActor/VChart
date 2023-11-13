import { registerPie3dSeries } from '../../series/pie/pie-3d';
import type { ISeries } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BasePieChart } from './base';
import { Factory } from '../../core/factory';

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
export const registerPie3dChart = () => {
  registerPie3dSeries();
  Factory.registerChart(Pie3dChart.type, Pie3dChart);
};
