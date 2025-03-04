import type { ICellMarkSpec } from '../typings';
import type { ICellMark, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
import type { IGraphic } from '@visactor/vrender-core';
import { BaseMark } from './base';
export declare class CellMark extends BaseMark<ICellMarkSpec> implements ICellMark {
    static readonly type = MarkTypeEnum.cell;
    readonly type = MarkTypeEnum.cell;
    protected _getDefaultStyle(): IMarkStyle<ICellMarkSpec>;
    protected _createGraphic(attrs?: any): IGraphic;
    protected _transformGraphicAttributes(g: IGraphic, attrs: any, groupAttrs?: any): any;
}
export declare const registerCellMark: () => void;
