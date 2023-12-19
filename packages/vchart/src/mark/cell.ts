import { Factory } from './../core/factory';
import type { ICellMarkSpec } from '../typings';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { BaseSymbolMark } from './symbol';
import { registerCellGraphic, registerCellMark as registerVgrammarCellMark } from '@visactor/vgrammar-core';

export type ICellMark = IMarkRaw<ICellMarkSpec>;

export class CellMark extends BaseSymbolMark<ICellMarkSpec> implements ICellMark {
  static readonly type = MarkTypeEnum.cell;
  readonly type = CellMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ICellMarkSpec> = {
      ...super._getDefaultStyle(),
      padding: 0
    };
    return defaultStyle;
  }
}

export const registerCellMark = () => {
  Factory.registerMark(CellMark.type, CellMark);
  registerCellGraphic();
  registerVgrammarCellMark();
};
