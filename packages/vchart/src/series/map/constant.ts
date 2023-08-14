import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const mapSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.area]: { name: SeriesMarkNameEnum.area, type: MarkTypeEnum.path }
};
