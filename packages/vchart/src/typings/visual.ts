import type { PopTipAttributes } from '@visactor/vrender-components';
import type { DataView } from '@visactor/vdataset';
import type { Cursor } from './cursor';
import type { InterpolateType } from './interpolate';
import type { ScaleType } from './scale';
import type { ShapeType } from './shape';
import type { IPoint } from './coordinate';
import type { IAttributeOpt, IModelMarkAttributeContext } from '../compile/mark';
import type { Datum, StringOrNumber } from './common';
import type { IPadding } from '@visactor/vutils';
import type { IColorKey } from '../theme/color-scheme/interface';
import type { IRepeatType, TextAlignType, TextBaselineType } from '@visactor/vrender-core';

// 基础的visual 对应 scale 的属性
export interface IVisualSpecBase<D, T> {
  /**
   * type of scale
   */
  type: ScaleType;
  /**
   * will set to scale.domain, it means input of scale
   */
  domain: D[];
  /**
   * will set to scale.range, it means output of scale
   */
  range: T[];
  /**
   * will set to scale.specified if scale support, as a key-value pair matching capability
   * @since 1.1.0
   */
  specified?: { [key: string]: unknown };
}
// 用来给用户进行mark.style上的映射配置。所以要配置数据维度
export interface IVisualSpecStyle<D, T> extends IVisualSpecBase<D, T> {
  field?: string;
}

export type IDataDomainSpec = {
  dataId: string;
  fields: string[];
};

// 用来提供给用户进行 scale 配置 所以名字是必选的 对用户配置
export interface IVisualSpecScale<D, T> extends Omit<IVisualSpecBase<D, T>, 'domain'> {
  id: string;
  domain:
    | IVisualSpecBase<D, T>['domain']
    // 使用数据的字段值，如果 scale 是连续的，就取区间，如果是离散的就使用 values 。
    // 不考虑图表内的交互等数据筛选，这里只用原始数据的统计信息
    | IDataDomainSpec[];
}
// 对用户配置
export type IVisual<D = any, R = any> = IVisualSpecStyle<D, R> | IVisualScale;

export interface IVisualScale {
  /**
   * 对应 IVisualSpecScale 的用户配置 scale-id
   */
  scale: string;
  /**
   * 指定参与映射的数据字段
   */
  field?: string;
  /**
   * 当用户指定 field 后，用该属性来控制值域。
   * @default 'none'
   */
  changeDomain?: 'none' | 'replace' | 'expand';
}

export type FunctionType<T> = (
  datum: Datum,
  context: IModelMarkAttributeContext,
  opt?: IAttributeOpt,
  source?: DataView
) => T;
export type ValueType<T> = T;
export type VisualType<T> = ValueType<T> | FunctionType<T> | IVisual<unknown, T>;

export type TextureType =
  | 'circle'
  | 'dimond'
  | 'rect'
  | 'vertical-line'
  | 'horizontal-line'
  | 'bias-lr'
  | 'bias-rl'
  | 'grid';

/**
 * style格式转换
 */
export type ConvertToMarkStyleSpec<T extends Record<string, any>> = {
  [key in keyof T]: VisualType<T[key]>;
};

/**
 * border
 */

export interface IBorder {
  distance: number | string;
  stroke?: string | IGradient;
  strokeOpacity?: number;
  lineWidth?: number;
  lineDash?: number[];
  lineDashOffset?: number;
}

export interface ICommonSpec {
  visible?: boolean;
  x?: number;
  y?: number;
  z?: number;
  stroke?: string | IGradient | IColorKey | false | (number | boolean)[];
  strokeOpacity?: number;
  opacity?: number;
  lineWidth?: number;
  lineDash?: number[];
  lineDashOffset?: number;

  cursor?: Cursor;
  zIndex?: number;
  angle?: number;
  anchor?: [number, number];

