import { BaseSeriesSpecTransformer } from '../base';
import { SeriesMarkNameEnum } from '../interface';
import type { IGaugeSeriesSpec, IGaugeSeriesTheme } from './interface';

export class GaugeSeriesSpecTransformer<
  T extends IGaugeSeriesSpec = IGaugeSeriesSpec,
  K extends IGaugeSeriesTheme = IGaugeSeriesTheme
> extends BaseSeriesSpecTransformer<T, K> {
  protected _transformLabelSpec(spec: T): void {
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.segment);
  }

  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T> {
    const { outerRadius, innerRadius } = chartSpec;
    return { outerRadius, innerRadius } as Partial<T>;
  }
}