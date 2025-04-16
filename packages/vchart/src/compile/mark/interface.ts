import type { IMarkStateStyle, MarkType } from '../../mark/interface';
import type { IModel } from '../../model/interface';
import type { GrammarItemCompileOption, GrammarItemInitOption, IGrammarItem } from '../interface';
import type { DataView } from '@visactor/vdataset';
import type {
  IAnimate,
  IAnimateArranger,
  IElement,
  IGroupMark,
  IMark,
  IMarkConfig,
  MarkAnimationSpec,
  Nil,
  TransformSpec
} from '@visactor/vgrammar-core';
import type { Maybe, Datum, StringOrNumber } from '../../typings';
import type { IRegion } from '../../region/interface';
import type { ICompilableData } from '../data/interface';

export interface IMarkStateManager {
  getStateInfoList: () => IStateInfo[];
  getStateInfo: (stateValue: StateValue) => IStateInfo;
  addStateInfo: (stateInfo: IStateInfo) => void;
  changeStateInfo: (stateInfo: Partial<IStateInfo>) => void;
  clearStateInfo: (stateValues: StateValue[]) => void;
  checkOneState: (
    renderNode: IElement,
    datum: Datum | Datum[],
    state: IStateInfo,
    isMultiMark?: boolean
  ) => 'in' | 'out' | 'skip';
  checkState: (renderNode: IElement, datum: Datum | Datum[]) => StateValue[];
  updateLayoutState: (noRender?: boolean) => void;
}

export interface IMarkData extends ICompilableData {
  setCompiledProductId: (name: string) => any;
  generateProductId: () => string;
}

export interface ICompilableMarkOption extends GrammarItemInitOption {
  key?: string | ((datum: Datum) => string);
  /** 分组字段，更多用于 morphing 动画的 element 匹配 */
  groupKey?: string;
  /** 是否在dataflow的过程中，布局前跳过该mark */
  skipBeforeLayouted?: boolean;

  /* VGrammar的组件是否支持3d */
  mode?: '2d' | '3d';
  /** don't separate style of mark */
  noSeparateStyle?: boolean;
}

export interface ICompilableMark extends IGrammarItem {
  // 类型
  readonly type: MarkType;
  // id
  readonly id: number;
  // name
  readonly name: string;
  // key field
  readonly key?: string | ((datum: Datum) => string);
  // parent model
  readonly model: IModel;

  // 数据 可以没有
  getData: () => IMarkData | undefined;
  setData: (d: IMarkData) => void;
  getDataView: () => DataView | undefined;
  setDataView: (d?: DataView, productId?: string) => void;

  // 状态
  state: IMarkStateManager;
  readonly stateStyle: IMarkStateStyle<any>;
  hasState: (state: string) => boolean;
  getState: (state: string) => any;
  updateState: (newState: Record<string, unknown>) => void;
  /** 更新group | enter中的静态样式 */
  updateStaticEncode: () => void;
  /** 更新 mark 样式 */
  compileEncode: () => void;
  /** 更新encode中的样式 */
  updateLayoutState: (noRender?: boolean, recursion?: boolean) => void;
  /** 更新某一个状态 */
  updateMarkState: (key: string) => void;

  // transform
  setTransform: (transform: TransformSpec[] | Nil) => void;

  // 动画配置
  setAnimationConfig: (config: Partial<MarkAnimationSpec>) => void;
  getAnimationConfig: () => Partial<MarkAnimationSpec>;

  // 是否显示
  getVisible: () => boolean;
  setVisible: (visible: boolean) => void;

  // groupKey 配置
  getGroupKey: () => string | undefined;
  setGroupKey: (groupKey: string) => void;

  // 用户 id
  getUserId: () => StringOrNumber | undefined;
  setUserId: (id: StringOrNumber) => void;

  compile: (option?: IMarkCompileOption) => void;

  getProduct: () => Maybe<IMark>;
  getProductElements: () => Maybe<IMark['elements']>;

  /** 获取子mark */
  getMarks: () => ICompilableMark[];

  /** 是否跳过布局阶段 */
  setSkipBeforeLayouted: (skip: boolean) => void;
  getSkipBeforeLayouted: () => boolean;

  setStateSortCallback: (stateSort: (stateA: string, stateB: string) => number) => void;

  getMarkConfig: () => IMarkConfig;
  setMarkConfig: (config: IMarkConfig) => void;

