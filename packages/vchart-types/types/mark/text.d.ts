import type { ITextMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
export type ITextMark = IMarkRaw<ITextMarkSpec>;
export declare class TextMark extends BaseMark<ITextMarkSpec> implements ITextMark {
    static readonly type = MarkTypeEnum.text;
    readonly type = MarkTypeEnum.text;
    protected _getDefaultStyle(): IMarkStyle<ITextMarkSpec>;
}
