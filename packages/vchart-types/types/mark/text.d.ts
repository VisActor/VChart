import type { IComposedTextMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkOption, IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
import { IMarkSpec } from '../typings/spec/common';
export type ITextMark = IMarkRaw<IComposedTextMarkSpec> & {
    getTextType: () => 'text' | 'rich';
};
export type ITextSpec<T> = IMarkSpec<T> & {
    textType?: 'rich' | 'text';
};
export declare class TextMark extends BaseMark<IComposedTextMarkSpec> implements ITextMark {
    static readonly type = MarkTypeEnum.text;
    readonly type = MarkTypeEnum.text;
    protected _textType: 'text' | 'rich';
    getTextType(): "text" | "rich";
    constructor(name: string, option: IMarkOption);
    protected _getDefaultStyle(): IMarkStyle<IComposedTextMarkSpec>;
    initStyleWithSpec(spec: ITextSpec<IComposedTextMarkSpec>, key?: string): void;
    compileEncode(): void;
}
export declare const registerTextMark: () => void;
