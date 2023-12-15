import { BaseSeriesSpecTransformer } from '../base';
import { SeriesMarkNameEnum } from '../interface';
import type { ICorrelationSeriesSpec, ICorrelationSeriesTheme } from './interface';

export class CorrelationSeriesSpecTransformer<
  T extends ICorrelationSeriesSpec = ICorrelationSeriesSpec,
  K extends ICorrelationSeriesTheme = ICorrelationSeriesTheme
> extends BaseSeriesSpecTransformer<T, K> {
  protected _transformLabelSpec(spec: T): void {
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.nodePoint);
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.centerPoint, 'centerLabel' as any);
  }

  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T> {
    const { outerRadius, innerRadius } = chartSpec;
    return { outerRadius, innerRadius } as Partial<T>;
  }
}
