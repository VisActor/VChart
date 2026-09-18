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

/**
 * Storyline 图表支持的布局类型。
 */
export type StorylineLayoutType = 'clock' | 'arc' | 'wing' | 'landscape' | 'portrait';

/**
 * block 内图片相对文本内容的摆放位置。
 */
export type StorylineImagePosition = 'top' | 'left' | 'right' | 'bottom';
/**
 * block 之间连线的绘制方式。
 */
export type StorylineLineType = 'line' | 'polyline' | 'curve';
/**
 * wing 布局的展开方向。
 */
export type StorylineWingDirection = 'left' | 'right';
/**
 * arc 布局的弧形方向。
 */
export type StorylineArcDirection = 'up' | 'down';

/**
 * Storyline 中单个叙事节点的数据配置。
 */
export interface IStorylineBlock {
  /**
   * 节点唯一标识。未配置时使用数据索引作为内部标识。
   */
  id?: StringOrNumber;
  /**
   * 节点标题文本。
   */
  title?: string;
  /**
   * 节点正文内容。传入数组时会按段落拼接为富文本内容。
   */
  content?: string | string[];
  /**
   * 节点主图片，支持图片 URL、HTMLImageElement 或 HTMLCanvasElement。
   */
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
  /**
   * 绑定到该节点的原始业务数据，供外部交互或扩展逻辑使用。
   */
  datum?: unknown;
}

/**
 * Storyline 布局参数配置。
 */
export interface IStorylineLayoutOptions {
  /**
   * 布局类型。
   */
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
   * - arc 布局：'up' | 'down'，'up' 表示穹顶（titleImage 贴底，弧线在上方），'down' 表示碗形（titleImage 贴顶，弧线在下方）。
   */
  direction?: StorylineWingDirection | StorylineArcDirection;
}

/**
 * Storyline 节点 block 的尺寸、间距、背景和样式配置。
 */
export interface IStorylineBlockSpec {
  /**
   * block 的固定宽度。配置后优先级高于 widthRatio、minWidth、maxWidth。
   */
  width?: number;
  /**
   * block 宽度相对可用视图宽度的比例。
   */
  widthRatio?: number;
  /**
   * block 自适应宽度的最小值。
   */
  minWidth?: number;
  /**
   * block 自适应宽度的最大值。
   */
  maxWidth?: number;
  /**
   * block 的固定高度。
   */
  height?: number;
  /**
   * block 内边距，支持单值或 [top, right, bottom, left]。
   */
  padding?: number | [number, number, number, number];
  /**
   * block 之间的布局间距。
   */
  gap?: number;
  /**
   * 是否展示 block 背后的卡片背景 rect（白底 + 描边 + 阴影）。
   * 默认 false（不展示）。
   */
  showBackground?: boolean;
  /**
   * block 背景 rect 的图形样式配置。
   */
  style?: Partial<IRectMarkSpec>;
}

/**
 * Storyline 节点主图片配置。
 */
export interface IStorylineImageSpec extends IMarkSpec<IImageMarkSpec> {
  /**
   * 节点主图片宽度。
   */
  width?: number;
  /**
   * 节点主图片高度。
   */
  height?: number;
  /**
   * 节点主图片相对标题和正文的位置。
   */
  position?: StorylineImagePosition;
  /**
   * 节点主图片与文本内容之间的间距。
   */
  gap?: number;
  /**
   * 是否展示 image 背后的白色背景 rect（白底 + 主题色描边）。
   * 所有布局支持。
   * portrait / landscape 默认 false（不展示），其他布局默认 true（展示）。
   * 注：不影响 subImage（错位装饰图元）的显隐。
   */
  showBackground?: boolean;
}

/**
 * Storyline 标题图片配置，用于在不同布局中放置主题图片或标题图。
 */
export interface IStorylineTitleImageSpec extends IMarkSpec<IImageMarkSpec> {
  /**
   * 标题图片宽度。未配置时由布局根据画布尺寸自适应计算。
   */
  width?: number;
  /**
   * 标题图片高度。未配置时由布局根据宽度和默认比例自适应计算。
   */
  height?: number;
  /**
   * 是否显示标题图片。
   */
  visible?: boolean;
  /**
   * 标题图片资源，支持图片 URL、HTMLImageElement 或 HTMLCanvasElement。
   */
  image?: string | HTMLImageElement | HTMLCanvasElement;
}

/**
 * Storyline 连接线配置。
 */
export interface IStorylineLineSpec extends IMarkSpec<IPathMarkSpec> {
  /**
   * 是否显示连接线或布局主轴线。
   */
  visible?: boolean;
  /**
   * 连接线类型。
   */
  type?: StorylineLineType;
  /**
   * 是否在线段末端显示箭头。
   */
  showArrow?: boolean;
  /**
   * 箭头尺寸。
   */
  arrowSize?: number;
  /**
   * 连接线和 block 边缘之间的距离。
   */
  distance?: number;
}

/**
 * Storyline 图表总配置。
 */
export interface IStorylineSpec extends Omit<IChartSpec, 'type' | 'data' | 'series' | 'title' | 'layout'> {
  /**
   * 图表类型，固定为 'storyline'。
   */
  type: 'storyline';
  /**
   * Storyline 节点数据数组。
   */
  data: IStorylineBlock[];
  /**
   * 布局类型或布局参数配置。
   */
  layout?: StorylineLayoutType | IStorylineLayoutOptions;
  /**
   * 节点 block 的尺寸、间距、背景和样式配置。
   */
  block?: IStorylineBlockSpec;
  /**
   * 节点标题文本 mark 配置。
   */
  title?: IMarkSpec<ITextMarkSpec>;
  /**
   * 图表标题图片配置。
   */
  titleImage?: IStorylineTitleImageSpec;
  /**
   * 节点正文富文本 mark 配置。
   */
  content?: IMarkSpec<IComposedTextMarkSpec>;
  /**
   * 节点主图片配置。
   */
  image?: IStorylineImageSpec;
  /**
   * 节点之间连接线或布局主轴线配置。
   */
  line?: IStorylineLineSpec;
  /**
   * 时间节点文本配置（仅 portrait 布局生效）。
   * 当 spec.data[i].marker 有值时，在中轴 rect 上沿垂直方向绘制每个 block 的时间节点文本。
   */
  marker?: IMarkSpec<ITextMarkSpec>;
  /**
   * Storyline 主题色，用于连接线、轴、图片背景和强调元素的默认颜色。
   */
  themeColor?: string;
}
