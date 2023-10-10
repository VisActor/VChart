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
export type IPercentOffset = {
  percent?: number;
  offset?: number;
};
export type ILayoutPercent = IPercent | number;
type ILayoutType = 'region-relative' | 'region' | 'normal' | 'absolute' | 'normal-inline';
export type ILayoutOrientPadding = {
  left?: ILayoutNumber;
  right?: ILayoutNumber;
  top?: ILayoutNumber;
  bottom?: ILayoutNumber;
};
export type ILayoutPaddingSpec = ILayoutOrientPadding | ILayoutNumber | ILayoutNumber[];
export interface ILayoutItem {
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
  layoutLevel: number;
  layoutZIndex: number;
  chartLayoutRect: ILayoutRect;
  getVisible: () => boolean;
  getSpec?: () => any;
  getAutoIndent: () => boolean;
  getLayoutStartPoint: () => ILayoutPoint;
  getLayoutRect: () => ILayoutRect;
  getLastComputeOutBounds: () => IBoundsLike;
  setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRectLevel>) => void;
  computeBoundsInRect: (rect: ILayoutRect) => ILayoutRect;
  setLayoutStartPosition: (pos: Partial<IPoint>) => void;
  absoluteLayoutInRect: (rect: IRect) => void;
  updateLayoutAttribute: () => void;
}
export interface ILayoutItemSpec {
  layoutType?: ILayoutType;
  layoutLevel?: number;
  orient?: IOrientType;
  padding?: ILayoutPaddingSpec;
  noOuterPadding?: boolean;
  width?: ILayoutNumber;
  maxWidth?: ILayoutNumber;
  minWidth?: ILayoutNumber;
  height?: ILayoutNumber;
  maxHeight?: ILayoutNumber;
  minHeight?: ILayoutNumber;
  offsetX?: ILayoutNumber;
  offsetY?: ILayoutNumber;
  zIndex?: number;
  clip?: boolean;
  left?: ILayoutNumber;
  right?: ILayoutNumber;
  top?: ILayoutNumber;
  bottom?: ILayoutNumber;
  center?: boolean;
}
export interface IModelInitOption {}
export interface IModelLayoutOption {}
export interface IModelEvaluateOption {}
export interface IModelRenderOption {}
export interface IEffect {
  [key: string]: (e?: any) => any;
}
export interface IMarkTreeGroup extends Partial<IMarkStyle<IGroupMarkSpec>> {
  type: 'group';
  name: string;
  marks: (IMarkTreeGroup | IMark)[];
}
export type IMarkTree = IMarkTreeGroup | IMark | (IMarkTreeGroup | IMark)[];
export interface IUpdateSpecResult {
  change: boolean;
  reMake: boolean;
  reRender?: boolean;
  reSize?: boolean;
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
  readonly event: IEvent;
  readonly effect: IEffect;
  readonly state: ModelStateManager;
  getState: () => ModelStateManager['_stateMap'];
  coordinate?: CoordinateType;
  getOption: () => IModelOption;
  getMarks: () => IMark[];
  getMarkNameMap: () => Record<string, IMark>;
  getMarkInfoList: () => IModelMarkInfo[];
  getData: () => ICompilableData;
  getChart: () => IChart;
  created: () => void;
  init: (option: IModelInitOption) => void;
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
  setTheme: (theme?: any) => void;
  setCurrentTheme: (theme: any, noRender?: boolean) => void;
  setMarkStyle: <T extends ICommonSpec>(
    mark?: IMarkRaw<T>,
    style?: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>,
    state?: StateValueType,
    level?: number
  ) => void;
  initMarkStyleWithSpec: (mark?: IMark, spec?: any, key?: string) => void;
  tooltipHelper: ITooltipHelper;
  bindSceneNode: (node: IElement) => void;
  getSceneNodes: () => IElement[];
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
  getTheme?: () => ITheme;
  getChartLayoutRect: () => IRect;
  getChartViewRect: () => ILayoutRect;
  getChart: () => IChart;
  globalScale: IGlobalScale;
  animation: boolean;
  onError: (...args: any[]) => void;
}
export interface IModelConstructor {
  new (ctx: IModelOption): IModel;
}
export type ILayoutModelState = ModelStateManager['_stateMap'];
export type IModelSpec = ILayoutItemSpec & {
  id?: StringOrNumber;
};
export interface IModelMarkInfo {
  type: MarkTypeEnum | string | (MarkTypeEnum | string)[];
  name: string;
}
export {};