  // 缩放属性
  scaleX?: number;
  scaleY?: number;
  /**
   * 图形缩放中心
   * @since 1.4.0
   * 可以配置固定坐标，例如 [100, 100]；或者百分比坐标，例如 ['50%', '50%']，代表以图元中心为缩放中心
   * */
  scaleCenter?: [number | string, number | string];

  // 3d旋转的属性
  beta?: number;
  alpha?: number;
  anchor3d?: [number, number];

  /**
   * 选择模式，精确模式，粗糙模式（包围盒模式），自定义模式
   */
  pickMode?: 'accurate' | 'imprecise' | 'custom';
  boundsMode?: 'accurate' | 'imprecise';

  // 以下是纹理相关的属性
  /**
   * 纹理的类型
   */
  texture?: TextureType | string;
  /**
   * 纹理的颜色
   */
  textureColor?: string;
  /**
   * 纹理单元的大小
   */
  textureSize?: number; // 纹理大小
  /**
   * 纹理之间空隙的大小
   */
  texturePadding?: number;

  /**
   * 外边框
   */
  outerBorder?: IBorder;
  /**
   * 内边框
   */
  innerBorder?: IBorder;

  [key: string]: any;
}

export interface IFillMarkSpec extends ICommonSpec {
  fill?: VisualType<string> | IGradient | false | IColorKey;
  fillOpacity?: number;
  // TODO：waite VRender support this api
  // backgroundMode: number; // 填充模式（与具体图元有关）
  // can coexist with fill
  background?: string | HTMLImageElement | HTMLCanvasElement | null;
}

// export interface IFillImageMarkSpec {
//   fillImage?: string;
//   repeatX?: RepeatXYType;
//   repeatY?: RepeatXYType;
//   imageOrigin?: ImageOriginType;
// }

export interface ISymbolMarkSpec extends IFillMarkSpec {
  dx?: number;
  dy?: number;
  size?: number | number[];
  /** 对外声明使用shape，vrender图形属性对应的是shape */
  shape?: ShapeType | string;
  /** FIXME:  vrender Symbol接收的图形属性，暂时都申明一下 */
  symbolType?: ShapeType | string;
  scaleX?: number;
  scaleY?: number;
}

// lineMark 和 areaMark 共同配置
export interface ILineLikeMarkSpec extends IFillMarkSpec {
  curveType?: InterpolateType;
  defined?: boolean;
  /**
   * @private 一个标志位，用于通知 VGrammar 是否执行 getLineSegmentConfigs 方法
   */
  enableSegments?: boolean;
}

export interface IAreaMarkSpec extends ILineLikeMarkSpec {
  x1?: number;
  y1?: number;

  orient?: 'horizontal' | 'vertical';
}

export interface ILineMarkSpec extends ILineLikeMarkSpec {
  lineCap?: LineStrokeCap;
  lineJoin?: LineStrokeJoin;
  miterLimit?: number;
  strokeBoundsBuffer?: number;
}

export interface IRuleMarkSpec extends ILineMarkSpec {
  x1?: number;
  y1?: number;
}

export interface ITextMarkSpec extends IFillMarkSpec {
  /**
   * 文字内容
   */
  text?: StringOrNumber | string[];
  /**
   * x 方向偏移
   */
  dx?: number;
  /**
   * y 方向偏移
   */
  dy?: number;
  /**
   * 字号
   */
  fontSize?: number;
  /**
   * 文字对齐方式
   */
  textAlign?: TextAlign;
  /**
   * 文字居中方式
   */
  textBaseline?: TextBaseLine;
  /**
   * 字体
   */
  fontFamily?: string;
  /**
   * 字重
   */
  fontWeight?: FontWeight;
  /**
   * 字体样式
   */
  fontStyle?: FontStyle;
  /**
   * 文字的最大长度
   */
  maxLineWidth?: number;
  /**
   * 文字超出 maxLineWidth 后的省略符
   */
  ellipsis?: string;
  // TODO: 这些不是常规的文字mark属性，待确认需求背景
  lineBreak?: string;
  /**
   * 下划线
   */
  underline?: boolean;
  /**
   * 中划线
   */
  lineThrough?: boolean;
  /**
   * 行高（1.3.1 版本新增字符串类型表示比例值，如"150%"）
   * @since 1.3.1
   */
  lineHeight?: number | string;
  /**
   * poptip 相关配置
   */
  poptip?: PopTipAttributes;
  /**
   * 文本的排布方向，如果需要文本纵向排布，可以配置为 'vertical'
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
}

export type IPositionedTextMarkSpec = Omit<ITextMarkSpec, 'align' | 'textAlign' | 'baseline' | 'textBaseline'>;

export interface IRectMarkSpec extends IFillMarkSpec {
  /**
   * 圆角配置。
   * 1. 如果传入数值，则统一为四个角设置圆角
   * 2. 如果传入数组，则分别为 [上左, 上右, 下右, 下左]
   */
  cornerRadius?: number | number[];
  width?: number;
  height?: number;
  x1?: number;
  y1?: number;
}

