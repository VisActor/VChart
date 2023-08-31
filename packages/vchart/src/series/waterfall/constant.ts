import { MarkTypeEnum } from '../../mark/interface';
import { barSeriesMark } from '../bar/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const waterfallSeriesMark: SeriesMarkMap = {
  ...barSeriesMark,
  [SeriesMarkNameEnum.leaderLine]: { name: SeriesMarkNameEnum.leaderLine, type: MarkTypeEnum.rule },
  [SeriesMarkNameEnum.stackLabel]: { name: SeriesMarkNameEnum.stackLabel, type: MarkTypeEnum.text }
};
