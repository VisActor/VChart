import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const wordCloudSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.word]: { name: SeriesMarkNameEnum.word, type: MarkTypeEnum.text },
  [SeriesMarkNameEnum.fillingWord]: { name: SeriesMarkNameEnum.fillingWord, type: MarkTypeEnum.text }
};
