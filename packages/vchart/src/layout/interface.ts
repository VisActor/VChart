import type { IBoundsLike } from '@visactor/vutils';
import type { StringOrNumber } from '../typings/common';
import type { IOrientType, IRect } from '../typings/space';
import type { IPoint } from '../typings/coordinate';
import type {
  ILayoutAlignSelf,
  ILayoutNumber,
  ILayoutPaddingSpec,
  ILayoutPoint,
  ILayoutRect,
  ILayoutType
} from '../typings/layout';
import type { ILayoutModel } from '../model/interface';

export interface IBaseLayout {
  /**
   * 对一组布局元素布局
   * 布局策略随意
   * @param item 布局元素数组
   * @param chartLayoutRect 排除图表 padding 后的图表的布局矩形，原点是图表绘制区域左上角。
   * @param chartViewBox 图表在画布中的可用空间，包含图表padding，原点是画布左上角
   * @returns
   */
  layoutItems: LayoutCallBack;
}

export type LayoutCallBack = (
  chart: any,
  item: ILayoutItem[],
  chartLayoutRect: IRect,
  chartViewBox: IBoundsLike
) => void;

export interface ILayoutSpecBase {
  type: string;
}

export type ElementSpec = (
  | {
      modelKey: string; // spec key
      modelIndex: number;
    }
  | {
      modelId: string;
    }
) & {
  col: number;
  colSpan?: number;
  row: number;
  rowSpan?: number;
};

export interface IGridLayoutSpec extends ILayoutSpecBase {
  type: 'grid';
  col: number;
  row: number;
  colWidth?: {
    index: number;
    size: number | ((maxSize: number) => number);
  }[];
  rowHeight?: {
    index: number;
    size: number | ((maxSize: number) => number);
  }[];
  elements: ElementSpec[];
}

export interface IBaseLayoutSpec extends ILayoutSpecBase {
  type: 'base';
}

export type ILayoutSpec = IBaseLayoutSpec | IGridLayoutSpec;

export interface ILayoutConstructor {
  type: string;
  // TODO: spec 类型生命
  new (spec: ILayoutSpec | any, ctx?: any): IBaseLayout;
}

/**
 * 因为这些元素都会继承到各个模块，所以这里统一有前缀避免语意冲突
 */
export interface ILayoutItem {
  readonly type: string;
  /**
   * 标记这个布局Item的方向（left->right, right->left, top->bottom, bottom->top）
   */
  directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
  layoutClip: boolean;
  layoutType: ILayoutType;
  layoutBindRegionID: number | number[];
  layoutOrient: IOrientType;
  /** 是否自动缩进 */
  autoIndent: boolean;

  /**
   * inline元素和其他同行元素的对齐方式
   * 顶部的inline元素，'start' - 顶部对齐；'end' - '底部对齐'; 'middle' - 居中对齐
   * 底部的inline元素，'start' - 底部对齐；'end' - '顶部对齐'; 'middle' - 居中对齐
   * 左侧的inline元素，'start' - 左侧对齐；'end' - '右侧对齐'; 'middle' - 居中对齐
   * 右侧的inline元素，'start' - 右侧对齐；'end' - '左侧对齐'; 'middle' - 居中对齐
   */
  alignSelf?: 'start' | 'end' | 'middle';

  layoutPaddingLeft: number;
  layoutPaddingTop: number;
  layoutPaddingRight: number;
  layoutPaddingBottom: number;

  layoutOffsetX: number;
  layoutOffsetY: number;

  // 越大越先处理
  layoutLevel: number;

  chartLayoutRect: ILayoutRect;

  readonly layoutRectLevelMap: ILayoutRect;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;

  readonly model: ILayoutModel;

  getModelId: () => StringOrNumber;
  getModelVisible: () => boolean;

  getSpec?: () => any;
  setAttrFromSpec: (spec: ILayoutItemSpec, chartViewRect: ILayoutRect) => void;

  setRectInSpec: (rect: ILayoutRect) => ILayoutRect;

  getLayoutStartPoint: () => ILayoutPoint;
  getLayoutRect: () => ILayoutRect;
  getLayout: () => IRect;
  getLastComputeOutBounds: () => IBoundsLike;

