import { SeriesMarkNameEnum } from '../interface';
import { LineLikeSeriesSpecTransformer } from '../mixin/line-mixin-transformer';
import type { AreaSeries } from './area';
import type { IAreaSeriesSpec, IAreaSeriesTheme } from './interface';

export class AreaSeriesSpecTransformer<
  T extends IAreaSeriesSpec = IAreaSeriesSpec,
  K extends IAreaSeriesTheme = IAreaSeriesTheme
> extends LineLikeSeriesSpecTransformer<T, K> {
  protected _transformLabelSpec(spec: T): void {
    super._transformLabelSpec(spec);
    this._addMarkLabelSpec<AreaSeries>(
      spec,
      SeriesMarkNameEnum.area,
      'areaLabel' as any,
      'initLineLabelMarkStyle',
      undefined,
      true
    );
    const isPointVisible = spec.point?.visible !== false && spec.point?.style?.visible !== false;
    if (!isPointVisible) {
      this._addMarkLabelSpec(spec, SeriesMarkNameEnum.area);
    }
  }
}