// 3d rect，支持length表示长宽高中的长属性（深度属性）
export interface IRect3dMarkSpec extends IRectMarkSpec {
  length?: number;
}

export interface IBoxPlotMarkSpec extends ICommonSpec {
  /**
   * box描边宽度
   */
  lineWidth?: number;
  /**
   * box宽度
   */
  boxWidth?: number;
  /**
   * 最大最小值宽度
   */
  shaftWidth?: number;
  /**
   * 中轴线类型
   */
  shaftShape?: BoxPlotShaftShape;
  /**
   * 盒子填充颜色，为空则不填充
   */
  boxFill?: string;
  // /**
  //  * 描边颜色
  //  */
  // stroke?: string;
  /**
   * 中轴线透明度，仅当shaftType=bar时生效
   */
  shaftFillOpacity?: number;

  min?: (datum: Datum) => number;
  q1?: (datum: Datum) => number;
  median?: (datum: Datum) => number;
  q3?: (datum: Datum) => number;
  max?: (datum: Datum) => number;
}

export interface IRippleMarkSpec extends ICommonSpec {
  /**
   * 波纹密度ripple
   * ripple 取值范为[0,1]
   */
  ripple?: number;
  /**
   * 水波纹最大半径
   */
  size?: number;
}

export interface IOutlierMarkSpec {
  //异常点填充颜色
  fill?: string;
  //异常点大小
  size?: number;
}

export interface IPathMarkSpec extends IFillMarkSpec {
  path?: string;
  // TODO: 该属性后续可能会删除，未定
  // 平滑缩放，不然会发生跳变，在地图交互场景需要配置为true；常规path缩放不需要
  smoothScale?: boolean;
}

export interface ILinkPathMarkSpec extends IFillMarkSpec {
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  thickness?: number;
  curvature?: number;
  /** round all the coordinates */
  round?: boolean;
  /** the ratio of normal style path */
  ratio?: number;
  align?: 'start' | 'end' | 'center';
  pathType?: 'line' | 'smooth' | 'polyline';
  endArrow?: boolean;
  startArrow?: boolean;
  backgroundStyle?: any;
  direction?: 'horizontal' | 'vertical' | 'LR' | 'RL' | 'TB' | 'BL' | 'radial';
}

export interface IArcMarkSpec extends IFillMarkSpec {
  startAngle?: number;
  endAngle?: number;
  padAngle?: number;

  outerRadius?: number;
  innerRadius?: number;
  cornerRadius?: number;

  /** arc的中心点偏移距离 */
  centerOffset?: number;

  /** arc 的 roundCap 属性，即圆角是否伸出 startAngle 和 endAngle 之外 */
  cap?: boolean | [boolean, boolean];
  /** arc 在 roundCap 打开且应用环形渐变时是否对 cap 部分生效 */
  autoCapConical?: boolean;
}

// 3d arc，有高度配置
export interface IArc3dMarkSpec extends IArcMarkSpec {
  height?: number;
}

