import type { PopTipAttributes } from '@visactor/vrender-components';
import type { DataView } from '@visactor/vdataset';
import type { Cursor } from './cursor';
import type { InterpolateType } from './interpolate';
import type { ScaleType } from './scale';
import type { ShapeType } from './shape';
import type { IPoint } from './coordinate';
import type { IAttributeOpt, IModelMarkAttributeContext } from '../compile/mark/interface';
import type { Datum } from './common';
import type { IPadding } from '@visactor/vutils';
import type { IColorKey } from '../theme/color-scheme/interface';
import type { ITokenKey } from '../theme/token/interface';
import type {
  IRepeatType,
  TextAlignType,
  TextBaselineType,
  IRichTextAttribute,
  IGraphicStyle,
  IColor
} from '@visactor/vrender-core';

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
  /**
   * 指定映射对应的数据字段
   */
  field?: string;
}

export type IDataDomainSpec = {
  /**
   * 数据的id
   */
  dataId: string;
  /**
   * 数据字段
   */
  fields: string[];
};

// 用来提供给用户进行 scale 配置 所以名字是必选的 对用户配置
export interface IVisualSpecScale<D, T> extends Omit<IVisualSpecBase<D, T>, 'domain'> {
  /**
   * scale 的id
   */
  id: string;
  /**
   * 定义域范围
   */
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
  /**
   * 边框离图形边缘的距离
   */
  distance: number | string;
  /**
   * 边框的颜色
   */
  stroke?: string | IGradient;
  /**
   * 边框的透明度
   */
  strokeOpacity?: number;
  /**
   * 边框线的宽度
   */
  lineWidth?: number;
  /**
   * 给边框配置虚线模式。它使用一组值来指定描述模式的线和间隙的交替长度
   */
  lineDash?: number[];
  /**
   * 设置边框的虚线偏移量
   */
  lineDashOffset?: number;
}

export interface ICommonSpec {
  /**
   * 图形是否可见
   */
  visible?: boolean;
  /**
   * 图形的x坐标
   */
  x?: number;
  /**
   * 图形的y坐标
   */
  y?: number;
  /**
   * 图形的z坐标，仅适用于3D图表
   */
  z?: number;
  /**
   * 图形的描边颜色。
   * 支持使用 'rgb(255,255,255)'，'rgba(255,255,255,1)'，'#fff' 等方式设置为纯色，也支持设置为渐变色描边
   * @todo 隔离主题和 spec 配置
   * IColorKey 类型只适用于主题
   */
  stroke?: string | IGradient | false | (number | boolean)[] | IColorKey;
  /**
   * 描边透明度
   */
  strokeOpacity?: number;
  /**
   * 图形的透明度，既影响描边也影响填充
   */
  opacity?: number;
  /**
   * 图形的描边宽度
   */
  lineWidth?: number;
  /**
   * 给描边配置虚线模式。它使用一组值来指定描述模式的线和间隙的交替长度
   */
  lineDash?: number[];
  /**
   * 设置虚线偏移量的属性
   */
  lineDashOffset?: number;
  /**
   * 设置图形的鼠标样式
   */
  cursor?: Cursor;
  /**
   * 设置图形的层级，主意这个是相对层级，图形引擎绘制的时候，会对相同group下的所有图形根据zIndex进行排序，然后从小到大进行渲染
   */
  zIndex?: number;
  /**
   * 图形的旋转角度
   */
  angle?: number;
  /**
   * 基于AABB的锚点位置，用于简单的定位某些path的位置
   */
  anchor?: [number, number];

  /**
   * x方向的缩放比例，默认为1，即不进行缩放
   */
  scaleX?: number;
  /**
   * y方向的缩放比例，默认为1，即不进行缩放
   */
  scaleY?: number;
  /**
   * 图形缩放中心
   * @since 1.4.0
   * 可以配置固定坐标，例如 [100, 100]；或者百分比坐标，例如 ['50%', '50%']，代表以图元中心为缩放中心
   * */
  scaleCenter?: [number | string, number | string];

  // 3d旋转的属性
  /**
   * x方向的旋转角度
   */
  alpha?: number;
  /**
   * y方向的旋转角度
   */
  beta?: number;
  /**
   * 3d的锚点位置
   */
  anchor3d?: [number, number];

  /**
   * 选择模式，精确模式，粗糙模式（包围盒模式），自定义模式
   */
  pickMode?: 'accurate' | 'imprecise' | 'custom';
  /**
   * bounds的计算模式
   */
  boundsMode?: 'accurate' | 'imprecise';

