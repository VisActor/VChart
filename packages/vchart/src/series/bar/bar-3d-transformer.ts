import type { IBar3dSeriesSpec, IBar3dSeriesTheme } from './interface';
import { SeriesMarkNameEnum } from '../interface';
import { BarSeriesSpecTransformer } from './bar-transformer';

export class Bar3dSeriesSpecTransformer<
  T extends IBar3dSeriesSpec = IBar3dSeriesSpec,
  K extends IBar3dSeriesTheme = IBar3dSeriesTheme
  // @ts-ignore
> extends BarSeriesSpecTransformer<T, K> {
  protected _transformLabelSpec(spec: T): void {
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.bar3d);
  }
}
