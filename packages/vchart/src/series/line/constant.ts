import { baseSeriesMark } from '../base/constant';
import { type SeriesMarkMap } from '../interface/common';
import { lineLikeSeriesMark } from '../mixin/line-mixin';

export const lineSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  ...lineLikeSeriesMark
};
