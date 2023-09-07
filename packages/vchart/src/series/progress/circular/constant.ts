import { MarkTypeEnum } from '../../../mark/interface';
import { baseSeriesMark } from '../../base/constant';
import type { SeriesMarkMap } from '../../interface/common';
import { SeriesMarkNameEnum } from '../../interface/type';

export const circularProgressSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.track]: { name: SeriesMarkNameEnum.track, type: MarkTypeEnum.progressArc },
  [SeriesMarkNameEnum.progress]: { name: SeriesMarkNameEnum.progress, type: MarkTypeEnum.progressArc }
};
