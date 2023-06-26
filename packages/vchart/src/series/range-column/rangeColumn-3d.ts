import { MarkTypeEnum } from '../../mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { RangeColumnSeries } from './rangeColumn';
import { VChart } from '../../core/vchart';
import { Rect3dMark } from '../../mark/rect-3d';

VChart.useMark([Rect3dMark]);

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class RangeColumn3dSeries extends RangeColumnSeries {
  static readonly type: string = SeriesTypeEnum.rangeColumn3d;
  type = SeriesTypeEnum.rangeColumn3d;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect3d;
  protected _barName: string = SeriesTypeEnum.bar3d;
}
