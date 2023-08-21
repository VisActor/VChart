import type { IAnimationSpec } from '../../animation/spec';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IArcMarkSpec, ITextMarkSpec, TextAlign, IPathMarkSpec, IArc3dMarkSpec } from '../../typings/visual';
import type { SeriesMarkNameEnum } from '../interface';
import type { IPolarSeriesSpec, IPolarSeriesTheme } from '../polar/interface';
import type { PieAppearPreset } from './animation/animation';
import type { ILabelSpec } from '../../component/label';

export type PieMarks = 'pie' | 'label' | 'labelLine';

export interface IPieSeriesSpec extends IPolarSeriesSpec, IAnimationSpec<PieMarks, PieAppearPreset> {
  type: 'pie';
  /**
   * 分类字段
   * @description 饼图每个扇区为独立的系列
   */
  categoryField: string;
  /** 数值字段 */
  valueField: string;
  /** 饼图中心点 x 坐标 */
  centerX?: number;
  /** 饼图中心点 y 坐标 */
  centerY?: number;
  /** 饼图扇区中心偏移 */
  centerOffset?: number;

  /**
   * 饼图扇区半径
   * @default 0.6
   * @deprecated use outerRadius instead
   */
  radius?: number;

  /**
   * 饼图扇区外半径
   * @default 0.6
   */
  outerRadius?: number;

  /**
   * 饼图扇区内半径
   * @default 0
   */
  innerRadius?: number;

  /**
   * 饼图扇区圆角半径
   * @default 0
   */
  cornerRadius?: number;
  /** 扇区起始角度 */
  startAngle?: number;
  /** 扇区结束角度 */
  endAngle?: number;
  /** 扇区间隔角度 */
  padAngle?: number;

  /** 扇区样式 */
  [SeriesMarkNameEnum.pie]?: IMarkSpec<IArcMarkSpec>;
  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: IArcLabelSpec;
}

export interface IPieSeriesTheme extends IPolarSeriesTheme {
  [SeriesMarkNameEnum.pie]?: Partial<IMarkTheme<IArcMarkSpec>>;
  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: IArcLabelSpec;
}

export type IPie3dSeriesSpec = {
  type: 'pie3d';
  // 饼图整体绕x轴的旋转角度
  angle3d?: number;
} & Omit<IPieSeriesSpec, 'type'>;

export interface IPie3dSeriesTheme extends IPolarSeriesTheme {
  [SeriesMarkNameEnum.pie3d]?: Partial<IMarkTheme<IArc3dMarkSpec>>;
  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: IArcLabelSpec;
}

export interface IArcLabelLineSpec extends IMarkSpec<IPathMarkSpec> {
  /**
   * 是否显示引导线
   * @default true
   */
  visible?: boolean;
  /**
   * 引导线 line1 部分最小长度
   * @default 20
   */
  line1MinLength?: number;
  /**
   * 引导线 line2 部分最小长度
   * @default 10
   */
  line2MinLength?: number;
}

export type ArcLabelAlignType = 'arc' | 'labelLine' | 'edge';

export type ArcLabelStrategyType = 'priority' | 'vertical' | 'none';

export interface IArcLabelLayoutSpec {
  /**
   * 标签对齐方式
   * @default 'arc'
   */
  textAlign?: ArcLabelAlignType;
  /** @deprecate 建议统一使用textAlign，后续将废除 */
  align?: ArcLabelAlignType;
  /**
   * 标签布局策略
   * @default 'priority'
   */
  strategy?: ArcLabelStrategyType;
  /**
   * 是否启用切线约束
   * @default true
   */
  tangentConstraint?: boolean;
}

// export interface ILabelTextMarkSpec extends Omit<ITextMarkSpec, 'align' | 'textAlign'> {
//   /** text 配置 align 为 auto 时将根据布局逻辑自动处理 align  */
//   textAlign?: TextAlign | 'auto';
//   /** @deprecate 建议统一使用textAlign，后续将废除 */
//   align?: TextAlign | 'auto';
// }

export interface IArcLabelSpec extends ILabelSpec {
  /**
   * 标签布局方式
   * @default 'outside'
   */
  position?: 'outside' | 'inside';
  /**
   * 是否允许标签重叠
   * @default false
   */
  coverEnable?: boolean;
  /**
   * 是否允许标签旋转
   * @default true
   */
  rotate?: boolean;

  /**
   * 文字与引导线间隔宽度
   * @default 5
   */
  spaceWidth?: number;
  /**
   * 扇区间标签的间隔
   * @default 6
   */
  layoutArcGap?: number;

  /** 标签文字样式 */
  style?: ITextMarkSpec;
  /** 标签引导线样式 */
  line?: IArcLabelLineSpec;
  /** 标签布局配置 */
  layout?: IArcLabelLayoutSpec;
}
