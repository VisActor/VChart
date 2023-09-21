import type {
  Datum,
  IPadding,
  IPolarOrientType,
  IRectMarkSpec,
  IRuleMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec,
  StringOrNumber
} from '../../typings';
import type { ICartesianAxisSpec } from './cartesian/interface';
import type { IComponent } from '../interface';
import type { IBaseScale } from '@visactor/vscale';
import type { IAnimationSpec } from '../../animation/spec';
import type { AxisItem, AxisItemStateStyle } from '@visactor/vrender-components';
import type { IComponentSpec } from '../base/interface';
import type { ITextGraphicAttribute } from '@visactor/vrender';

export interface StatisticsDomain {
  domain: any[];
  index: { [key in StringOrNumber]: number };
}

export interface IAxis extends IComponent {
  valueToPosition: (value: any) => number;
  getScale: () => IBaseScale;
  getScales: () => IBaseScale[];
  getOrient: () => ICartesianAxisSpec['orient'] | IPolarOrientType;
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

export interface ICommonAxisSpec extends Omit<IComponentSpec, 'orient' | 'center'>, IAnimationSpec<string, string> {
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

  /**
   * 是否开启轴数据采样，默认开启。
   * 轴采样开启之后，会对轴数据进行采样显示，防止轴数据的重叠。
   * 通过配置 `label.minGap` 可以控制轴标签之间的间距。
   * @default true
   * @since 1.1.0
   */
  sampling?: boolean;
}

export interface ILinearAxisSpec {
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

  /**
   * 连续轴上的 dimension tooltip 数据筛选范围
   * 如果配置为单个数字 d，则筛选区间为 [x0 - d, x0 + d]；如果配置为二元组 [d1, d2]，则筛选区间为 [x0 + d1, x0 + d2]
   * @since 1.4.0
   */
  tooltipFilterRange?: number | [number, number];
}

export interface IBandAxisSpec {
  /**
   * 同时设置轴的 paddingInner 和 paddingOuter
   * **因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 bandPadding 配置**
   */
  bandPadding?: number | number[];
  /**
   * band 轴的内边距
   * ** 因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 paddingInner 配置**
   * @default 0.1
   */
  paddingInner?: number | number[];
  /**
   * band 轴的外边距
   * ** 因为有可能存在多层 scale( xField 设置成了数组，即分组场景），所以支持了数组类型，用于多层 scale 的 paddingOuter 配置**
   * @default 0.3
   */
  paddingOuter?: number | number[];
  /**
   * 配置离散轴的数值范围
   * @since 1.1.0
   */
  domain?: StringOrNumber[];
}
// Grid 配置项
export interface IGrid extends IAxisItem<IRuleMarkSpec> {
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
  /**
   * 快捷属性，也可以在 `style` 中配置，用于配置网格线的绘制顺序，默认为 50
   * @default 50
   * @since 1.4.0
   */
  zIndex?: number;
}

export type ITickCallbackOption = {
  axisLength?: number;
  labelStyle?: ITextGraphicAttribute;
};

// 刻度线配置
export interface ITick extends IAxisItem<IRuleMarkSpec> {
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
   * @since 1.4.0 后支持函数回调。
   */
  tickCount?: number | ((option: ITickCallbackOption) => number);
  /**
   * 强制设置tick数量
   * The exact number of ticks draw on linear axis. Might lead to decimal step.
   * @default 10
   * @description 强制设置的tick数量，可能由于数据范围导致tick值为小数
   */
  forceTickCount?: number;
  /**
   * 连续轴 tick 生成算法：
   * 'average': 尽可能均分；
   * 'd3'：与 d3 默认逻辑一致，以 [1, 2, 5] 为基数生成；
   * @default 'average'
   * @since 1.3.0
   */
  tickMode?: 'average' | 'd3';
  /**
   * 连续轴，是否避免小数 tick。
   * @default false
   * @description 当配置了 tickStep 或 forceTickCount 时不生效。
   * @since 1.3.0
   */
  noDecimals?: boolean;
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
  /**
   * 用于 tick 的数据过滤
   * @since 1.1.0
   */
  dataFilter?: (data: AxisItem[]) => AxisItem[];
}

// 子刻度线配置
export interface ISubTick extends IAxisItem<IRuleMarkSpec> {
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
}

// 轴标签配置
export interface ILabel extends IAxisItem<ITextMarkSpec> {
  /**
   * 轴标签内容格式化函数
   * @param text 原始标签文本值
   * @param datum 图形数据
   * @returns 格式化后的文本
   */
  formatMethod?: (text: string | string[], datum?: Datum) => string | string[];
  /** 标签同 tick 之间的间距 */
  space?: number;
  /**
   * 标签朝向，默认朝外(坐标线包围盒外部)
   * @default false
   */
  inside?: boolean;
  /**
   * 标签之间的最小间距（单位为像素），仅当轴采样开始时生效（`sampling: true`）。
   * 该配置会影响轴采样的结果。
   */
  minGap?: number;
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
  /**
   * 用于 label 的数据过滤
   * @since 1.1.0
   */
  dataFilter?: (data: AxisItem[], layer: number) => AxisItem[];
}

// 轴线配置
export interface IDomainLine extends IAxisItem<IRuleMarkSpec> {
  /**
   * domainLine 在不同交互状态下的样式配置，支持：
   * 1. hover
   * 2. hover_reverse
   * 3. selected
   * 4. selected_reverse
   */
  state?: AxisItemStateStyle<IRuleMarkSpec>;
}

// 轴标题配置
export interface ITitle extends IAxisItem<ITextMarkSpec> {
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
  background?: IAxisItem<IRectMarkSpec> & {
    /**
     * 背景的交互状态样式配置
     */
    state?: AxisItemStateStyle<Partial<IRectMarkSpec>>;
  };
  /**
   * TODO: 接入富文本
   * 标题 shape 配置
   */
  shape?: IAxisItem<ISymbolMarkSpec> & {
    /**
     * shape 同标题文本之间的间距
     */
    space?: number;
    /**
     * shape 标记的交互状态样式配置
     */
    state?: AxisItemStateStyle<Partial<ISymbolMarkSpec>>;
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
}

export type StyleCallback<T> = (value: any, index: number, datum: Datum, data: Datum[]) => T;
export type AxisType = 'linear' | 'ordinal' | 'band' | 'point' | 'time' | 'log' | 'symlog';

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
  subTick?: ISubTick;
}

export interface IBandAxisTheme extends IAxisCommonTheme {
  bandPadding?: number | number[];
  paddingInner?: number | number[];
  paddingOuter?: number | number[];
}
