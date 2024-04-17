import type { ISeriesSpec } from '../../typings';
import { BaseSeriesSpecTransformer } from '../base';
import { SeriesMarkNameEnum } from '../interface';
import type { IVennSeriesSpec, ITreemapSeriesTheme } from './interface';

export class VennSeriesSpecTransformer<
  T extends ISeriesSpec = Omit<IVennSeriesSpec, 'data'>,
  K extends ITreemapSeriesTheme = ITreemapSeriesTheme
> extends BaseSeriesSpecTransformer<T, K> {
  /*
  protected _transformLabelSpec(spec: T): void {
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.circle, 'nonLeafLabel' as any, 'initNonLeafLabelMarkStyle' as any);
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.leaf);
  }
  */
}
