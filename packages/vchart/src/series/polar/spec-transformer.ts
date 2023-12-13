import { BaseSeriesSpecTransformer } from '../base';
import type { IPolarSeriesSpec } from './interface';

export class PolarSeriesSpecTransformer<
  T extends IPolarSeriesSpec = IPolarSeriesSpec
> extends BaseSeriesSpecTransformer<T> {
  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T> {
    const { outerRadius, innerRadius } = chartSpec;
    return { outerRadius, innerRadius } as Partial<T>;
  }
}
