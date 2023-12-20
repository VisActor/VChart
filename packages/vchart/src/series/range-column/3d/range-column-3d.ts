import { MarkTypeEnum } from '../../../mark/interface/type';
import type { SeriesMarkMap } from '../../interface';
import { SeriesTypeEnum } from '../../interface/type';
import { RangeColumnSeries } from '../range-column';
import { registerRect3dMark } from '../../../mark/rect-3d';
import type { AdaptiveSpec } from '../../../typings';
import type { IRangeColumn3dSeriesSpec } from '../interface';
import { rangeColumn3dSeriesMark } from '../constant';
import { Factory } from '../../../core/factory';

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class RangeColumn3dSeries<
  T extends IRangeColumn3dSeriesSpec = IRangeColumn3dSeriesSpec
> extends RangeColumnSeries<AdaptiveSpec<T, 'type'>> {
  static readonly type: string = SeriesTypeEnum.rangeColumn3d;
  type = SeriesTypeEnum.rangeColumn3d;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect3d;
  protected _barName: string = SeriesTypeEnum.bar3d;
  static readonly mark: SeriesMarkMap = rangeColumn3dSeriesMark;
}

export const registerRangeColumn3dSeries = () => {
  registerRect3dMark();
  Factory.registerSeries(RangeColumn3dSeries.type, RangeColumn3dSeries);
};
