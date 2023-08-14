import { MarkTypeEnum } from '../../../mark/interface';
import { baseSeriesMark } from '../../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../../interface/common';

export const circularProgressSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.track]: { name: SeriesMarkNameEnum.track, type: MarkTypeEnum.progressArc },
  [SeriesMarkNameEnum.progress]: { name: SeriesMarkNameEnum.progress, type: MarkTypeEnum.progressArc }
};
