import type { IComponent } from '../../../interface';
import type {
  IMarkerPositionsSpec,
  IDataPointSpec,
  IDataPos,
  IMarkerSpec,
  IMarkerAxisSpec,
  IDataPosCallback
} from '../../interface';
import type { IMarkAreaTheme } from './theme';

export type IMarkArea = IComponent;

export type IRegressType = 'regression';

export type IMarkAreaSpec = IMarkerSpec &
  (
    | IMarkAreaXSpec // 标注目标：笛卡尔坐标系坐标空间
    | IMarkAreaYSpec // 标注目标：笛卡尔坐标系坐标空间
    | (IMarkAreaXSpec & IMarkAreaYSpec)
    // | IMarkAreaAngleSpec // TODO: 标注目标：极坐标系坐标空间
    // | IMarkAreaRadiusSpec // TODO: 标注目标：极坐标系坐标空间
    | IMarkAreaCoordinateSpec // 标注目标：数据元素
    | IMarkAreaPositionsSpec
  ) &
  IMarkAreaTheme; // 标注目标：任意位置

export interface IMarkAreaXSpec extends IMarkerAxisSpec {
  /**
   * x轴上的参考线。可以配置参考线在x轴上的值，或者聚合计算类型
   * 可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处
   */
  x: IDataPos | IDataPosCallback;
  x1: IDataPos | IDataPosCallback;
}

export interface IMarkAreaYSpec extends IMarkerAxisSpec {
  /**
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型
   * 可以将 y 配置为 '15%' 百分比的形式，用于表示将 y 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处
   */
  y: IDataPos | IDataPosCallback;
  y1: IDataPos | IDataPosCallback;
}

export interface IMarkAreaAngleSpec extends IMarkerAxisSpec {
  /**
   * todo: angle轴上的参考线。可以配置参考线在angle轴上的值，或者聚合计算类型
   */
  startAngle: IDataPos | IDataPosCallback;
  endAngle: IDataPos | IDataPosCallback;
}

export interface IMarkAreaRadiusSpec extends IMarkerAxisSpec {
  /**
   * todo: radius轴上的参考线。可以配置参考线在radius轴上的值，或者聚合计算类型
   */
  startRadius: IDataPos | IDataPosCallback;
  endRadius: IDataPos | IDataPosCallback;
}

export type IMarkAreaCoordinateSpec = {
  /**
   * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
   */
  coordinates: IDataPointSpec[];
};

/**
 * 指定坐标点的参考线。基于指定坐标进行参考线的绘制
 */
export type IMarkAreaPositionsSpec = IMarkerPositionsSpec;
