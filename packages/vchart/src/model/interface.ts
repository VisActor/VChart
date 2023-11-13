import type { IBoundsLike } from '@visactor/vutils';
import type { DataSet } from '@visactor/vdataset';
import type { IEvent, IEventDispatcher } from '../event/interface';
import type { IMark, IMarkRaw, IMarkStyle, MarkTypeEnum } from '../mark/interface';
import type { RenderMode } from '../typings/spec/common';
import type { VChart } from '../vchart-all';
import type { IData, IElement, IMark as IVGrammarMark } from '@visactor/vgrammar-core';
import type {
  IOrientType,
  IPoint,
  IGroupMarkSpec,
  ConvertToMarkStyleSpec,
  CoordinateType,
  ICommonSpec,
  IRect,
  StringOrNumber
} from '../typings';
import type { ITheme } from '../theme';
import type { StateValueType } from '../typings/spec';
import type { ITooltipHelper } from './tooltip-helper';
import type { ModelStateManager } from './model-state-manager';
import type { ICompilable, ICompilableInitOption } from '../compile/interface';
import type { ICompilableData } from '../compile/data';
import type { IGlobalScale } from '../scale/interface';
import type { IChart } from '../chart/interface';
import type { IChartLevelTheme } from '../core/interface';
import type { IThemeColorScheme } from '../theme/color-scheme/interface';

export type ILayoutNumber = number | IPercent | ((layoutRect: ILayoutRect) => number) | IPercentOffset;

export interface ILayoutPoint {
  x: number;
  y: number;
}

export interface ILayoutRectLevel {
  width: number;
  height: number;
}
export interface ILayoutRect {
  width: number;
  height: number;
}

export type IPercent = `${number}%`;

export type IPercentOffset = { percent?: number; offset?: number };

export type ILayoutPercent = IPercent | number;

/**
 * 相对布局和绝对布局
 * 在相对布局结束后进行二次的绝对布局
 * 绝对布局会只根据 chart 进行相对处理
 */

type ILayoutType = 'region-relative' | 'region' | 'normal' | 'absolute' | 'normal-inline';

export type ILayoutOrientPadding = {
  left?: ILayoutNumber;
  right?: ILayoutNumber;
  top?: ILayoutNumber;
  bottom?: ILayoutNumber;
};

/** 布局 padding的配置 */
export type ILayoutPaddingSpec = ILayoutOrientPadding | ILayoutNumber | ILayoutNumber[];

/**
 * 因为这些元素都会继承到各个模块，所以这里统一有前缀避免语意冲突
 */
export interface ILayoutItem {
  /**
   * 标记这个布局Item的方向（left->right, right->left, top->bottom, bottom->top）
   */
  directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
  layoutClip: boolean;
  layoutType: ILayoutType;
  layoutBindRegionID: number | number[];
  layoutOrient: IOrientType;

  layoutPaddingLeft: number;
  layoutPaddingTop: number;
  layoutPaddingRight: number;
  layoutPaddingBottom: number;

  layoutOffsetX: number;
  layoutOffsetY: number;

  // 越大越先处理
  layoutLevel: number;

  layoutZIndex: number;
  chartLayoutRect: ILayoutRect;

  /** 是否可见 */
  getVisible: () => boolean;

  getSpec?: () => any;

  /** 是否自动缩进 */
  getAutoIndent: () => boolean;

  getLayoutStartPoint: () => ILayoutPoint;
  getLayoutRect: () => ILayoutRect;
  getLastComputeOutBounds: () => IBoundsLike;
  getGraphicBounds: () => IBoundsLike;

  /**
   * 更新元素布局的 layoutRect 大小，用来更新指定布局空间
   */
  setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRectLevel>) => void;
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
  /**
   * 元素内部布局信息更新
   */
  updateLayoutAttribute: () => void;
}

