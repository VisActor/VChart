import type { IPointLike } from '@visactor/vutils';
import type { IComponent } from '../../../interface';
import type { IDataPointSpec, IMarkerSpec, IMarkerSymbol } from '../../interface';
import type { IMarkPointTheme } from './theme';

export type IMarkPoint = IComponent;

export type IMarkPointSpec = IMarkerSpec &
  (
    | IMarkPointCoordinateSpec // 标注目标：数据元素
    | IMarkPointPositionsSpec
  ) &
  IMarkPointTheme<IMarkerSymbol>; // 标注目标：任意位置

export type IMarkPointCoordinateSpec = {
  /**
   * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
   */
  coordinates: IDataPointSpec;
  /**
   * 被标注数据关联的series
   */
  relativeRelativeSeriesIndex?: number;
  relativeRelativeSeriesId?: string;
};

/**
 * 指定坐标点的参考线。基于指定坐标进行参考线的绘制
 */
export type IMarkPointPositionsSpec = {
  position: IPointLike;
};
