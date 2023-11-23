import type { IPointLike } from '@visactor/vutils';
import type { IComponent } from '../../../interface';
import type { IDataPointSpec, IMarkerSpec, OffsetPoint } from '../../interface';
import type { IMarkPointTheme } from './theme';

export type IMarkPoint = IComponent;

export type IMarkPointSpec = IMarkerSpec &
  (
    | IMarkPointCoordinateSpec // 标注目标：数据元素
    | IMarkPointPositionsSpec
  ) &
  IMarkPointTheme; // 标注目标：任意位置

export type IMarkPointCoordinateSpec = {
  /**
   * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
   */
  coordinates: IDataPointSpec;
  /**
   * 对每个数据点转化后的画布坐标点进行偏移，该偏移值可以是像素值，也可以是 string 类型，如 '20%' 代表百分比
   * 每个元素对应一个坐标点的偏移量
   */
  coordinatesOffset?: OffsetPoint;
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
  /**
   * TODO：修改版本
   * 是否为相对 region 的坐标，默认为 false，即相对画布的坐标
   * @default false
   * @since 1.6.0
   */
  regionRelative?: boolean;
};
