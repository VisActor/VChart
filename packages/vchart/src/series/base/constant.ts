import { MarkTypeEnum } from '../../mark/interface/type';
import { SeriesMarkNameEnum } from '../interface/type';
import type { SeriesMarkMap } from '../interface/common';

export const baseSeriesMark: SeriesMarkMap = {
  [SeriesMarkNameEnum.label]: { name: SeriesMarkNameEnum.label, type: MarkTypeEnum.text }
};
