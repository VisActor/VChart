import type { AdaptiveSpec, ISeriesSpec } from '@visactor/vchart';
import { BasePieChartSpecTransformer } from '@visactor/vchart';
import type { IPie3dChartSpec } from './interface';

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
