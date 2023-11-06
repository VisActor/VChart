import type { IAttributeOpt, IModelMarkAttributeContext } from '../../compile/mark/interface';
import type { Datum, IMarkSpec, ICommonSpec } from '../../typings';
import type { IMarkRaw, IMarkStateStyle, IMarkStyle, IMarkOption, StyleConvert, MarkInputStyle } from '../interface';
import { CompilableMark } from '../../compile/mark/compilable-mark';
import type { StateValueType } from '../../compile/mark';
export type ExChannelCall = (key: string | number | symbol, datum: Datum, states: StateValueType, opt: unknown, baseValue: unknown) => unknown;
export declare class BaseMark<T extends ICommonSpec> extends CompilableMark implements IMarkRaw<T> {
    stateStyle: IMarkStateStyle<T>;
    protected _option: IMarkOption;
    protected _attributeContext: IModelMarkAttributeContext;
    _extensionChannel: {
        [key: string | number | symbol]: string[];
    };
    _computeExChannel: {
        [key: string | number | symbol]: ExChannelCall;
    };
    constructor(name: string, option: IMarkOption);
    created(): void;
    initStyleWithSpec(spec: IMarkSpec<T>, key?: string): void;
    convertAngleToRadian(styleConverter: StyleConvert<number>): StyleConvert<any>;
    isUserLevel(level: number): boolean;
    setStyle<U extends keyof T>(style: Partial<IMarkStyle<T>>, state?: StateValueType, level?: number, stateStyle?: IMarkStateStyle<T>): void;
    getStyle(key: string, state?: StateValueType): any;
    protected _filterStyle(style: Partial<IMarkStyle<T>>, state: StateValueType, level: number, stateStyle?: IMarkStateStyle<T>): Partial<IMarkStyle<T>>;
    protected _filterAttribute<U extends keyof T>(attr: U, style: MarkInputStyle<T[U]>, state: StateValueType, level: number, isUserLevel: boolean, stateStyle?: IMarkStateStyle<T>): StyleConvert<T[U]>;
    setReferer<U extends keyof T>(mark: IMarkRaw<T>, styleKey?: U, state?: StateValueType, stateStyle?: IMarkStateStyle<T>): void;
    setPostProcess<U extends keyof T>(key: U, postProcessFunc: any, state?: StateValueType): void;
    getAttribute<U extends keyof T>(key: U, datum: Datum, state?: StateValueType, opt?: IAttributeOpt): unknown;
    setAttribute<U extends keyof T>(attr: U, style: MarkInputStyle<T[U]>, state?: StateValueType, level?: number, stateStyle?: IMarkStateStyle<T>): void;
    protected _getDefaultStyle(): IMarkStyle<T>;
    protected _styleConvert<U extends keyof T>(style?: MarkInputStyle<T[U]>): StyleConvert<T[U]> | undefined;
    protected _computeAttribute<U extends keyof T>(key: U, state: StateValueType): (datum: Datum, opt: IAttributeOpt) => unknown;
    protected _computeStateAttribute<U extends keyof T>(stateStyle: any, key: U, state: StateValueType): (datum: Datum, opt: IAttributeOpt) => any;
    private _initStyle;
    private _initSpecStyle;
    private _computeGradientAttr;
    private _computeBorderAttr;
}
