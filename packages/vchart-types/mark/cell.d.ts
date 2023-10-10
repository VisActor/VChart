import type { ICellMarkSpec } from '../typings';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
import { BaseSymbolMark } from './symbol';
export type ICellMark = IMarkRaw<ICellMarkSpec>;
export declare class CellMark extends BaseSymbolMark<ICellMarkSpec> implements ICellMark {
  static readonly type = MarkTypeEnum.cell;
  readonly type = MarkTypeEnum.cell;
  protected _getDefaultStyle(): IMarkStyle<ICellMarkSpec>;
}
