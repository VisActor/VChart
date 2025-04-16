import type { IMarkStateStyle, MarkType } from '../../mark/interface';
import type { IModel } from '../../model/interface';
import type { GrammarItemCompileOption, GrammarItemInitOption, IGrammarItem } from '../interface';
import type { DataView } from '@visactor/vdataset';
import type { IAnimate, IAnimateArranger, IElement, IGroupMark, IMark, IMarkConfig, MarkAnimationSpec, Nil, TransformSpec } from '@visactor/vgrammar-core';
import type { Maybe, Datum, StringOrNumber } from '../../typings';
import type { IRegion } from '../../region/interface';
import type { ICompilableData } from '../data/interface';
export interface IMarkStateManager {
    getStateInfoList: () => IStateInfo[];
    getStateInfo: (stateValue: StateValue) => IStateInfo;
    addStateInfo: (stateInfo: IStateInfo) => void;
    changeStateInfo: (stateInfo: Partial<IStateInfo>) => void;
    clearStateInfo: (stateValues: StateValue[]) => void;
    checkOneState: (renderNode: IElement, datum: Datum | Datum[], state: IStateInfo, isMultiMark?: boolean) => 'in' | 'out' | 'skip';
    checkState: (renderNode: IElement, datum: Datum | Datum[]) => StateValue[];
    updateLayoutState: (noRender?: boolean) => void;
}
export interface IMarkData extends ICompilableData {
    setCompiledProductId: (name: string) => any;
    generateProductId: () => string;
}
export interface ICompilableMarkOption extends GrammarItemInitOption {
    key?: string | ((datum: Datum) => string);
    groupKey?: string;
    skipBeforeLayouted?: boolean;
    mode?: '2d' | '3d';
    noSeparateStyle?: boolean;
}
export interface ICompilableMark extends IGrammarItem {
    readonly type: MarkType;
    readonly id: number;
    readonly name: string;
    readonly key?: string | ((datum: Datum) => string);
    readonly model: IModel;
    getData: () => IMarkData | undefined;
    setData: (d: IMarkData) => void;
    getDataView: () => DataView | undefined;
    setDataView: (d?: DataView, productId?: string) => void;
    state: IMarkStateManager;
    readonly stateStyle: IMarkStateStyle<any>;
    hasState: (state: string) => boolean;
    getState: (state: string) => any;
    updateState: (newState: Record<string, unknown>) => void;
    updateStaticEncode: () => void;
    compileEncode: () => void;
    updateLayoutState: (noRender?: boolean, recursion?: boolean) => void;
    updateMarkState: (key: string) => void;
    setTransform: (transform: TransformSpec[] | Nil) => void;
    setAnimationConfig: (config: Partial<MarkAnimationSpec>) => void;
    getAnimationConfig: () => Partial<MarkAnimationSpec>;
    getVisible: () => boolean;
    setVisible: (visible: boolean) => void;
    getGroupKey: () => string | undefined;
    setGroupKey: (groupKey: string) => void;
    getUserId: () => StringOrNumber | undefined;
    setUserId: (id: StringOrNumber) => void;
    compile: (option?: IMarkCompileOption) => void;
    getProduct: () => Maybe<IMark>;
    getProductElements: () => Maybe<IMark['elements']>;
    getMarks: () => ICompilableMark[];
    setSkipBeforeLayouted: (skip: boolean) => void;
    getSkipBeforeLayouted: () => boolean;
    setStateSortCallback: (stateSort: (stateA: string, stateB: string) => number) => void;
    getMarkConfig: () => IMarkConfig;
    setMarkConfig: (config: IMarkConfig) => void;
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
    context?: any;
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
    STATE_NORMAL = "normal",
    STATE_HOVER = "hover",
    STATE_HOVER_REVERSE = "hover_reverse",
    STATE_DIMENSION_HOVER = "dimension_hover",
    STATE_DIMENSION_HOVER_REVERSE = "dimension_hover_reverse",
    STATE_SELECTED = "selected",
    STATE_SELECTED_REVERSE = "selected_reverse",
    STATE_SANKEY_EMPHASIS = "selected",
    STATE_SANKEY_EMPHASIS_REVERSE = "blur"
}
export declare enum STATE_VALUE_ENUM_REVERSE {
    STATE_HOVER_REVERSE = "hover_reverse",
    STATE_DIMENSION_HOVER_REVERSE = "dimension_hover_reverse",
    STATE_SELECTED_REVERSE = "selected_reverse"
}
export type STATE_NORMAL = typeof STATE_VALUE_ENUM.STATE_NORMAL;
export type STATE_HOVER = typeof STATE_VALUE_ENUM.STATE_HOVER;
export type STATE_HOVER_REVERSE = typeof STATE_VALUE_ENUM.STATE_HOVER_REVERSE;
export type STATE_CUSTOM = string;
export type StateValueNot = STATE_HOVER_REVERSE | STATE_CUSTOM;
export type StateValue = STATE_NORMAL | STATE_HOVER | STATE_CUSTOM;
export type StateValueType = StateValue | StateValueNot;
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
