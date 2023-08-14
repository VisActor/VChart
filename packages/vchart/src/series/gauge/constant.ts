import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const gaugeSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.segment]: { name: SeriesMarkNameEnum.segment, type: MarkTypeEnum.progressArc },
  [SeriesMarkNameEnum.track]: { name: SeriesMarkNameEnum.track, type: MarkTypeEnum.progressArc }
};

export const gaugePointerSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.pin]: { name: SeriesMarkNameEnum.pin, type: MarkTypeEnum.path },
  [SeriesMarkNameEnum.pinBackground]: { name: SeriesMarkNameEnum.pinBackground, type: MarkTypeEnum.path },
  [SeriesMarkNameEnum.pointer]: { name: SeriesMarkNameEnum.pointer, type: [MarkTypeEnum.path, MarkTypeEnum.rect] }
};
