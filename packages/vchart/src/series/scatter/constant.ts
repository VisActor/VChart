import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const scatterSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.point]: { name: SeriesMarkNameEnum.point, type: MarkTypeEnum.symbol }
};
