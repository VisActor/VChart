import type { IComponent } from '../../../interface';
import type {
  IMarkerPositionsSpec,
  IDataPointSpec,
  IDataPos,
  IMarkerSpec,
  IDataPosCallback,
  IMarkerCrossSeriesSpec,
  OffsetPoint
} from '../../interface';
import type { IMarkAreaTheme } from './theme';

export type IMarkArea = IComponent;

export type IRegressType = 'regression';

export type IMarkAreaSpec = IMarkerSpec &
  (
    | IMarkAreaXSpec // 标注目标：笛卡尔坐标系坐标空间
    | IMarkAreaYSpec // 标注目标：笛卡尔坐标系坐标空间
    | IMarkAreaXYSpec // 标注目标：笛卡尔坐标系坐标空间
    | IMarkAreaCoordinateSpec // 标注目标：数据元素
    | IMarkerPositionsSpec
  ) &
  IMarkAreaTheme; // 标注目标：任意位置

export interface IMarkAreaXSpec extends IMarkerCrossSeriesSpec {
  /**
   * x轴上的参考线。可以配置参考线在x轴上的值，或者聚合计算类型
   * 可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处
   */
  x: IDataPos | IDataPosCallback;
  x1: IDataPos | IDataPosCallback;
}

export interface IMarkAreaYSpec extends IMarkerCrossSeriesSpec {
  /**
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型
   * 可以将 y 配置为 '15%' 百分比的形式，用于表示将 y 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处
   */
  y: IDataPos | IDataPosCallback;
  y1: IDataPos | IDataPosCallback;
}

export interface IMarkAreaXYSpec extends IMarkerCrossSeriesSpec {
  /**
   * x轴上的参考线。可以配置参考线在x轴上的值，或者聚合计算类型
   * 可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处
   */
  x: IDataPos | IDataPosCallback;
  x1: IDataPos | IDataPosCallback;
  /**
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型
   * 可以将 y 配置为 '15%' 百分比的形式，用于表示将 y 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处
   */
  y: IDataPos | IDataPosCallback;
  y1: IDataPos | IDataPosCallback;
}

export type IMarkAreaCoordinateSpec = {
  /**
   * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
   */
  coordinates: IDataPointSpec[];

  /**
   * 对每个数据点转化后的画布坐标点进行偏移，该偏移值可以是像素值，也可以是 string 类型，如 '20%' 代表百分比
   * 每个元素对应一个坐标点的偏移量
   * @since 1.7.3
   */
  coordinatesOffset?: OffsetPoint[];
};
