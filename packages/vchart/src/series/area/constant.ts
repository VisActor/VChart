import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';
import { lineLikeSeriesMark } from '../mixin/line-mixin';

export const areaSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  ...lineLikeSeriesMark,
  [SeriesMarkNameEnum.area]: { name: SeriesMarkNameEnum.area, type: MarkTypeEnum.area }
};
