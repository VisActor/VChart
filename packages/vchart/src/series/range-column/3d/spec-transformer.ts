import type { IRangeColumn3dSeriesSpec, IRangeColumnSeriesTheme } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { PositionEnum } from '../interface';
import { SeriesMarkNameEnum } from '../../interface';
import { RangeColumnSeriesSpecTransformer } from '../spec-transformer';

export class RangeColumn3dSeriesSpecTransformer<
  T extends IRangeColumn3dSeriesSpec = IRangeColumn3dSeriesSpec,
  K extends IRangeColumnSeriesTheme = IRangeColumnSeriesTheme
> extends RangeColumnSeriesSpecTransformer<any, K> {
  protected _transformLabelSpec(spec: T): void {
    const labelPosition = spec.label?.position;
    if (labelPosition !== PositionEnum.bothEnd) {
      this._addMarkLabelSpec(spec, SeriesMarkNameEnum.bar3d);
    }
  }
}