  /**
   * 用于扩展描边的拾取范围，为 0 就是默认线宽，正数就加宽，负数就减宽
   * @default 0
   * @since 1.7.3
   */
  pickStrokeBuffer?: number;

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
   * 外边框，外描边，描边位于图形外侧
   */
  outerBorder?: IBorder;
  /**
   * 内边框，内描边，描边位于图形内侧
   */
  innerBorder?: IBorder;
  /**
   * html 浮层，会将配置的html相关内容，绝对定位到图元的位置
   * @experimental
   * @since 1.10.0
   */
  html?: IMarkHtmlSpec;

  [key: string]: any;
}

export interface IFillMarkSpec extends ICommonSpec {
  /**
   * 图形的填充颜色
   * @todo 隔离主题和 spec 配置
   * IColorKey 类型只适用于主题
   */
  fill?: VisualType<string> | IGradient | false | IColorKey;
  /**
   * 填充的透明度
   */
  fillOpacity?: number;

  /**
   * 图形的背景色，支持纯色、image元素、canvas元素
   */
  background?: IColor | HTMLImageElement | HTMLCanvasElement | null;
}

export type IMarkHtmlSpec = Partial<IGraphicStyle['html']>;

export interface ISymbolMarkSpec extends IFillMarkSpec {
  /**
   * x方向的偏移量
   */
  dx?: number;
  /**
   * y方向的偏移量
   */
  dy?: number;
  /**
   * 大小，相当于外接圆的半径
   */
  size?: number | number[];
  /** 对外声明使用shape，vrender图形属性对应的是shape */
  shape?: ShapeType | string;
  /**
   * 标记的类型
   * FIXME:  vrender Symbol接收的图形属性，暂时都申明一下
   * */
  symbolType?: ShapeType | string;
  /**
   * x方向的缩放比例，默认为1，即不进行缩放
   */
  scaleX?: number;
  /**
   * y方向的缩放比例，默认为1，即不进行缩放
   */
  scaleY?: number;
}

// lineMark 和 areaMark 共同配置
export interface ILineLikeMarkSpec extends IFillMarkSpec {
  /**
   * 取消的差值类型，默认为线性插值，也就是普通的折线
   */
  curveType?: InterpolateType;
  /**
   * 设置点是否有效，也就是是否合法
   */
  defined?: boolean;
}

export interface IAreaMarkSpec extends ILineLikeMarkSpec {
  /**
   * 面积的x1值
   */
  x1?: number;
  /**
   * 面积的y1值
   */
  y1?: number;
  /**
   * 面积图元的方向，
   * horizontal - 水平方向
   * vertical - 垂直方向
   */
  orient?: 'horizontal' | 'vertical';
}

export interface ILineMarkSpec extends ILineLikeMarkSpec {
  /**
   * 指定如何绘制每一条线段末端的属性。有 3 个可能的值，分别是：'butt', 'round' and 'square'。默认值是 butt。
   */
  lineCap?: LineStrokeCap;
  /**
   * 用来设置 2 个长度不为 0 的相连部分（线段、圆弧、曲线）如何连接在一起的属性（长度为 0 的变形部分，其指定的末端和控制点在同一位置，会被忽略）。此属性有 3 个值： 'round', 'bevel' and 'miter'。默认值是 'miter'
   */
  lineJoin?: LineStrokeJoin;
  /**
   * 设置斜接面限制比例的属性。当获取属性值时，会返回当前的值（默认值是 10.0 ）。当给属性赋值时，0、负数、 Infinity 和 NaN 都会被忽略；除此之外都会被赋予一个新值。
   */
  miterLimit?: number;
  /**
   * stroke 的有界缓冲区
   */
  strokeBoundsBuffer?: number;
}

export interface IRuleMarkSpec extends ILineMarkSpec {
  /**
   * 终点x坐标
   */
  x1?: number;
  /**
   * 终点y坐标
   */
  y1?: number;
}

export interface ITextMarkSpec extends IFillMarkSpec {
  /**
   * 文字内容
   */
  text?: string | number | string[] | number[];
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
  fontSize?: number | ITokenKey;
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
  /**
   * 文本省略的位置，默认尾部省略
   * 1. 'start' 文字首部省略
   * 2. 'middle' 文本中间省略
   * 3. 'end' 文本尾部省略
   * @default 'end'
   * @since 1.7.3
   */
  suffixPosition?: 'start' | 'end' | 'middle';
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
  lineHeight?: number | string | ITokenKey;
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

export type IRichTextMarkSpec = IRichTextAttribute &
  IFillMarkSpec & { type: 'rich'; text: IRichTextAttribute['textConfig'] };

export type IComposedTextMarkSpec = ITextMarkSpec | IRichTextMarkSpec;

export type IPositionedTextMarkSpec = Omit<ITextMarkSpec, 'align' | 'textAlign' | 'baseline' | 'textBaseline'>;

export interface IRectMarkSpec extends IFillMarkSpec {
  /**
   * 圆角配置。
   * 1. 如果传入数值，则统一为四个角设置圆角
   * 2. 如果传入数组，则分别为 [上左, 上右, 下右, 下左]
   */
  cornerRadius?: number | number[];
  /**
   * 宽度
   */
  width?: number;
  /**
   * 高度
   */
  height?: number;
  /**
   * x方向终点坐标
   */
  x1?: number;
  /**
   * y方向终点坐标
   */

