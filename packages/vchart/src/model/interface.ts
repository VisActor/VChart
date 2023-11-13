import type { IBoundsLike } from '@visactor/vutils';
import type { DataSet } from '@visactor/vdataset';
import type { IEvent, IEventDispatcher } from '../event/interface';
import type { IMark, IMarkRaw, IMarkStyle, MarkTypeEnum } from '../mark/interface';
import type { RenderMode } from '../typings/spec/common';
import type { VChart } from '../vchart-all';
import type { IData } from '@visactor/vgrammar-core';
import type { StringOrNumber } from '../typings/common';
import type { IGroupMarkSpec, ConvertToMarkStyleSpec, ICommonSpec } from '../typings/visual';
import type { IRect } from '../typings/space';
import type { IPoint, CoordinateType } from '../typings/coordinate';
import type { ITheme } from '../theme';
import type { StateValueType } from '../typings/spec';
import type { ICompilable, ICompilableInitOption } from '../compile/interface';
import type { ICompilableData } from '../compile/data';
import type { IGlobalScale } from '../scale/interface';
import type { IChart } from '../chart/interface';
import type { IChartLevelTheme } from '../core/interface';
import type { IThemeColorScheme } from '../theme/color-scheme/interface';
import type { ILayoutItem, ILayoutItemSpec, ILayoutPoint, ILayoutRect, ILayoutRectLevel } from '../layout/interface';

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

export interface IModel extends ICompilable {
  readonly modelType: string;
  readonly type: string;
  readonly specKey: string;

  readonly id: number;

  readonly userId?: StringOrNumber;

  // 事件
  readonly event: IEvent;

  // 副作用
  readonly effect: IEffect;

  coordinate?: CoordinateType;

  // 布局
  layout?: ILayoutItem;

  /** 是否可见 */
  getVisible: () => boolean;

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
}

export interface ILayoutModel extends IModel {
  // 布局相关
  getLayoutStartPoint: () => IPoint;
  setLayoutStartPosition: (pos: Partial<IPoint>) => void;
  getLayoutRect: () => ILayoutRect;
  setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRectLevel>) => void;

  getLastComputeOutBounds: () => IBoundsLike;

  getBoundsInRect: (rect: ILayoutRect, fullRect: ILayoutRect) => IBoundsLike;

  //布局周期
  onLayoutStart: (layoutRect: IRect, viewRect: ILayoutRect, ctx: IModelLayoutOption) => void;
  afterSetLayoutStartPoint: (pos: ILayoutPoint) => void;
  onLayoutEnd: (ctx: IModelLayoutOption) => void;
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

export type ILayoutModelState = {
  layoutUpdateRank: number;
  [key: string]: unknown;
};

// TODO: 补充model共有配置
export type IModelSpec = ILayoutItemSpec & { id?: StringOrNumber };

export interface IModelMarkInfo {
  /** mark 类型 */
  type: MarkTypeEnum | string | (MarkTypeEnum | string)[];
  /** mark 名称 */
  name: string;
}
