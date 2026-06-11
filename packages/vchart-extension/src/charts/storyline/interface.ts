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

export type StorylineLayoutType =
  | 'clock'
  | 'bowl'
  | 'dome'
  | 'left-wing'
  | 'right-wing'
  | 'landscape'
  | 'portrait'
  | 'up-ladder'
  | 'down-ladder'
  | 'pulse'
  | 'spiral';

export type StorylineImagePosition = 'top' | 'left' | 'right' | 'bottom';
export type StorylineLineType = 'line' | 'polyline' | 'curve';

export interface IStorylineBlock {
  id?: StringOrNumber;
  title?: string;
  content?: string | string[];
  image?: string | HTMLImageElement | HTMLCanvasElement;
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
}

export interface IStorylineBlockSpec {
  width?: number;
  widthRatio?: number;
  minWidth?: number;
  maxWidth?: number;
  height?: number;
  padding?: number | [number, number, number, number];
  gap?: number;
  style?: Partial<IRectMarkSpec>;
}

export interface IStorylineImageSpec extends IMarkSpec<IImageMarkSpec> {
  width?: number;
  height?: number;
  position?: StorylineImagePosition;
  gap?: number;
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
  themeColor?: string;
}
