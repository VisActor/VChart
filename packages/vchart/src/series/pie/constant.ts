import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const pieSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.pie]: { name: SeriesMarkNameEnum.pie, type: MarkTypeEnum.arc },
  [SeriesMarkNameEnum.labelLine]: { name: SeriesMarkNameEnum.labelLine, type: MarkTypeEnum.path }
};

export const pie3dSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.pie3d]: { name: SeriesMarkNameEnum.pie3d, type: MarkTypeEnum.arc3d },
  [SeriesMarkNameEnum.labelLine]: { name: SeriesMarkNameEnum.labelLine, type: MarkTypeEnum.path }
};
