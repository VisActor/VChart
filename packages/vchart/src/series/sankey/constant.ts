import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const sankeySeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.node]: { name: SeriesMarkNameEnum.node, type: MarkTypeEnum.rect },
  [SeriesMarkNameEnum.link]: { name: SeriesMarkNameEnum.link, type: MarkTypeEnum.linkPath }
};
