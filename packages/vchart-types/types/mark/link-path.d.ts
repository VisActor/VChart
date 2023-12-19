import { BaseMark } from './base/base-mark';
import type { ILinkPathMarkSpec } from '../typings/visual';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
import type { IGroupMark } from '@visactor/vgrammar-core';
export type ILinkPathMark = IMarkRaw<ILinkPathMarkSpec>;
export declare class LinkPathMark extends BaseMark<ILinkPathMarkSpec> implements ILinkPathMark {
    static readonly type = MarkTypeEnum.linkPath;
    readonly type = MarkTypeEnum.linkPath;
    protected _getDefaultStyle(): IMarkStyle<ILinkPathMarkSpec>;
    protected _initProduct(group?: string | IGroupMark): void;
}
export declare const registerLinkPathMark: () => void;
