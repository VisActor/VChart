import { ShapeTypeEnum } from '../typings';
import type { ISymbolMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type ISymbolMark = IMarkRaw<ISymbolMarkSpec>;

export class BaseSymbolMark<T extends ISymbolMarkSpec> extends BaseMark<T> {
  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ISymbolMarkSpec> = {
      ...super._getDefaultStyle(),
      size: 1,
      shape: ShapeTypeEnum.circle,
      fill: undefined,
      lineWidth: 0
    };
    return defaultStyle as IMarkStyle<T>;
  }
}

export class SymbolMark extends BaseSymbolMark<ISymbolMarkSpec> implements ISymbolMark {
  static readonly type = MarkTypeEnum.symbol;
  readonly type = SymbolMark.type;
}
