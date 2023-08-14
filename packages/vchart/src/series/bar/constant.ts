import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const barSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.bar]: { name: SeriesMarkNameEnum.bar, type: MarkTypeEnum.rect }
};

export const bar3dSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.bar3d]: { name: SeriesMarkNameEnum.bar3d, type: MarkTypeEnum.rect3d }
};
