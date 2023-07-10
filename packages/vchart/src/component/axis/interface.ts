import type { IRectMark } from '../../mark/rect';
import type { ISymbolMark } from '../../mark/symbol';
import type { Datum, IPadding, IPolarOrientType, IRuleMarkSpec, ITextMarkSpec, StringOrNumber } from '../../typings';
import type { ICartesianAxisSpec } from './cartesian/interface';
import type { IComponent } from '../interface';
import type { IBaseScale } from '@visactor/vscale';
import type { IModelSpec } from '../../model/interface';
import type { IAnimationSpec } from '../../animation/spec';
import type { AxisItemStateStyle } from '@visactor/vrender-components';
import type { ICompilableData } from '../../compile/data';

export type StatisticsDomain = {
  domain: any[];
  index: { [key in StringOrNumber]: number };
};

export interface IAxis extends IComponent {
  valueToPosition: (value: any) => number;
  getScale: () => IBaseScale;
  getScales: () => IBaseScale[];
  orient: ICartesianAxisSpec['orient'] | IPolarOrientType;
  visible: boolean;
  getStatisticsDomain: () => StatisticsDomain;
}

export interface IAxisItem<T> {
  visible?: boolean;
  style?: Omit<T, 'visible'>;
}

export interface IAxisItemTheme<T> {
  visible?: boolean;
  style?: Omit<T, 'visible'>;
}
export type AxisAnimationPreset = 'groupFadeIn' | 'fadeIn' | 'grow';

export type ICommonAxisSpec = {
  /**
   * 轴类型
   */
  type?: AxisType;
  /**
   * 是否显示坐标轴
   * @default true
   */
  visible?: boolean;
  /**
   * 是否开启反向坐标轴。
   * @default false
   */
  inverse?: boolean;
  /**
   * 轴刻度线配置
   */
  tick?: ITick;
  /**
   * 子刻度线配置
   */
  subTick?: ISubTick;
  /**
   * 轴关联的region索引
   * @default 0
   */
  regionIndex?: number | number[];
  /**
   * 轴关联的region id
   */
  regionId?: StringOrNumber | StringOrNumber[];
  /**
   * 轴关联的系列索引，默认为0
   */
  seriesIndex?: number | number[];
  /**
   * 轴关联的系列id
   */
  seriesId?: StringOrNumber | StringOrNumber[];

  /**
   * 是否开启动画，默认关闭
   * @default false
   */
  animation?: boolean;

  // 交互相关的配置
  /**
   * 是否开启 select 选中交互，默认关闭
   * @default false
   */
  select?: boolean;
  /**
   * 是否开启 hover 悬浮交互，默认关闭
   * @default false
   */
  hover?: boolean;
} & Omit<IModelSpec, 'orient'> &
  IAnimationSpec<string, string>;

export type ILinearAxisSpec = {
  // 线性轴数值范围配置
  /** 最小值，**优先级高于 zero，nice** */
  min?: number;
  /** 最大值，**优先级高于 zero，nice** */
  max?: number;

  /** @deparated 线性轴数值范围配置（已弃用，请使用外层 min/max） */
  range?: {
    /** @deparated 最小值 */
    min?: number;
    /** @deparated 最大值 */
    max?: number;
  };

  /**
   * 是否根据数据将轴范围调整到相对规整的数值
   * @default true
   * @description 当配置了 min 和 max，该配置项失效
   * @example 当配置了 max = 999, nice并不会将轴范围优化到1000
   */
  nice?: boolean;
  /**
   * nice效果的类型，是精度优先还是tickCount优先（比如tickCount为2那nice出来的精度就很低）
   * @default undefined('tickCountFirst')
   * @description 不配置就默认是tickCountFirst
   * @example 数据范围是0~6000，如果tickCount为2，那么tickCountFirst出来的range就是[0, 10000], accurateFirst出来的range就是[0, 6000]但10000显示不了
   */
  niceType?: 'tickCountFirst' | 'accurateFirst';
  /**
   * 是否包含0值
   * @default true
   * @description 当配置了 min和 max，该配置项失效
   */
  zero?: boolean;
  /**
   * 轴范围按比例扩展
   * @description 当配置了 min和 max，该配置项失效
   */
  expand?: {
    min?: number;
    max?: number;
  };
};

export type IBandAxisSpec = {
  /**
   * 轴分组之间间隔，数值在(0,1)之间
   * @default 0.2
   */
  bandPadding?: number | number[];
  paddingInner?: number | number[];
  paddingOuter?: number | number[];
};
// Grid 配置项
export type IGrid = IAxisItem<IRuleMarkSpec> & {
  /**
   * 两个栅格线间的填充色
   */
  alternateColor?: string | string[];
  /**
   * grid 是否与 label 对齐，默认为 true，即对齐，配置为 false 则显示在前后两个刻度中间
   * @default true
   */
  alignWithLabel?: boolean;
  /**
   * 网格线样式，支持回调
   */
  style?: IRuleMarkSpec | StyleCallback<IRuleMarkSpec | undefined>;
};

