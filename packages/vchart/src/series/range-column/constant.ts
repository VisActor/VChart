import { MarkTypeEnum } from '../../mark/interface';
import { bar3dSeriesMark, barSeriesMark } from '../bar/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const rangeColumnSeriesMark: SeriesMarkMap = {
  ...barSeriesMark,
  [SeriesMarkNameEnum.minLabel]: { name: SeriesMarkNameEnum.minLabel, type: MarkTypeEnum.text },
  [SeriesMarkNameEnum.maxLabel]: { name: SeriesMarkNameEnum.maxLabel, type: MarkTypeEnum.text }
};

export const rangeColumn3dSeriesMark: SeriesMarkMap = {
  ...bar3dSeriesMark,
  [SeriesMarkNameEnum.minLabel]: { name: SeriesMarkNameEnum.minLabel, type: MarkTypeEnum.text },
  [SeriesMarkNameEnum.maxLabel]: { name: SeriesMarkNameEnum.maxLabel, type: MarkTypeEnum.text }
};
