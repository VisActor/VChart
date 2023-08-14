import { MarkTypeEnum } from '../../mark/interface';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const baseSeriesMark: SeriesMarkMap = {
  [SeriesMarkNameEnum.label]: { name: SeriesMarkNameEnum.label, type: MarkTypeEnum.text }
};
