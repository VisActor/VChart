import type { IComponent } from '../../../interface';
import type {
  IAggrType,
  IMarkerPositionsSpec,
  IDataPointSpec,
  IMarkerSpec,
  IDataPos,
  IDataPosCallback,
  IMarkerLabelSpec,
  IMarkerCrossSeriesSpec,
  OffsetPoint
} from '../../interface';
import type { IRegressType } from '../../mark-area/interface';
import type { IMarkLineTheme } from './theme';
import type { ILineMarkSpec, IPoint } from '../../../../typings';

export type IMarkLine = IComponent;

export type IMarkLineSpec =
  | (IMarkerSpec &
      (
        | IMarkLineXSpec // 标注目标：笛卡尔坐标系坐标空间
        | IMarkLineYSpec // 标注目标：笛卡尔坐标系坐标空间
        | IMarkLineXYSpec
        | IMarkLineXYY1Spec
        | IMarkLineYXX1Spec
        | IMarkLineCoordinateSpec // 标注目标：数据元素
        | IMarkerPositionsSpec
      ) &
      IMarkLineTheme)
  | IStepMarkLineSpec; // 标注目标：任意位置

export interface IMarkLineXSpec extends IMarkerCrossSeriesSpec {
  /**
   * 单独声明 x 属性，可以绘制一条贯穿 y 轴的标注线
   * x 轴上的参考线。可以配置参考线在 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
}

export interface IMarkLineXYY1Spec extends IMarkerCrossSeriesSpec {
  /**
   * 参考线在 x 轴上位置，可以配置参考线在 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 该参考线在 y 轴的起点位置，可以配置 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 该参考线在 y 轴的终点位置，可以配置 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
   * @since 1.7.3
   */
  y1: IDataPos | IDataPosCallback;
}

export interface IMarkLineYSpec extends IMarkerCrossSeriesSpec {
  /**
   * 单独声明 y 属性，可以绘制一条贯穿 x 轴的标注线
   * y轴上的参考线。可以配置参考线在y轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算
   * 可以将 y 配置为 '15%' 百分比的形式，用于表示将 x 绘制在 marker 所在 region 纵轴（从上到下）的百分之 15 位置处
   */
  y: IDataPos | IDataPosCallback;
}

export interface IMarkLineYXX1Spec extends IMarkerCrossSeriesSpec {
  /**
   * 参考线在 y 轴上位置，可以配置参考线在 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于  region 纵轴（从上到下）的百分之 15 位置处。
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 该参考线在 x 轴的起点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 该参考线在 x 轴的终点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   * @since 1.7.3
   */
  x1: IDataPos | IDataPosCallback;
}

export interface IMarkLineXYSpec extends IMarkerCrossSeriesSpec {
  /**
   * 参考线起始点在 x 轴上位置，可以配置参考线在 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   */
  x: IDataPos | IDataPosCallback;
  /**
   * 该参考线起始点在 y 轴的起点位置，可以配置 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
   */
  y: IDataPos | IDataPosCallback;
  /**
   * 该参考线终点在 x 轴的终点位置，可以配置 x 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 x 配置为 '15%' 百分比的形式，表示该位置位于 region 横轴（从左往右）的百分之 15 位置处。
   * @since 1.7.3
   */
  x1: IDataPos | IDataPosCallback;
  /**
   * 该参考线终点在 y 轴的终点位置，可以配置 y 轴上的值，或者聚合计算类型，或者以回调的形式通过数据自行计算。
   * 可以将 y 配置为 '15%' 百分比的形式，表示该位置位于 region 纵轴（从上到下）的百分之 15 位置处。
   * @since 1.7.3
   */
  y1: IDataPos | IDataPosCallback;
}

export type IMarkLineCoordinateSpec = {
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
   * 在连接方向的扩展距离。
   * number 类型为像素值
   * string 类型为百分比，相对于 region 区域宽度/高度的百分比，如 '30%'
   */
  expandDistance?: number | string;

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
        /**
         * 画布坐标
         */
        positions: [IPoint, IPoint];
        /**
         * 是否为相对 region 的坐标，默认为 false，即相对画布的坐标
         * @default false
         * @since 1.7.0
         */
        regionRelative?: boolean;
      }
  );
