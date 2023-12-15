import type { AdaptiveSpec } from '../../../typings';
import { SeriesMarkNameEnum } from '../../interface';
import type { IFunnel3dSeriesSpec, IFunnel3dSeriesTheme } from '../interface';
import { FunnelSeriesSpecTransformer } from '../spec-transformer';

export class Funnel3dSeriesSpecTransformer<
  T extends IFunnel3dSeriesSpec = IFunnel3dSeriesSpec,
  K extends IFunnel3dSeriesTheme = IFunnel3dSeriesTheme
> extends FunnelSeriesSpecTransformer<AdaptiveSpec<T, 'type'>, K> {
  protected _transformLabelSpec(spec: AdaptiveSpec<T, 'type'>): void {
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.funnel3d);
    if (spec.isTransform) {
      this._addMarkLabelSpec(spec, SeriesMarkNameEnum.transform3d, 'transformLabel' as any);
    }
  }
}