export interface ILayoutItemSpec {
  /** 当前模块的布局类型，配置为 absolute 的话，当前元素会以图表左上角为原点进行绝对布局 */
  layoutType?: ILayoutType;
  /**
   * 布局顺序等级，等级越大的，越优先布局
   * 比如顶部同时有标题和图例的场景，期望标题先放在顶部，然后放置图例。
   */
  layoutLevel?: number;

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

// TODO:
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModelInitOption {}
// TODO:
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModelLayoutOption {}
// TODO:
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModelEvaluateOption {}
// TODO:
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModelRenderOption {}

export interface IEffect {
  [key: string]: (e?: any) => any;
}

export interface IMarkTreeGroup extends Partial<IMarkStyle<IGroupMarkSpec>> {
  // 必须要有名字
  type: 'group';
  name: string;
  marks: (IMarkTreeGroup | IMark)[];
  // TODO: 这里要不要支持复杂场景，有图形组合的场景，用自定义mark？
  // from?: IData;
}

export type IMarkTree = IMarkTreeGroup | IMark | (IMarkTreeGroup | IMark)[];

export interface IUpdateSpecResult {
  change: boolean;
  reMake: boolean;
  reRender?: boolean;
  reSize?: boolean;
  // TODO: compile 的判断应不应该出现在这里?
  reCompile?: boolean;
}

export interface IModelProduct {
  srData: IData;
}

export interface IModel extends ICompilable, ILayoutItem {
  readonly modelType: string;
  readonly type: string;
  readonly specKey: string;

  readonly id: number;

  readonly userId?: StringOrNumber;

  // 事件
  readonly event: IEvent;

  // 副作用
  readonly effect: IEffect;

  // state如果绑定到mark的更新？
  // 组件的 mark 要怎么样描述，才能正确的基于组件状态进行样式更新？
  // 方案1: 组件的 state 关联到 mark 的状态。
  // 方案2: 组件设置 mark 属性，mark自身属性变化时，自己去更新。
  // react state
  readonly state: ModelStateManager;
  getState: () => ModelStateManager['_stateMap'];

  coordinate?: CoordinateType;

  // 初始化参数
  getOption: () => IModelOption;

  getMarks: () => IMark[];
  getMarkNameMap: () => Record<string, IMark>;
  getMarkInfoList: () => IModelMarkInfo[];

  getData: () => ICompilableData;

  getChart: () => IChart;

  //生命周期
  // 创建模块自身内容，设置自身属性
  created: () => void;
  // 用来处理与其他图表模块的联系
  init: (option: IModelInitOption) => void;
  // updateSpec 或者切换主题后，根据新 spec 执行的初始化过程
  reInit: (theme?: any, lastSpec?: any) => void;
  beforeRelease: () => void;

  onLayoutStart: (layoutRect: IRect, viewRect: ILayoutRect, ctx: IModelLayoutOption) => void;
  onLayoutEnd: (ctx: IModelLayoutOption) => void;
  onEvaluateEnd: (ctx: IModelEvaluateOption) => void;
  onRender: (ctx: IModelRenderOption) => void;
  onDataUpdate: () => void;

  updateSpec: (spec: any, totalSpec?: any) => IUpdateSpecResult;
  getSpec?: () => any;
  getSpecIndex: () => number;

  // theme
  setCurrentTheme: (noRender?: boolean) => void;
  getColorScheme: () => IThemeColorScheme | undefined;

  setMarkStyle: <T extends ICommonSpec>(
    mark?: IMarkRaw<T>,
    style?: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>,
    state?: StateValueType,
    level?: number
  ) => void;

  initMarkStyleWithSpec: (mark?: IMark, spec?: any, key?: string) => void;

  /** 绑定场景结点 */
  bindSceneNode: (node: IElement) => void;
  /** 获取场景结点 */
  getSceneNodes: () => IElement[];
  /** 获取场景结点对应 mark */
  getSceneNodeMarks: () => IVGrammarMark[];
}

export interface IModelOption extends ICompilableInitOption {
  eventDispatcher: IEventDispatcher;
  dataSet: DataSet;
  map: Map<StringOrNumber, IModel | IMark>;
  mode: RenderMode;
  globalInstance: VChart;
  specIndex?: number;
  specKey?: string;

  getThemeConfig?: () => {
    globalTheme?: string;
    optionTheme?: string | ITheme;
    specTheme?: string | ITheme;
    chartLevelTheme: IChartLevelTheme;
  };

  getChartLayoutRect: () => IRect;
  getChartViewRect: () => ILayoutRect;

  getChart: () => IChart;

  globalScale: IGlobalScale;
  animation: boolean;
  /**
   * 错误消息回调函数
   */
  onError: (...args: any[]) => void;
}

export interface IModelConstructor {
  new (ctx: IModelOption): IModel;
}

export type ILayoutModelState = ModelStateManager['_stateMap'];

// TODO: 补充model共有配置
export type IModelSpec = ILayoutItemSpec & { id?: StringOrNumber };

export interface IModelMarkInfo {
  /** mark 类型 */
  type: MarkTypeEnum | string | (MarkTypeEnum | string)[];
  /** mark 名称 */
  name: string;
}
