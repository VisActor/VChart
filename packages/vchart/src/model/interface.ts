import type { IBoundsLike } from '@visactor/vutils';
import type { DataSet, DataView } from '@visactor/vdataset';
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
import type { IChart, IChartSpecInfo } from '../chart/interface';
import type { IThemeColorScheme } from '../theme/color-scheme/interface';
import type { ILayoutItem, ILayoutItemSpec } from '../layout/interface';
import type { ILayoutPoint, ILayoutRect } from '../typings/layout';
import type { ComponentTypeEnum } from '../component/interface';
import type { SeriesMarkNameEnum, SeriesTypeEnum } from '../series';
import type { TransformedLabelSpec } from '../component/label';

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
  readonly transformerConstructor: new (option: IBaseModelSpecTransformerOption) => IBaseModelSpecTransformer;

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
  /** updateSpec 或者切换主题后，根据新 spec 执行的初始化过程 */
  reInit: (spec?: any) => void;
  beforeRelease: () => void;

  onEvaluateEnd: (ctx: IModelEvaluateOption) => void;
  onRender: (ctx: IModelRenderOption) => void;
  onDataUpdate: () => void;

  updateSpec: (spec: any, totalSpec?: any) => IUpdateSpecResult;
  getSpec?: () => any;
  getSpecIndex: () => number;
  getSpecPath: () => Array<string | number>;

  //布局周期
  onLayoutStart: (layoutRect: IRect, viewRect: ILayoutRect, ctx: IModelLayoutOption) => void;
  onLayoutEnd: (ctx: IModelLayoutOption) => void;

  getColorScheme: () => IThemeColorScheme | undefined;

  setMarkStyle: <T extends ICommonSpec>(
    mark?: IMarkRaw<T>,
    style?: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>,
    state?: StateValueType,
    level?: number
  ) => void;

  initMarkStyleWithSpec: (mark?: IMark, spec?: any, key?: string) => void;

  getSpecInfo: () => IModelSpecInfo;
}

export interface ILayoutModel extends IModel {
  // 布局相关
  getLayoutStartPoint: () => IPoint;
  setLayoutStartPosition: (pos: Partial<IPoint>) => void;
  getLayoutRect: () => ILayoutRect;
  setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRect>) => void;

  getLastComputeOutBounds: () => IBoundsLike;

  getBoundsInRect: (rect: ILayoutRect, fullRect: ILayoutRect) => IBoundsLike;

  //布局周期
  afterSetLayoutStartPoint: (pos: ILayoutPoint) => void;
}

export interface IModelOption extends ICompilableInitOption {
  type: string;
  eventDispatcher: IEventDispatcher;
  dataSet: DataSet;
  map: Map<StringOrNumber, IModel | IMark>;
  mode: RenderMode;
  globalInstance: VChart;
  regionIndexes?: Array<number>;
  specKey?: string;
  specPath?: Array<string | number>;
  specInfoPath?: Array<string | number>;

  getTheme?: () => ITheme;
  getSpecInfo?: () => IChartSpecInfo;
  getChartLayoutRect: () => IRect;
  getChartViewRect: () => ILayoutRect;

  getChart: () => IChart;
  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => DataView | undefined;

  globalScale: IGlobalScale;
  animation: boolean;
  /**
   * 错误消息回调函数
   */
  onError: (...args: any[]) => void;

  /**
   * 是否关闭交互效果
   */
  disableTriggerEvent?: boolean;
}

export interface IModelSpecInfo<T extends Record<string, unknown> = any> {
  /** model 具体类型 */
  type: string | ComponentTypeEnum | SeriesTypeEnum;
  /** model spec */
  spec: T;
  /** 该 spec 在图表 spec 上的路径 */
  specPath?: Array<string | number>;
  /** 该 spec 在图表 spec info 上的路径 */
  specInfoPath?: Array<string | number>;
  /** model 当前主题 */
  theme?: any;
  /** model 对应的 region 索引 */
  regionIndexes?: number[];
  /** model 对应的 series 索引 */
  seriesIndexes?: number[];
}

export interface IModelConstructor {
  readonly transformerConstructor: new (option: IBaseModelSpecTransformerOption) => IBaseModelSpecTransformer;
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

export interface IBaseModelSpecTransformerOption {
  type: string;
  getTheme: () => ITheme;
}

export interface IBaseModelSpecTransformerResult<T, K> {
  spec: T;
  theme: K;
  markLabelSpec?: Partial<Record<SeriesMarkNameEnum, TransformedLabelSpec[]>>;
}

export interface IBaseModelSpecTransformer {
  getTheme: (spec: any, chartSpec: any) => any;
  transformSpec: (
    spec: any,
    chartSpec: any,
    chartSpecInfo?: IChartSpecInfo
  ) => IBaseModelSpecTransformerResult<any, any>;
}
