import type { IArcMarkSpec, Datum, StateValueType } from '../typings';
import { BaseMark } from './base/base-mark';
import type { IMarkOption, IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
export type IArcMark = IMarkRaw<IArcMarkSpec>;
export declare class BaseArcMark<T extends IArcMarkSpec> extends BaseMark<T> implements IMarkRaw<T> {
    readonly type: MarkTypeEnum;
    _unCompileChannel: {
        centerOffset: boolean;
        radiusOffset: boolean;
    };
    constructor(name: string, option: IMarkOption);
    protected _getDefaultStyle(): IMarkStyle<T>;
    protected computeOuterRadius: (key: string, datum: Datum, states: StateValueType, opt: any, superValue: number) => number;
    protected computeCenter: (key: 'x' | 'y', datum: Datum, states: StateValueType, opt: any, center: number) => number;
}
export declare class ArcMark extends BaseArcMark<IArcMarkSpec> implements IArcMark {
    static readonly type = MarkTypeEnum.arc;
    readonly type: MarkTypeEnum;
}
export declare const registerArcMark: () => void;
