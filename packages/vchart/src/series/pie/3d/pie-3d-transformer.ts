import type { IPie3dSeriesSpec, IPie3dSeriesTheme } from '../interface';
import { SeriesMarkNameEnum } from '../../interface';
import { PieSeriesSpecTransformer } from '../pie-transformer';

export class Pie3dSeriesSpecTransformer<
  T extends IPie3dSeriesSpec = IPie3dSeriesSpec,
  K extends IPie3dSeriesTheme = IPie3dSeriesTheme
> extends PieSeriesSpecTransformer<T, K> {
  protected _transformLabelSpec(spec: T): void {
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.pie3d);
  }
}
