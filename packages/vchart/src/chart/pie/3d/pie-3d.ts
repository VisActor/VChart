import { registerPie3dSeries } from '../../../series/pie/3d/pie-3d';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../../../series/interface/type';
import { ChartTypeEnum } from '../../interface/type';
import { BasePieChart } from '../base/base';
import { Factory } from '../../../core/factory';
import type { IPie3dChartSpec } from '../interface';
import type { AdaptiveSpec, ISeriesSpec } from '../../../typings';
import { BasePieChartSpecTransformer } from '../base';

export class Pie3dChartSpecTransformer<T extends IPie3dChartSpec = IPie3dChartSpec> extends BasePieChartSpecTransformer<
  AdaptiveSpec<T, 'type'>
> {
  transformSpec(spec: any): void {
    super.transformSpec(spec);
    spec.series.forEach((s: ISeriesSpec) => {
      if (s.type === 'pie3d') {
        (s as any).angle3d = spec.angle3d;
      }
    });
  }
}

export class Pie3dChart<T extends IPie3dChartSpec = IPie3dChartSpec> extends BasePieChart<AdaptiveSpec<T, 'type'>> {
  static readonly type: string = ChartTypeEnum.pie3d;
  static readonly seriesType: string = SeriesTypeEnum.pie3d;
  static readonly transformerConstructor = Pie3dChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = Pie3dChartSpecTransformer;
  readonly type: string = ChartTypeEnum.pie3d;
  readonly seriesType: string = SeriesTypeEnum.pie3d;
}

export const registerPie3dChart = () => {
  registerPie3dSeries();
  Factory.registerChart(Pie3dChart.type, Pie3dChart);
};