  y1?: number;
}

// 3d rect，支持length表示长宽高中的长属性（深度属性）
export interface IRect3dMarkSpec extends IRectMarkSpec {
  /**
   * 3d柱子的深度
   */
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
  /**
   * 最小值
   */
  min?: (datum: Datum) => number;
  /**
   * 25%分位数
   */
  q1?: (datum: Datum) => number;
  /**
   * 中位数
   */
  median?: (datum: Datum) => number;
  /**
   * 75%分位数
   */
  q3?: (datum: Datum) => number;
  /**
   * 最大值
   */
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

export interface ILiquidMarkSpec extends ICommonSpec {
  /**
   * 波浪的变化状态，范围为 [0, 1]
   */
  wave?: number;
}

export interface ILiquidOutlineSpec extends ISymbolMarkSpec {
  /**
   * 描边的宽度
   */
  lineWidth: number;
}

export interface IOutlierMarkSpec {
  /**
   * 异常点填充颜色
   */
  fill?: string;
  /**
   * 异常点大小
   */
  size?: number;
}

export interface IPathMarkSpec extends IFillMarkSpec {
  path?: string;
  // TODO: 该属性后续可能会删除，未定
  /**
   * 平滑缩放，不然会发生跳变，在地图交互场景需要配置为true；常规path缩放不需要
   */
  smoothScale?: boolean;
}

export interface ILinkPathMarkSpec extends IFillMarkSpec {
  /**
   * 连边起点的x坐标
   */
  x0?: number;
  /**
   * 连边起点的y坐标
   */
  y0?: number;
  /**
   * 连边终点的x坐标
   */
  x1?: number;
  /**
   * 连边终点的y坐标
   */
  y1?: number;
  /**
   * 连边的厚度，也可以理解为宽度
   */
  thickness?: number;
  /**
   * 连边的曲度，决定了连边的弯曲程度，取值范围为0-1，
   * 0表示不弯曲，也就是直线
   * 1表示最大的弯曲度，
   * 默认值为0.5
   */
  curvature?: number;
  /** round all the coordinates */
  round?: boolean;
  /** the ratio of normal style path */
  ratio?: number;
  /**
   * 对齐方式
   */
  align?: 'start' | 'end' | 'center';
  /**
   * 连边的类型
   *
   */
  pathType?: 'line' | 'smooth' | 'polyline';
  /**
   * 是否展示终点的箭头
   */
  endArrow?: boolean;
  /**
   * 是否展示起点的箭头
   */
  startArrow?: boolean;
  /**
   * 背景线的样式，主要用于部分高亮的场景
   */
  backgroundStyle?: any;
  /**
   * 连边的方向
   */
  direction?: 'horizontal' | 'vertical' | 'LR' | 'RL' | 'TB' | 'BL' | 'radial';
}

/**
 * arc图元的视觉通道配置
 */
export interface IArcMarkSpec extends IFillMarkSpec {
  /**
   * 圆弧的开始角度
   */
  startAngle?: number;
  /**
   * 圆弧的结束角度
   */
  endAngle?: number;
  /**
   * 间隙角度；间隔角度会转换为一个在两个相邻的弧之间的确定的线性距离，定义为 padRadius * | padAngle |
   * 这个距离在弧的开始和结束处都是相等的；
   * 间隔角度通常只应用于环形扇区（即当内半径大于 0）
   */
  padAngle?: number;

