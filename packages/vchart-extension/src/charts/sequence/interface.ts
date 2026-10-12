import type {
  IChartSpec,
  ISeriesSpec,
  ICartesianAxisSpec,
  IDataZoomSpec,
  IScrollBarSpec,
  ICartesianCrosshairSpec,
  ILayoutSpec,
  RegionSpec,
  IPadding
} from '@visactor/vchart';

export interface ISequenceChartSpec extends IChartSpec {
  type: 'sequence';

  /** 可以为左边的title预留padding */
  appendPadding?: IPadding;

  /** 轴配置 */
  axes?: ICartesianAxisSpec[];
  /** 缩略轴配置 */
  dataZooms?: IDataZoomSpec[];
  /** 滚动条配置 */
  scrollBars?: IScrollBarSpec[];
  /** 十字辅助线配置 */
  crosshair?: ICartesianCrosshairSpec | ICartesianCrosshairSpec[];

  layout?: ILayoutSpec;

  region?: RegionSpec[];
}

export interface ISequenceSeriesSpec extends ISeriesSpec {
  // 以下属性仅支持sequence chart中的series
  height?: number;
  padding?: number;

  // 以下属性仅支持sequence chart中的link series
  dataDot?: any;
  dotSeriesIndex?: number;
  dotSeriesSpec?: ISeriesSpec;
}
