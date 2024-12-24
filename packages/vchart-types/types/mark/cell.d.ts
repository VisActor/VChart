import type { ICellMarkSpec } from '../typings';
import type { ICellMark, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
import { BaseSymbolMark } from './symbol';
export declare class CellMark extends BaseSymbolMark<ICellMarkSpec> implements ICellMark {
    static readonly type = MarkTypeEnum.cell;
    readonly type = MarkTypeEnum.cell;
    protected _getDefaultStyle(): IMarkStyle<ICellMarkSpec>;
}
export declare const registerCellMark: () => void;
