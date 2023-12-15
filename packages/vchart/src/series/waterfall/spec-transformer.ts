import { BarSeriesSpecTransformer } from '../bar/spec-transformer';
import { SeriesMarkNameEnum } from '../interface';
import type { IWaterfallSeriesSpec, IWaterfallSeriesTheme } from './interface';

export class WaterfallSeriesSpecTransformer<
  T extends IWaterfallSeriesSpec = IWaterfallSeriesSpec,
  K extends IWaterfallSeriesTheme = IWaterfallSeriesTheme
> extends BarSeriesSpecTransformer<any, K> {
  protected _transformLabelSpec(spec: T): void {
    this._addMarkLabelSpec(spec, SeriesMarkNameEnum.bar, 'stackLabel');
  }
}
