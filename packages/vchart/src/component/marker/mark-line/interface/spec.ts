import type { IComponent } from '../../../interface';
// eslint-disable-next-line max-len
import type {
  IAggrType,
  IMarkerPositionsSpec,
  IDataPointSpec,
  IMarkerSpec,
  IMarkerAxisSpec,
  IDataPos
} from '../../interface';
import type { IRegressType } from '../../mark-area/interface';
import type { IMarkLineTheme } from './theme';

export type IMarkLine = IComponent;

export type IMarkLineSpec = IMarkerSpec &
  (
    | IMarkLineXSpec // 标注目标：笛卡尔坐标系坐标空间
    | IMarkLineYSpec // 标注目标：笛卡尔坐标系坐标空间
    // | IMarkLineAngleSpec // TODO: 标注目标：极坐标系坐标空间
    // | IMarkLineRadiusSpec // TODO: 标注目标：极坐标系坐标空间
    | IMarkLineCoordinateSpec // 标注目标：数据元素
    | IMarkLinePositionsSpec
  ) &
  IMarkLineTheme; // 标注目标：任意位置

export interface IMarkLineXSpec extends IMarkerAxisSpec {
  /**
   * x轴上的参考线。可以配置参考线在x轴上的值，或者聚合计算类型
   */
  x: IDataPos;
}

export interface IMarkLineYSpec extends IMarkerAxisSpec {
  /**
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型
   */
  y: IDataPos;
}

export interface IMarkLineAngleSpec extends IMarkerAxisSpec {
  /**
   * todo: angle轴上的参考线。可以配置参考线在angle轴上的值，或者聚合计算类型
   */
  angle: IDataPos;
}

export interface IMarkLineRadiusSpec extends IMarkerAxisSpec {
  /**
   * todo: radius轴上的参考线。可以配置参考线在radius轴上的值，或者聚合计算类型
   */
  radius: IDataPos;
}

export type IMarkLineCoordinateSpec = {
  /**
   * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
   */
  coordinates: IDataPointSpec[];
  /**
   * 数据点的处理方法。 如果不配置则按照coordinate数组直接连接成line。
   */
  process?:
    | {
        x: IAggrType;
      }
    | {
        y: IAggrType;
      }
    | {
        xy: IRegressType; // FIXME: xy属性名称不太合理，可能需调整
      };
};
/**
 * 指定坐标点的参考线。基于指定坐标进行参考线的绘制
 */
export type IMarkLinePositionsSpec = IMarkerPositionsSpec;
