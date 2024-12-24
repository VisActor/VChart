import { BaseMark } from './base/base-mark';
import type { IRippleMarkSpec } from '../typings/visual';
import type { IMarkStyle, IRippleMark } from './interface';
import { MarkTypeEnum } from './interface/type';
import type { IGroupMark } from '@visactor/vgrammar-core';
export declare class RippleMark extends BaseMark<IRippleMarkSpec> implements IRippleMark {
    static readonly type = MarkTypeEnum.ripple;
    readonly type = MarkTypeEnum.ripple;
    protected _getDefaultStyle(): IMarkStyle<IRippleMarkSpec>;
    protected _initProduct(group?: string | IGroupMark): void;
}
export declare const registerRippleMark: () => void;
