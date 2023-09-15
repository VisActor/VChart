import { MarkTypeEnum } from '../../../mark/interface';
import type { SeriesMarkMap } from '../../interface/common';
import { SeriesMarkNameEnum } from '../../interface/type';
import { progressLikeSeriesMark } from '../../polar/progress-like/constant';

export const circularProgressSeriesMark: SeriesMarkMap = {
  ...progressLikeSeriesMark,
  [SeriesMarkNameEnum.track]: { name: SeriesMarkNameEnum.track, type: MarkTypeEnum.progressArc },
  [SeriesMarkNameEnum.progress]: { name: SeriesMarkNameEnum.progress, type: MarkTypeEnum.progressArc }
};