  /** 生命周期 */
  onLayoutStart: (layoutRect: IRect, viewRect: ILayoutRect, ctx: any) => void;
  onLayoutEnd: (option: any) => void;

  /**
   * 更新元素布局的 layoutRect 大小，用来更新指定布局空间
   */
  setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>) => void;
  /**
   * 基于元素内部逻辑计算占位空间，rect表示可用空间
   */
  computeBoundsInRect: (rect: ILayoutRect) => ILayoutRect;
  /**
   * 更新元素布局的起始点位置
   */
  setLayoutStartPosition: (pos: Partial<IPoint>) => void;
  /**
   * 更新绝对布局元素的位置信息
   */
  absoluteLayoutInRect: (rect: IRect) => void;
}

export interface ILayoutItemSpec {
  /** 当前模块的布局类型，配置为 absolute 的话，当前元素会以图表左上角为原点进行绝对布局 */
  layoutType?: ILayoutType;
  /**
   * 布局顺序等级，等级越大的，越优先布局
   * 比如顶部同时有标题和图例的场景，期望标题先放在顶部，然后放置图例。
   */
  layoutLevel?: number;

  /**
   * inline元素和其他同行元素的对齐方式
   * 顶部的inline元素，'start' - 顶部对齐；'end' - '底部对齐'; 'middle' - 居中对齐
   * 底部的inline元素，'start' - 底部对齐；'end' - '顶部对齐'; 'middle' - 居中对齐
   * 左侧的inline元素，'start' - 左侧对齐；'end' - '右侧对齐'; 'middle' - 居中对齐
   * 右侧的inline元素，'start' - 右侧对齐；'end' - '左侧对齐'; 'middle' - 居中对齐
   */
  alignSelf?: 'start' | 'end' | 'middle';

  // 基础的布局配置
  /** 模块布局位置 */
  orient?: IOrientType;
  /** 模块的布局间距 */
  padding?: ILayoutPaddingSpec;
  /** 是否按照 orient 自动修改 padding，隐藏位于外侧的 padding。目前只在组件上生效 */
  noOuterPadding?: boolean;
  /** 模块的布局大小：宽度 */
  width?: ILayoutNumber;
  /** 模块的布局最大宽度 */
  maxWidth?: ILayoutNumber;
  /** 模块的布局最小宽度 */
  minWidth?: ILayoutNumber;
  /** 模块的布局大小：高度 */
  height?: ILayoutNumber;
  /** 模块的布局最大高度 */
  maxHeight?: ILayoutNumber;
  /** 模块的布局最小高度 */
  minHeight?: ILayoutNumber;
  /** 模块的布局位置偏移：X */
  offsetX?: ILayoutNumber;
  /** 模块的布局位置偏移：Y */
  offsetY?: ILayoutNumber;

  /** 模块的展示层级，当2个模块重叠时，层级较大的展示在上方 */
  zIndex?: number;
  /** 模块是否裁剪超出布局区域外的绘图内容 */
  clip?: boolean;

  // 绝对布局下的对齐设置

  /** 模块绝对布局下，与图表左侧的距离。注意仅在 layoutType === 'absolute' 时生效  */
  left?: ILayoutNumber;
  /** 模块绝对布局下，与图表右侧的距离。注意仅在 layoutType === 'absolute' 时生效  */
  right?: ILayoutNumber;
  /** 模块绝对布局下，与图表顶部的距离。注意仅在 layoutType === 'absolute' 时生效  */
  top?: ILayoutNumber;
  /** 模块绝对布局下，与图表底部的距离。注意仅在 layoutType === 'absolute' 时生效  */
  bottom?: ILayoutNumber;
  /** 模块绝对布局下，元素将放置在图表的正中间。注意仅在 layoutType === 'absolute' 时生效，同时将忽略 padding 属性  */
  center?: boolean;
}

export interface ILayoutItemInitOption {
  layoutType: ILayoutType;
  layoutLevel: number;
  layoutOrient?: IOrientType;
  transformLayoutRect?: (rect: ILayoutRect) => ILayoutRect;
  transformLayoutPosition?: (pos: Partial<IPoint>) => Partial<IPoint>;
}
