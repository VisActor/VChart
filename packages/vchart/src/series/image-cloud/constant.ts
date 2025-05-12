import { MarkTypeEnum } from '../../mark/interface/type';
import { baseSeriesMark } from '../base/constant';
import type { SeriesMarkMap } from '../interface/common';
import { SeriesMarkNameEnum } from '../interface/type';

export const imageCloudSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.image]: { name: SeriesMarkNameEnum.image, type: MarkTypeEnum.image },
  [SeriesMarkNameEnum.imageMask]: { name: SeriesMarkNameEnum.imageMask, type: MarkTypeEnum.rect }
};