export interface IProgressArcMarkSpec extends IArcMarkSpec {
  /** 进度条内侧 padding（接受负值） */
  innerPadding?: number;
  /** 进度条外侧 padding（接受负值） */
  outerPadding?: number;
}

export interface ICellMarkSpec extends ISymbolMarkSpec {
  padding?: number | number[] | IPadding;
}

export interface IGroupMarkSpec extends IFillMarkSpec {
  clip?: boolean;
  width?: number;
  height?: number;
  /**
   * 圆角配置。
   * 1. 如果传入数值，则统一为四个角设置圆角
   * 2. 如果传入数组，则分别为 [上左, 上右, 下右, 下左]
   */
  cornerRadius?: number | number[];
}

export interface IPolygonMarkSpec extends ICommonSpec, IFillMarkSpec {
  points?: IPoint[];
  /**
   * 圆角配置，支持数组配置，数组的顺序同组成 polygon 的顺序对应
   */
  cornerRadius?: number | number[];
  scaleX?: number;
  scaleY?: number;
}

export interface IPyramid3dMarkSpec extends IPolygonMarkSpec {
  // 只能有4个顶点
  points?: IPoint[];
}

/**
 * ImageFill
 */
export type RepeatType = 'no-repeat' | 'repeat-x' | 'repeat-y' | 'repeat';
export type RepeatXYType = 'no-repeat' | 'repeat' | 'stretch';
export type ImageOriginType = 'top' | 'bottom';

/**
 *  gradient
 */
export type GradientPropValue<T> = ValueType<T> | FunctionType<T>;
export type GradientStop = {
  offset: GradientPropValue<number>;
  color?: GradientPropValue<string>;
  opacity?: number;
};
export interface IGradientLinear {
  x0?: GradientPropValue<number>;
  y0?: GradientPropValue<number>;
  x1?: GradientPropValue<number>;
  y1?: GradientPropValue<number>;
  stops: GradientStop[];
  gradient: 'linear';
}

export interface IGradientRadial {
  r0?: GradientPropValue<number>;
  x0?: GradientPropValue<number>;
  y0?: GradientPropValue<number>;
  x1?: GradientPropValue<number>;
  y1?: GradientPropValue<number>;
  r1?: GradientPropValue<number>;
  stops: GradientStop[];
  gradient: 'radial';
}

export interface IGradientConical {
  x?: GradientPropValue<number>;
  y?: GradientPropValue<number>;
  startAngle?: GradientPropValue<number>;
  endAngle?: GradientPropValue<number>;
  stops: GradientStop[];
  gradient: 'conical';
}

export type GradientType = 'linear' | 'radial' | 'conical';
export type IGradient = IGradientLinear | IGradientRadial | IGradientConical;

export type LineStrokeCap = 'butt' | 'round' | 'square';
export type LineStrokeJoin = 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round';

export type BoxPlotShaftShape = 'line' | 'bar';
/**
 *  threshold
 */
export interface IThresholdStyle extends IVisualSpecStyle<number, string> {
  domain: number[];
  field: string;
  range: string[];
  type: 'threshold';
}

// FIXME: For some tool methods that need to use common configuration types
export interface IUnknownMarkSpec extends ICommonSpec {
  [key: string]: unknown;
}

export interface IImageMarkSpec extends IFillMarkSpec {
  /**
   * 圆角配置。
   * 1. 如果传入数值，则统一为四个角设置圆角
   * 2. 如果传入数组，则分别为 [上左, 上右, 下右, 下左]
   */
  cornerRadius?: number | number[];
  width?: number;
  height?: number;
  repeatX?: IRepeatType;
  repeatY?: IRepeatType;
  image: string | HTMLImageElement | HTMLCanvasElement;
}

/**
 * text
 */
export type TextAlign = TextAlignType;
export type TextBaseLine = TextBaselineType;
export type FontStyle = 'normal' | 'italic' | 'oblique' | string;
export type FontWeight = 'normal' | 'bold' | 'lighter' | 'bolder' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
