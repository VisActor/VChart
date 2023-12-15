import { SeriesMarkNameEnum } from '../interface';
import { LineLikeSeriesSpecTransformer } from '../mixin/spec-transformer';
import type { AreaSeries } from './area';
import type { IAreaSeriesSpec, IAreaSeriesTheme } from './interface';

export class AreaSeriesSpecTransformer<
  T extends IAreaSeriesSpec = IAreaSeriesSpec,
  K extends IAreaSeriesTheme = IAreaSeriesTheme
> extends LineLikeSeriesSpecTransformer<T, K> {
  protected _transformLabelSpec(spec: T): void {
    this._addMarkLabelSpec<AreaSeries>(
      spec,
      SeriesMarkNameEnum.area,
      'areaLabel' as any,
      'initLineLabelMarkStyle',
      undefined,
      true
    );
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.area);
  }
}