  /**
   * 外径，既外半径
   */
  outerRadius?: number;
  /**
   * 内径，既内半径
   */
  innerRadius?: number;
  /**
   * 圆角
   */
  cornerRadius?: number;
  /**
   * 内边距
   */
  innerPadding?: number;
  /**
   * 外边距
   */
  outerPadding?: number;
  /**
   * arc的中心点偏移距离，一般是通过在交互状态下设置这个属性来实现将扇区移出中心的一个效果
   */
  centerOffset?: number;
  /**
   * arc 的 roundCap 属性，即圆角是否伸出 startAngle 和 endAngle 之外
   */
  cap?: boolean | [boolean, boolean];
  /**
   * arc 在 roundCap 打开且应用环形渐变时是否对 cap 部分生效
   */
  autoCapConical?: boolean;
}

// 3d arc，有高度配置
export interface IArc3dMarkSpec extends IArcMarkSpec {
  /**
   * 3d圆弧的高度
   */
  height?: number;
}

export interface ICellMarkSpec extends ISymbolMarkSpec {
  /**
   * 内边距
   */
  padding?: number | number[] | IPadding;
}

export interface IGroupMarkSpec extends IFillMarkSpec {
  /**
   * 是否开启裁剪
   */
  clip?: boolean;
  /**
   * 宽度
   */
  width?: number;
  /**
   * 高度
   */
  height?: number;
  /**
   * 圆角配置。
   * 1. 如果传入数值，则统一为四个角设置圆角
   * 2. 如果传入数组，则分别为 [上左, 上右, 下右, 下左]
   */
  cornerRadius?: number | number[];
}

export interface IPolygonMarkSpec extends ICommonSpec, IFillMarkSpec {
  /**
   * 顶点坐标
   */
  points?: IPoint[];
  /**
   * 圆角配置，支持数组配置，数组的顺序同组成 polygon 的顺序对应
   */
  cornerRadius?: number | number[];
  /**
   * x方向的缩放比例，默认为1，即不进行缩放
   */
  scaleX?: number;
  /**
   * y方向的缩放比例，默认为1，即不进行缩放
   */
  scaleY?: number;
}

export interface IPyramid3dMarkSpec extends IPolygonMarkSpec {
  /**
   * 3d金字塔顶点坐标，注意只能有4个顶点
   */
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
  /**
   * 渐变色的偏移量，0-1的值
   */
  offset: GradientPropValue<number>;
  /**
   * 渐变色的颜色
   */
  color?: GradientPropValue<string>;
  /**
   * 渐变色的透明度
   */
  opacity?: number;
};
export interface IGradientLinear {
  /**
   * 渐变色的起点x坐标，0-1的值，相对于图形包围盒x方向取值的比例值
   */
  x0?: GradientPropValue<number>;
  /**
   * 渐变色的起点y坐标，0-1的值，相对于图形包围盒y方向取值的比例值
   */
  y0?: GradientPropValue<number>;
  /**
   * 渐变色的终点x坐标，0-1的值，相对于图形包围盒x方向取值的比例值
   */
  x1?: GradientPropValue<number>;
  /**
   * 渐变色的终点y坐标，0-1的值，相对于图形包围盒y方向取值的比例值
   */
  y1?: GradientPropValue<number>;
  /**
   * 渐变色的颜色
   */
  stops: GradientStop[];
  /**
   * 渐变色的类型设置为 'linear'，即线形渐变
   */
  gradient: 'linear';
}

export interface IGradientRadial {
  /**
   * 径向渐变的起点的半径
   */
  r0?: GradientPropValue<number>;
  /**
   * 径向渐变的起点的x坐标
   */
  x0?: GradientPropValue<number>;
  /**
   * 径向渐变的起点的y坐标
   */
  y0?: GradientPropValue<number>;
  /**
   * 径向渐变的终点的x坐标
   */
  x1?: GradientPropValue<number>;
  /**
   * 径向渐变的终点的y坐标
   */
  y1?: GradientPropValue<number>;
  /**
   * 径向渐变的终点的半径
   */
  r1?: GradientPropValue<number>;
  /**
   * 渐变色的颜色
   */
  stops: GradientStop[];
  /**
   * 渐变色的类型设置为 'radial'，即径向渐变
   */
  gradient: 'radial';
}

export interface IGradientConical {
  /**
   * 锥形渐变的中心点x坐标
   */
  x?: GradientPropValue<number>;
  /**
   * 锥形渐变的中心点y坐标
   */
  y?: GradientPropValue<number>;
  /**
   * 锥形渐变的开始角度
   */
  startAngle?: GradientPropValue<number>;
  /**
   * 锥形渐变的结束角度
   */
  endAngle?: GradientPropValue<number>;
  /**
   * 锥形渐变的颜色
   */
  stops: GradientStop[];
  /**
   * 渐变色的类型设置为 'conical'，即锥形渐变
   */
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
  /**
   * 图片的宽度
   */
  width?: number;
  /**
   * 图片的高度
   */
  height?: number;
  /**
   * 当图片的宽度小于 width 时，图片的重复方式
   */
  repeatX?: IRepeatType;
  /**
   * 当图片的高度小于 height 时，图片的重复方式
   */
  repeatY?: IRepeatType;
  /**
   * 设置图片的内容，支持三种类型：
   * 1. string类型，可以是图片资源的路径或者是svg 标签字符串
   * 2. image 元素
   * 3. canvas 元素
   */
  image: string | HTMLImageElement | HTMLCanvasElement;
}

/**
 * text
 */
export type TextAlign = TextAlignType;
export type TextBaseLine = TextBaselineType;
export type FontStyle = 'normal' | 'italic' | 'oblique' | string;
export type FontWeight = 'normal' | 'bold' | 'lighter' | 'bolder' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