// 刻度线配置
export type ITick = IAxisItem<IRuleMarkSpec> & {
  /**
   * Length of tick lines
   * 坐标轴刻度线的长度
   * @default 4
   */
  tickSize?: number;
  /**
   * 刻度线朝向，默认朝外(坐标线包围盒外部)
   * @default false
   */
  inside?: boolean;
  /**
   * tick 是否与 label 对齐，默认为 true，即对齐，配置为 false 则显示在前后两个刻度中间
   * @default true
   */
  alignWithLabel?: boolean;
  /** tick步长 */
  tickStep?: number;
  /**
   * 期望的连续轴tick数量
   * The desired number of ticks draw on linear axis.
   * @default 10
   * @description 建议的tick数量，并不保证结果一定是配置值
   */
  tickCount?: number;
  /**
   * 强制设置tick数量
   * The exact number of ticks draw on linear axis. Might lead to decimal step.
   * @default 10
   * @description 强制设置的tick数量，可能由于数据范围导致tick值为小数
   */
  forceTickCount?: number;
  /**
   * 刻度线样式设置，支持回调
   */
  style?: IRuleMarkSpec | StyleCallback<IRuleMarkSpec | undefined>;
  /**
   * 刻度线不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<IRuleMarkSpec>;
};

// 子刻度线配置
export type ISubTick = IAxisItem<IRuleMarkSpec> & {
  /**
   * TODO: 考虑下 log 轴，自刻度线之间的间距是不均匀的问题
   * 子刻度个数
   */
  tickCount?: number;
  /**
   * 子刻度线朝向，默认朝外(坐标线包围盒外部)
   * @default false
   */
  inside?: boolean;
  /** 子刻度线的长度 */
  tickSize?: number;
  /**
   * 子刻度线不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<IRuleMarkSpec>;
};

// 轴标签配置
export type ILabel = IAxisItem<ITextMarkSpec> & {
  /**
   * 轴标签内容格式化函数
   * @param text 原始标签文本值
   * @param datum 图形数据
   * @returns 格式化后的文本
   */
  formatMethod?: (text: string | string[], datum?: any) => string | string[];
  /** 标签同 tick 之间的间距 */
  space?: number;
  /**
   * 标签朝向，默认朝外(坐标线包围盒外部)
   * @default false
   */
  inside?: boolean;
  // /**
  //  * TODO: 暂未支持
  //  * 标签之间的最小间距（单位为像素）
  //  */
  // minGap?: number;
  /**
   * 文本样式设置
   */
  style?: ITextMarkSpec | StyleCallback<ITextMarkSpec | undefined>;
  /**
   * label 不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<ITextMarkSpec>;
};

// 轴线配置
export type IDomainLine = IAxisItem<IRuleMarkSpec> & {
  /**
   * domainLine 在不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<IRuleMarkSpec>;
};

// 轴标题配置
export type ITitle = IAxisItem<ITextMarkSpec> & {
  /**
   * 标题的显示位置，直角坐标系默认 'middle'；
   * 极坐标系的圆弧轴如果配置了内半径，则默认 'middle'，否则 'end'
   */
  position?: 'start' | 'middle' | 'end';
  /**
   * 标题距离坐标轴(轴线、刻度、标签共同构成的包围盒)的距离
   */
  space?: number;
  /**
   * 标题内边距配置
   */
  padding?: IPadding | number | number[];
  /**
   * 标题背景色设置
   */
  background?: IAxisItem<IRectMark> & {
    /**
     * 背景的交互状态样式配置
     */
    state?: AxisItemStateStyle<Partial<IRectMark>>;
  };
  /**
   * TODO: 接入富文本
   * 标题 shape 配置
   */
  shape?: IAxisItem<ISymbolMark> & {
    /**
     * shape 同标题文本之间的间距
     */
    space?: number;
    /**
     * shape 标记的交互状态样式配置
     */
    state?: AxisItemStateStyle<Partial<ISymbolMark>>;
  };
  text?: string | string[];
  /**
   * 标题整体的旋转角度（如果标题配置了 background、shape 等属性的话，需要使用该属性进行整体的配置旋转）。
   */
  angle?: number;
  /**
   * text 文本的交互状态样式配置
   */
  state?: AxisItemStateStyle<Partial<ITextMarkSpec>>;
};

export type StyleCallback<T> = (value: any, index: number, datum: Datum) => T;
export type AxisType = 'linear' | 'ordinal' | 'band' | 'point' | 'time' | 'log';

export interface IAxisCommonTheme {
  /** 网格线配置 */
  grid?: IGrid;
  /** 网格线配置 */
  subGrid?: IGrid;
  /** 轴线配置 */
  domainLine?: IDomainLine;
  /** 轴标签配置 */
  label?: ILabel;
  /** 轴标题配置 */
  title?: ITitle;
  /** 轴刻度线配置 */
  tick?: ITick;
  /** 轴刻度线配置 */
  subTick?: ITick;
}
