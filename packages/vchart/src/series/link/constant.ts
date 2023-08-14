import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const linkSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.group]: { name: SeriesMarkNameEnum.group, type: MarkTypeEnum.group },
  [SeriesMarkNameEnum.link]: { name: SeriesMarkNameEnum.link, type: MarkTypeEnum.rule },
  [SeriesMarkNameEnum.arrow]: { name: SeriesMarkNameEnum.arrow, type: MarkTypeEnum.symbol }
};
