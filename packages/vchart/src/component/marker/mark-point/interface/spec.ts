import type { IPoint } from '../../../../typings';
import type { IComponent } from '../../../interface';
import type {
  IDataPointSpec,
  IDataPos,
  IDataPosCallback,
  IMarkerAxisSpec,
  IMarkerSpec,
  IMarkerSymbol,
  MarkerPositionPoint
} from '../../interface';
import type { IMarkPointTheme } from './theme';

export type IMarkPoint = IComponent;

export type IMarkPointSpec = IMarkerSpec &
  (
    | IMarkPointXYSpec
    | IMarkPointCoordinateSpec // 标注目标：数据元素
    | IMarkPointPositionsSpec
  ) &
  IMarkPointTheme<IMarkerSymbol>; // 标注目标：任意位置

export type IMarkPointXYSpec = {
  /**
   * 参考点在 y 轴上位置，可以配置参考线在 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于  region 纵轴（从上到下）的百分之 15 位置处。
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 参考点在 x 轴的起点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 被标注数据关联的series
   */
  relativeRelativeSeriesIndex?: number;
};

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
  position: MarkerPositionPoint;
  /**
   * 是否为相对 region 的坐标，默认为 false，即相对画布的坐标
   * @default false
   * @since 1.7.0
   */
  regionRelative?: boolean;
};
