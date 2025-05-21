import { baseSeriesMark, MarkTypeEnum, SeriesMarkNameEnum } from '@visactor/vchart';
import { MarkType3dEnum, SeriesMark3dNameEnum } from '../3d/enum';

export const pie3dSeriesMark = {
  ...baseSeriesMark,
  [SeriesMark3dNameEnum.pie3d]: { name: SeriesMark3dNameEnum.pie3d, type: MarkType3dEnum.arc3d },
  [SeriesMarkNameEnum.labelLine]: { name: SeriesMarkNameEnum.labelLine, type: MarkTypeEnum.path }
};