  /** 开始状态动画 */
  runAnimationByState: (animationState?: string) => IAnimateArranger;
  /** 停止状态动画*/
  stopAnimationByState: (animationState?: string) => IAnimate;
  /** 暂停状态动画*/
  pauseAnimationByState: (animationState: string) => IAnimate;
  /** 恢复状态动画*/
  resumeAnimationByState: (animationState: string) => IAnimate;
}

export interface IMarkDataInitOption extends ICompilableMarkOption {
  mark: ICompilableMark;
}

export interface IMarkCompileOption extends GrammarItemCompileOption {
  group?: string | IGroupMark;
  ignoreChildren?: boolean;
  context?: any;
}

export interface IStateInfo {
  /** 状态值 */
  stateValue: StateValue;
  // 对应的数据维度 可以是多维度
  // TODO: fields 是否保留
  fields?: any | null | undefined;
  /** 筛选数据 */
  datums?: any[] | null | undefined;
  /** 筛选数据 */
  datumKeys?: string[] | null | undefined;
  /** 筛选 item */
  items?: any[] | null | undefined;
  /** 筛选函数 */
  filter?: ((datum: any, options: Record<string, any>) => boolean) | null | undefined;
  cache?: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  /** 状态优先级 */
  level?: number | undefined;
}
// TODO:目前看这个类型没有必要，确认后彻底删除
export interface IStateSpec {
  /** 状态值 */
  stateValue: StateValue;
  /** 筛选数据 */
  datums?: any[] | null | undefined;
  /** 筛选数据对应字段 */
  datumKeys?: string[] | null | undefined;
  /** TODO: 暂时不提供 filter 函数形式 */
  // filter?:
  //   | ((datum: any, options: Record<string, any>) => boolean)
  //   | null
  //   | undefined;
  /** 状态优先级 */
  level?: number | undefined;
}

export interface IMarkState {
  readonly id: number;
  // 状态
  getStates: () => IStateInfo[];

  // state 相关
  getState: (stateValue: StateValue) => IStateInfo | undefined;
  addState: (stateInfo: IStateInfo) => void;
  changeState: (stateInfo: Partial<IStateInfo>, update?: boolean) => void;
  checkState: (item: any, datum: any) => string[];

  clearState: (stateValues: StateValue[], update?: boolean) => void;

  // 更新
  update: () => void;
}

export enum STATE_VALUE_ENUM {
  STATE_NORMAL = 'normal',

  STATE_HOVER = 'hover',
  STATE_HOVER_REVERSE = 'hover_reverse',

  STATE_DIMENSION_HOVER = 'dimension_hover',
  STATE_DIMENSION_HOVER_REVERSE = 'dimension_hover_reverse',

  STATE_SELECTED = 'selected',
  STATE_SELECTED_REVERSE = 'selected_reverse',

  // todo: 2.0考虑优化
  STATE_SANKEY_EMPHASIS = 'selected',
  STATE_SANKEY_EMPHASIS_REVERSE = 'blur'
}

export enum STATE_VALUE_ENUM_REVERSE {
  STATE_HOVER_REVERSE = 'hover_reverse',
  STATE_DIMENSION_HOVER_REVERSE = 'dimension_hover_reverse',
  STATE_SELECTED_REVERSE = 'selected_reverse'
}

export type STATE_NORMAL = typeof STATE_VALUE_ENUM.STATE_NORMAL;
export type STATE_HOVER = typeof STATE_VALUE_ENUM.STATE_HOVER;
export type STATE_HOVER_REVERSE = typeof STATE_VALUE_ENUM.STATE_HOVER_REVERSE;
export type STATE_CUSTOM = string;

// TODO: 待补充

export type StateValueNot = STATE_HOVER_REVERSE | STATE_CUSTOM;
export type StateValue = STATE_NORMAL | STATE_HOVER | STATE_CUSTOM;
export type StateValueType = StateValue | StateValueNot;

export interface IAttributeOpt {
  element: IElement;
  mark: IElement['mark'];
  parent: IElement['mark']['group'];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModelMarkAttributeContext {
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISeriesMarkAttributeContext extends IModelMarkAttributeContext {
  // 通用的默认属性值获取，比如color，如果有散点图有sizeScale，则可以获取 size
  globalScale: (scaleKey: string, value: string | number) => unknown;
  // 传入seriesField值，获取对应的颜色。
  // 如果传入 null ，返回的是当前系列对应的第一个颜色值。
  seriesColor: (seriesValue?: string | number) => string;
  /**
   * 获取当前的 region
   * @returns
   */
  getRegion: () => IRegion;
}
