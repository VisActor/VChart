import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import type { SeriesMarkMap } from '../interface/common';
import { SeriesMarkNameEnum } from '../interface/type';

export const scatterSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.point]: { name: SeriesMarkNameEnum.point, type: MarkTypeEnum.symbol }
};
