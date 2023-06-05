import type { IChartSpec, ISeriesSpec } from '../../typings/spec/common';
import type { ICartesianAxisSpec } from '../../component/axis/cartesian/interface';
import type { IDataZoomSpec, IScrollBarSpec } from '../../component/data-zoom';
import type { ICartesianCrosshairSpec } from '../../component/crosshair/interface';
import type { ILayoutSpec } from '../../layout/interface';
import type { IRegionSpec } from '../../region/interface';
import type { IPadding } from '../../typings';

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

  region?: IRegionSpec[];
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
