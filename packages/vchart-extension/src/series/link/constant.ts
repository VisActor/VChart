import { PREFIX, MarkTypeEnum, baseSeriesMark, SeriesMarkNameEnum, type SeriesMarkMap } from '@visactor/vchart';

export const linkSeriesMark: SeriesMarkMap = {
  ...baseSeriesMark,
  [SeriesMarkNameEnum.group]: { name: SeriesMarkNameEnum.group, type: MarkTypeEnum.group },
  [SeriesMarkNameEnum.link]: { name: SeriesMarkNameEnum.link, type: [MarkTypeEnum.rule, MarkTypeEnum.path] },
  [SeriesMarkNameEnum.arrow]: { name: SeriesMarkNameEnum.arrow, type: MarkTypeEnum.symbol },
  [SeriesMarkNameEnum.imageLabel]: { name: SeriesMarkNameEnum.imageLabel, type: MarkTypeEnum.image }
};

// 当前数据集中相同端点连接的曲线序号，由 linkDotInfo 转换生成。
export const DEFAULT_LINK_CURVE_INDEX = `${PREFIX}_LINK_CURVE_INDEX`;
