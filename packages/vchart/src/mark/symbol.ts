import { Factory } from './../core/factory';
import type { ISymbolMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkStyle, ISymbolMark } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { createSymbol } from '@visactor/vrender-core';
import { registerShadowRoot, registerSymbol } from '@visactor/vrender-kits';
import { registerSymbolDataLabel } from '@visactor/vrender-components';

export class SymbolMark extends BaseMark<ISymbolMarkSpec> implements ISymbolMark {
  static readonly type = MarkTypeEnum.symbol;
  readonly type = SymbolMark.type;
  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ISymbolMarkSpec> = {
      ...super._getDefaultStyle(),
      size: 1,
      symbolType: 'circle',
      fill: undefined,
      lineWidth: 0
    };
    return defaultStyle as IMarkStyle<ISymbolMarkSpec>;
  }
}

export const registerSymbolMark = () => {
  Factory.registerMark(SymbolMark.type, SymbolMark);
  registerShadowRoot();
  registerSymbol();
  registerSymbolDataLabel();

  Factory.registerGraphicComponent(MarkTypeEnum.symbol, createSymbol);
};
