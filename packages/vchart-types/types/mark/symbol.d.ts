import type { ISymbolMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkStyle, ISymbolMark } from './interface';
import { MarkTypeEnum } from './interface/type';
import type { IGraphic } from '@visactor/vrender-core';
export declare class SymbolMark extends BaseMark<ISymbolMarkSpec> implements ISymbolMark {
    static readonly type = MarkTypeEnum.symbol;
    readonly type = MarkTypeEnum.symbol;
    protected _getDefaultStyle(): IMarkStyle<ISymbolMarkSpec>;
    protected _transformGraphicAttributes(g: IGraphic, attrs: any, groupAttrs?: any): any;
}
export declare const registerSymbolMark: () => void;
