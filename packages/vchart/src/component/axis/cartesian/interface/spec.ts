import type { IOrientType, IRectMarkSpec, StringOrNumber } from '../../../../typings';
import type { IBandAxisSpec, ILinearAxisSpec, IGrid, ICommonAxisSpec } from '../../interface';
import type { ICartesianDomainLine, ICartesianLabel, ITimeLayerType, ICartesianTitle } from './common';
import type { AxisItemStateStyle } from '@visactor/vrender-components';

/** spec */
export type ICartesianAxisSpec =
  | ICartesianLinearAxisSpec
  | ICartesianBandAxisSpec
  | ICartesianTimeAxisSpec
  | ICartesianLogAxisSpec
  | ICartesianSymlogAxisSpec;

export type ICartesianAxisCommonSpec = ICommonAxisSpec & {
  /** 轴位置 */
  orient: IOrientType;
  /**
   * 网格线配置
   */
  grid?: IGrid;
  /**
   * 子网格线配置
   */
  subGrid?: IGrid;
  /**
   * 轴线配置
   */
  domainLine?: ICartesianDomainLine;
  /**
   * 轴标签配置
   */
  label?: ICartesianLabel;
  /**
   * 轴标题配置
   */
  title?: ICartesianTitle;
  /**
   * 是否进行自动缩进
   * 设置为 true 时，当轴元素超出绘图区会被裁剪时，会对图表增加额外的padding，使轴可以显示完整
   */
  autoIndent?: boolean;
  /**
   * 坐标轴背景配置
   */
  background?: {
    /**
     * 是否绘制坐标轴背景
     * @default false
     */
    visible: boolean;
    /**
     * 背景样式
     */
    style?: Partial<IRectMarkSpec>;
    /**
     * 背景在交互状态下的样式配置
     */
    state?: AxisItemStateStyle<Partial<IRectMarkSpec>>;
  };
  /**
   * 是否是3d模式的轴
   */
  mode?: '2d' | '3d';
  /**
   * 轴的z方向深度
   */
  depth?: number;
};

export interface ILinearAxisSync {
  /**
   * 配置参照的轴 id
   */
  axisId: StringOrNumber;
  /**
   * 是否保持 2 个轴的 0 值对齐
   * @default false
   */
  zeroAlign?: boolean;
  /**
   * 是否使这个轴的 tick 与目标轴保持比例对齐
   * @default false
   */
  tickAlign?: boolean;
}

export type ICartesianLinearAxisSpec = ICartesianAxisCommonSpec &
  ILinearAxisSpec & {
    sync?: ILinearAxisSync;
  };

export type ICartesianBandAxisSpec = ICartesianAxisCommonSpec &
  IBandAxisSpec & {
    /** 轴组宽设置 */
    bandSize?: number;
  };

export type ICartesianTimeAxisSpec = Omit<ICartesianAxisCommonSpec, 'inverse'> & {
  /**
   * 轴的层级配置。
   * layer[0] 为主轴，即离坐标轴线最近的轴
   * @description 目前仅支持单层 / 双层，即layers.length <= 2
   */
  layers?: ITimeLayerType[];
};

export type ICartesianLogAxisSpec = ICartesianLinearAxisSpec & {
  /**
   * 底数
   * @default 10
   */
  base?: number;
};

export type ICartesianSymlogAxisSpec = ICartesianLinearAxisSpec & {
  /**
   * 底数
   * @default 10
   */
  constant?: number;
};
