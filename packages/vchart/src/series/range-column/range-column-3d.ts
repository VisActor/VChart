import { MarkTypeEnum } from '../../mark/interface';
import type { SeriesMarkMap } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { RangeColumnSeries } from './range-column';
import { VChart } from '../../core/vchart';
import { Rect3dMark } from '../../mark/rect-3d';
import type { AdaptiveSpec } from '../../typings';
import type { IRangeColumn3dSeriesSpec } from './interface';
import { rangeColumn3dSeriesMark } from './constant';

VChart.useMark([Rect3dMark]);

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
