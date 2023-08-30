import { MarkTypeEnum } from '../../mark/interface';
import { baseSeriesMark } from '../base/constant';
import { SeriesMarkNameEnum, type SeriesMarkMap } from '../interface/common';

export const boxPlotSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.boxPlot]: { name: SeriesMarkNameEnum.boxPlot, type: MarkTypeEnum.boxPlot },
  [SeriesMarkNameEnum.outlier]: { name: SeriesMarkNameEnum.outlier, type: MarkTypeEnum.symbol }
};
