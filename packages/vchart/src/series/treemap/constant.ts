import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const treemapSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.nonLeaf]: { name: SeriesMarkNameEnum.nonLeaf, type: MarkTypeEnum.rect },
  [SeriesMarkNameEnum.leaf]: { name: SeriesMarkNameEnum.leaf, type: MarkTypeEnum.rect },
  [SeriesMarkNameEnum.nonLeafLabel]: { name: SeriesMarkNameEnum.nonLeafLabel, type: MarkTypeEnum.text }
};
