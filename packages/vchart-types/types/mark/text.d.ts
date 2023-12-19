import type { ITextMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
import type { IGroupMark } from '@visactor/vgrammar-core';
export type ITextMark = IMarkRaw<ITextMarkSpec>;
export declare class TextMark extends BaseMark<ITextMarkSpec> implements ITextMark {
    static readonly type = MarkTypeEnum.text;
    readonly type = MarkTypeEnum.text;
    protected _getDefaultStyle(): IMarkStyle<ITextMarkSpec>;
    protected _initProduct(group?: string | IGroupMark): void;
}
export declare const registerTextMark: () => void;
