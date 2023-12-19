import { BarSeriesSpecTransformer } from '../bar/bar-transformer';
import { SeriesMarkNameEnum } from '../interface';
import { PositionEnum, type IRangeColumnSeriesSpec, type IRangeColumnSeriesTheme } from './interface';

export class RangeColumnSeriesSpecTransformer<
  T extends IRangeColumnSeriesSpec = IRangeColumnSeriesSpec,
  K extends IRangeColumnSeriesTheme = IRangeColumnSeriesTheme
> extends BarSeriesSpecTransformer<any, K> {
  protected _transformLabelSpec(spec: T): void {
    const labelPosition = spec.label?.position;
    if (labelPosition !== PositionEnum.bothEnd) {
      this._addMarkLabelSpec(spec, SeriesMarkNameEnum.bar);
    }
  }
}
