import type {
  Datum,
  IMarkSpec,
  IMarkTheme,
  ISeriesSpec,
  IOrientType,
  IPathMarkSpec,
  IPolygonMarkSpec,
  IRuleMarkSpec,
  ITextMarkSpec,
  IPyramid3dMarkSpec,
  IPercent
} from '../../typings';
import type { IAnimationSpec } from '../../animation/spec';
import type { SeriesMarkNameEnum } from '../interface/type';

type FunnelMarks = 'funnel';

export type FunnelAppearPreset = 'clipIn' | 'fadeIn';
export interface IFunnelSeriesSpec extends ISeriesSpec, IAnimationSpec<FunnelMarks, FunnelAppearPreset> {
  type: 'funnel';
  /**
   * 分类字段
   */
  categoryField: string;
  /**
   * 数值字段
   */
  valueField: string;
  /**
   * 漏斗图朝向。
   * @default 'top'
   */
  funnelOrient?: IOrientType;
  /**
   * 图元形状。转化漏斗图仅支持 'rect'
   * @default 'trapezoid'
   */
  shape?: 'rect' | 'trapezoid';
  /**
   * 是否是转化漏斗图
   * @default false
   */
  isTransform?: boolean;
  /**
   * 漏斗图最下层是否尖角。shape为`rect`时不生效
   * @default true
   */
  isCone?: boolean;
  /**
   * 漏斗图对齐方式。转化漏斗图仅支持'center'
   * @default 'center'
   */
  funnelAlign?: 'left' | 'center' | 'right';
  /**
   * 漏斗层之间的像素间隔。转化漏斗图不支持gap配置。
   * @default 0
   */
  gap?: number;
  /**
   * 指定数据项的最大值和最小值
   */
  range?: {
    min?: number;
    max?: number;
  };
  /**
   * 漏斗图最大宽度，支持配置像素值和百分比字符串。
   * @default '80%'
   */
  maxSize?: number | IPercent;
  /**
   * 漏斗图最小宽度，支持配置像素值和百分比字符串。
   * @default 0
   */
  minSize?: number | IPercent;
  /**
   * 漏斗层样式
   */
  [SeriesMarkNameEnum.funnel]?: IMarkSpec<IPathMarkSpec>;
  /**
   * 转化层样式
   */
  [SeriesMarkNameEnum.transform]?: IMarkSpec<IPathMarkSpec>;
  /**
   * 漏斗层标签配置
   */
  [SeriesMarkNameEnum.label]?: IFunnelLabelSpec;
  /**
   * 漏斗层外部标签配置
   */
  [SeriesMarkNameEnum.outerLabel]?: IFunnelOuterLabelSpec;
  /**
   * 转化层标签配置
   */
  [SeriesMarkNameEnum.transformLabel]?: IFunnelLabelSpec;
}

interface IFunnelLabelSpec extends IMarkSpec<ITextMarkSpec> {
  /**
   * 标签文字样式
   */
  limit?: 'shapeSize' | number;
  formatMethod?: (text: string | string[], datum?: Datum) => string | string[];
}

export interface IFunnelOuterLabelSpec extends IFunnelLabelSpec {
  /**
   * 标签布局方式
   * @default 'left' | 'bottom'
   */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /**
   * 文字与引导线间隔宽度
   * @default 5
   */
  spaceWidth?: number;
  /**
   * 文字是否对齐
   * @default true
   */
  alignLabel?: boolean;
  /**
   * 文字样式
   */
  style?: ITextMarkSpec;
  /**
   *  标签引导线样式
   */
  line?: IMarkSpec<IRuleMarkSpec>;
}

export interface IFunnelSeriesTheme {
  [SeriesMarkNameEnum.funnel]?: Partial<IMarkTheme<IPolygonMarkSpec>>;
  [SeriesMarkNameEnum.transform]?: Partial<IMarkTheme<IPolygonMarkSpec>>;
  [SeriesMarkNameEnum.label]?: Partial<IMarkTheme<ITextMarkSpec>>;
  [SeriesMarkNameEnum.outerLabel]?: Partial<IMarkTheme<ITextMarkSpec>> & {
    line?: Partial<IMarkTheme<IRuleMarkSpec>>;
  };
  [SeriesMarkNameEnum.transformLabel]?: Partial<IMarkTheme<ITextMarkSpec>>;
}

export type IFunnel3dSeriesSpec = {
  type: 'funnel3d';
} & Omit<IFunnelSeriesSpec, 'type'>;

export interface IFunnel3dSeriesTheme {
  [SeriesMarkNameEnum.funnel3d]?: Partial<IMarkTheme<IPyramid3dMarkSpec>>;
  [SeriesMarkNameEnum.transform3d]?: Partial<IMarkTheme<IPyramid3dMarkSpec>>;
  [SeriesMarkNameEnum.label]?: Partial<IMarkTheme<ITextMarkSpec>>;
  [SeriesMarkNameEnum.outerLabel]?: Partial<IMarkTheme<ITextMarkSpec>> & {
    line?: Partial<IMarkTheme<IRuleMarkSpec>>;
  };
  [SeriesMarkNameEnum.transformLabel]?: Partial<IMarkTheme<ITextMarkSpec>>;
}
