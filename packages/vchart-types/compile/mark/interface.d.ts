import type { IMarkProgressiveConfig, IMarkStateStyle, MarkType } from '../../mark/interface';
import type { IModel } from '../../model/interface';
import type { GrammarItemCompileOption, GrammarItemInitOption } from '../interface';
import type { IGrammarItem } from '../interface';
import type { MarkStateManager } from './mark-state-manager';
import type { DataView } from '@visactor/vdataset';
import type {
  IAnimate,
  IAnimateArranger,
  IElement,
  IGroupMark,
  IMark,
  MarkAnimationSpec,
  Nil,
  TransformSpec
} from '@visactor/vgrammar-core';
import type { Maybe, Datum, StringOrNumber } from '../../typings';
import type { MarkData } from './mark-data';
import type { ILabelSpec } from '../../component/label';
import type { IRegion } from '../../region/interface';
export interface ICompilableMarkOption extends GrammarItemInitOption {
  key?: string | ((datum: Datum) => string);
  groupKey?: string;
  skipBeforeLayouted?: boolean;
  support3d?: boolean;
  mode?: '2d' | '3d';
}
export interface ICompilableMark extends IGrammarItem {
  readonly type: MarkType;
  readonly id: number;
  readonly name: string;
  readonly key?: string | ((datum: Datum) => string);
  readonly model: IModel;
  getData: () => MarkData | undefined;
  setData: (d: MarkData) => void;
  getDataView: () => DataView | undefined;
  setDataView: (d?: DataView, productId?: string) => void;
  getFacet: () => string | undefined;
  setFacet: (facet: string) => void;
  getLabelSpec: () => ILabelSpec[];
  setLabelSpec: (label: ILabelSpec | ILabelSpec[]) => void;
  addLabelSpec: (label: ILabelSpec) => void;
  state: MarkStateManager;
  readonly stateStyle: IMarkStateStyle<any>;
  hasState: (state: string) => boolean;
  getState: (state: string) => any;
  updateState: (newState: Record<string, unknown>) => Promise<void>;
  updateStaticEncode: () => void;
  compileEncode: () => void;
  updateLayoutState: (noRender?: boolean, recursion?: boolean) => Promise<void>;
  updateMarkState: (key: string) => void;
  setTransform: (transform: TransformSpec[] | Nil) => void;
  getInteractive: () => boolean;
  setInteractive: (interactive: boolean) => void;
  setAnimationConfig: (config: Partial<MarkAnimationSpec>) => void;
  getAnimationConfig: () => Partial<MarkAnimationSpec>;
  getZIndex: () => number;
  setZIndex: (zIndex: number) => void;
  getVisible: () => boolean;
  setVisible: (visible: boolean) => void;
  getMorph: () => boolean;
  setMorph: (morph: boolean) => void;
  getProgressiveConfig: () => IMarkProgressiveConfig;
  setProgressiveConfig: (config: IMarkProgressiveConfig) => void;
  getMorphKey: () => string | undefined;
  setMorphKey: (morphKey: string) => void;
  getMorphElementKey: () => string | undefined;
  setMorphElementKey: (morphKey: string) => void;
  getGroupKey: () => string | undefined;
  setGroupKey: (groupKey: string) => void;
  getUserId: () => StringOrNumber | undefined;
  setUserId: (id: StringOrNumber) => void;
  getSupport3d: () => boolean | undefined;
  compile: (option?: IMarkCompileOption) => void;
  getProduct: () => Maybe<IMark>;
  getMarks: () => ICompilableMark[];
  setSkipBeforeLayouted: (skip: boolean) => void;
  getSkipBeforeLayouted: () => boolean;
  runAnimationByState: (animationState?: string) => IAnimateArranger;
  stopAnimationByState: (animationState?: string) => IAnimate;
  pauseAnimationByState: (animationState: string) => IAnimate;
  resumeAnimationByState: (animationState: string) => IAnimate;
}
export interface IMarkDataInitOption extends ICompilableMarkOption {
  mark: ICompilableMark;
}
export interface IMarkCompileOption extends GrammarItemCompileOption {
  group?: string | IGroupMark;
  ignoreChildren?: boolean;
}
export interface IStateInfo {
  stateValue: StateValue;
  fields?: any | null | undefined;
  datums?: any[] | null | undefined;
  datumKeys?: string[] | null | undefined;
  items?: any[] | null | undefined;
  filter?: ((datum: any, options: Record<string, any>) => boolean) | null | undefined;
  cache?: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  level?: number | undefined;
}
export interface IStateSpec {
  stateValue: StateValue;
  datums?: any[] | null | undefined;
  datumKeys?: string[] | null | undefined;
  level?: number | undefined;
}
export interface IMarkState {
  readonly id: number;
  getStates: () => IStateInfo[];
  getState: (stateValue: StateValue) => IStateInfo | undefined;
  addState: (stateInfo: IStateInfo) => void;
  changeState: (stateInfo: Partial<IStateInfo>, update?: boolean) => void;
  checkState: (item: any, datum: any) => string[];
  clearState: (stateValues: StateValue[], update?: boolean) => void;
  update: () => void;
}
export declare enum STATE_VALUE_ENUM {
  STATE_NORMAL = 'normal',
  STATE_HOVER = 'hover',
  STATE_HOVER_REVERSE = 'hover_reverse',
  STATE_DIMENSION_HOVER = 'dimension_hover',
  STATE_DIMENSION_HOVER_REVERSE = 'dimension_hover_reverse',
  STATE_SELECTED = 'selected',
  STATE_SELECTED_REVERSE = 'selected_reverse'
}
export declare enum STATE_VALUE_ENUM_REVERSE {
  STATE_HOVER_REVERSE = 'hover_reverse',
  STATE_DIMENSION_HOVER_REVERSE = 'dimension_hover_reverse',
  STATE_SELECTED_REVERSE = 'selected_reverse'
}
export type STATE_NORMAL = typeof STATE_VALUE_ENUM.STATE_NORMAL;
export type STATE_HOVER = typeof STATE_VALUE_ENUM.STATE_HOVER;
export type STATE_HOVER_REVERSE = typeof STATE_VALUE_ENUM.STATE_HOVER_REVERSE;
export type STATE_CUSTOM = string;
export type StateValueNot = STATE_HOVER_REVERSE | STATE_CUSTOM;
export type StateValue = STATE_NORMAL | STATE_HOVER | STATE_CUSTOM;
export type StateValueType = StateValue | StateValueNot;
export declare enum STATE_LEVEL {
  NORMAL = 0,
  DIMENSION_SELECTED = 1,
  RELATIONAL_SELECTED = 2,
  SELECTED = 3,
  DIMENSION_HOVER = 4,
  RELATIONAL_HOVER = 5,
  HOVER = 6
}
export interface IAttributeOpt {
  element: IElement;
  mark: IElement['mark'];
  parent: IElement['mark']['group'];
}
export interface IModelMarkAttributeContext {
  [key: string]: unknown;
}
export interface ISeriesMarkAttributeContext extends IModelMarkAttributeContext {
  globalScale: (scaleKey: string, value: string | number) => unknown;
  seriesColor: (seriesValue?: string | number) => string;
  getRegion: () => IRegion;
}
