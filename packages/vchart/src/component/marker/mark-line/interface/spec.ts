import type { IComponent } from '../../../interface';
import type {
  IAggrType,
  IMarkerPositionsSpec,
  IDataPointSpec,
  IMarkerSpec,
  IMarkerAxisSpec,
  IDataPos,
  IDataPosCallback,
  IMarkerLabelSpec
} from '../../interface';
import type { IRegressType } from '../../mark-area/interface';
import type { IMarkLineTheme } from './theme';
import type { ILineMarkSpec } from '../../../../typings';
import type { IPointLike } from '@visactor/vutils';

export type IMarkLine = IComponent;

export type IMarkLineSpec =
  | (IMarkerSpec &
      (
        | IMarkLineXSpec // 标注目标：笛卡尔坐标系坐标空间
        | IMarkLineYSpec // 标注目标：笛卡尔坐标系坐标空间
        // | IMarkLineAngleSpec // TODO: 标注目标：极坐标系坐标空间
        // | IMarkLineRadiusSpec // TODO: 标注目标：极坐标系坐标空间
        | IMarkLineCoordinateSpec // 标注目标：数据元素
        | IMarkLinePositionsSpec
      ) &
      IMarkLineTheme)
  | IStepMarkLineSpec; // 标注目标：任意位置

export interface IMarkLineXSpec extends IMarkerAxisSpec {
  /**
   * x轴上的参考线。可以配置参考线在x轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处
   */
  x: IDataPos | IDataPosCallback;
}

export interface IMarkLineYSpec extends IMarkerAxisSpec {
  /**
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算
   * 可以将 y 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处
   */
  y: IDataPos | IDataPosCallback;
}

export interface IMarkLineAngleSpec extends IMarkerAxisSpec {
  /**
   * todo: angle轴上的参考线。可以配置参考线在angle轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算
   */
  angle: IDataPos | IDataPosCallback;
}

export interface IMarkLineRadiusSpec extends IMarkerAxisSpec {
  /**
   * todo: radius轴上的参考线。可以配置参考线在radius轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算
   */
  radius: IDataPos | IDataPosCallback;
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

export type IStepMarkLineSpec = IMarkerSpec & {
  /**
   * 指定辅助线的连接类型，step 的连接方式为由交替的水平线和处置线组成的
   */
  type: 'type-step';
  /**
   * 线的链接方向
   */
  connectDirection: 'top' | 'bottom' | 'left' | 'right';
  /**
   * 在连接方向的扩展距离
   */
  expandDistance?: number;

  label?: IMarkerLabelSpec;
  line?: {
    /**
     * 是否对 points 进行多段处理，默认为 false，即直接将所有的点连接成线。
     * 如果需要进行多段处理，需要将 points 属性配置为 Point[][] 类型
     * @default false
     */
    multiSegment?: boolean;
    /**
     * 在 `multiSegment` 属性开启的前提下，用于声明那一段线段用来作为主线段，如果不声明，默认全段为主线段
     */
    mainSegmentIndex?: number;
    /**
     * 当进行多段配置时，可以通过数组的方式传入
     */
    style?: ILineMarkSpec | ILineMarkSpec[];
  };
} & Omit<IMarkLineTheme, 'label' | 'line'> &
  (
    | {
        /**
         * 指定数据点的参考线。基于指定数据点进行参考线的绘制，可以对数据点进行数据处理
         */
        coordinates: [IDataPointSpec, IDataPointSpec];
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
      }
    | {
        positions: [IPointLike, IPointLike];
      }
  );
