import { BaseSeriesSpecTransformer } from '../base';
import { SeriesMarkNameEnum } from '../interface';
import type { AreaSeries } from './area';
import type { IAreaSeriesSpec, IAreaSeriesTheme } from './interface';

export class AreaSeriesSpecTransformer<
  T extends IAreaSeriesSpec = IAreaSeriesSpec,
  K extends IAreaSeriesTheme = IAreaSeriesTheme
> extends BaseSeriesSpecTransformer<T, K> {
  protected _transformLabelSpec(spec: T): void {
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
