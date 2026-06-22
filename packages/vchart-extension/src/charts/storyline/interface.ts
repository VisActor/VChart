import type {
  IChartSpec,
  IComposedTextMarkSpec,
  IImageMarkSpec,
  IMarkSpec,
  IPathMarkSpec,
  IRectMarkSpec,
  ITextMarkSpec,
  StringOrNumber
} from '@visactor/vchart';

export type StorylineLayoutType = 'clock' | 'arc' | 'wing' | 'landscape' | 'portrait' | 'ladder' | 'spiral';

export type StorylineImagePosition = 'top' | 'left' | 'right' | 'bottom';
export type StorylineLineType = 'line' | 'polyline' | 'curve';
export type StorylineWingDirection = 'left' | 'right';
export type StorylineLadderDirection = 'up' | 'down';
export type StorylineArcDirection = 'up' | 'down';

export interface IStorylineBlock {
  id?: StringOrNumber;
  title?: string;
  content?: string | string[];
  image?: string | HTMLImageElement | HTMLCanvasElement;
  /**
   * 绘制在主 image 背后的装饰图（如 portrait 布局的错位 shadow image）。
   * 若未配置，则不会绘制装饰 image。
   */
  subImage?: string | HTMLImageElement | HTMLCanvasElement;
  /**
   * 时间节点文本（如 "2012"）。
   * 仅 portrait 布局生效：在中轴 rect 上沿每个 block 的 center.y 处纵向绘制。
   * 配合 spec.marker 控制样式与显隐。
   */
  marker?: string;
  datum?: unknown;
}

export interface IStorylineLayoutOptions {
  type: StorylineLayoutType;
  /**
   * 边缘留白，支持单值或 [top, right, bottom, left]。
   */
  padding?: number | [number, number, number, number];
  /**
   * 对 circular/arc 布局生效，控制半径占可用空间的比例。
   */
  radiusRatio?: number;
  /**
   * 对 circular/arc 布局生效，角度单位为度。
   */
  startAngle?: number;
  /**
   * 对 circular/arc 布局生效，角度单位为度。
   */
  endAngle?: number;
  /**
   * 方向控制：
   * - wing 布局：'left' | 'right'，圆心锚位置；
   * - ladder 布局：'up' | 'down'，'up' 表示左下→右上对角线（默认），'down' 表示左上→右下对角线；
   * - arc 布局：'up' | 'down'，'up' 表示穹顶（centerImage 贴底，弧线在上方），'down' 表示碗形（centerImage 贴顶，弧线在下方）。
   */
  direction?: StorylineWingDirection | StorylineLadderDirection | StorylineArcDirection;
  /**
   * 对 ladder 布局生效：贯穿画布的倾斜大字 headline。
   * 缺省时使用占位文本。倾斜方向自动跟随对角线。
   */
  headline?: string;
}

export interface IStorylineBlockSpec {
  width?: number;
  widthRatio?: number;
  minWidth?: number;
  maxWidth?: number;
  height?: number;
  padding?: number | [number, number, number, number];
  gap?: number;
  /**
   * 是否展示 block 背后的卡片背景 rect（白底 + 描边 + 阴影）。
   * 仅 up-ladder 等少数布局支持，默认 false（不展示）。
   */
  showBackground?: boolean;
  style?: Partial<IRectMarkSpec>;
}

export interface IStorylineImageSpec extends IMarkSpec<IImageMarkSpec> {
  width?: number;
  height?: number;
  position?: StorylineImagePosition;
  gap?: number;
  /**
   * 是否展示 image 背后的白色背景 rect（白底 + 主题色描边）。
   * 所有布局支持。
   * portrait / landscape 默认 false（不展示），其他布局默认 true（展示）。
   * 注：不影响 subImage（错位装饰图元的显隐。
   */
  showBackground?: boolean;
}

export interface IStorylineCenterImageSpec extends IMarkSpec<IImageMarkSpec> {
  width?: number;
  height?: number;
  visible?: boolean;
  image?: string | HTMLImageElement | HTMLCanvasElement;
}

export interface IStorylineLineSpec extends IMarkSpec<IPathMarkSpec> {
  visible?: boolean;
  type?: StorylineLineType;
  showArrow?: boolean;
  arrowSize?: number;
  /**
   * 连接线和 block 边缘之间的距离。
   */
  distance?: number;
}

export interface IStorylineSpec extends Omit<IChartSpec, 'type' | 'data' | 'series' | 'title' | 'layout'> {
  type: 'storyline';
  data: IStorylineBlock[];
  layout?: StorylineLayoutType | IStorylineLayoutOptions;
  block?: IStorylineBlockSpec;
  title?: IMarkSpec<ITextMarkSpec>;
  content?: IMarkSpec<IComposedTextMarkSpec>;
  image?: IStorylineImageSpec;
  centerImage?: IStorylineCenterImageSpec;
  line?: IStorylineLineSpec;
  /**
   * 时间节点文本配置（仅 portrait 布局生效）。
   * 当 spec.data[i].marker 有值时，在中轴 rect 上沿垂直方向绘制每个 block 的时间节点文本。
   */
  marker?: IMarkSpec<ITextMarkSpec>;
  themeColor?: string;
}
