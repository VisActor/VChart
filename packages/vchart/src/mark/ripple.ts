import { Factory } from './../core/factory';
import { BaseMark } from './base/base-mark';
import type { IRippleMarkSpec } from '../typings/visual';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerRippleGlyph } from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import type { IGroupMark } from '@visactor/vgrammar-core';

export type IRippleMark = IMarkRaw<IRippleMarkSpec>;

export class RippleMark extends BaseMark<IRippleMarkSpec> implements IRippleMark {
  static readonly type = MarkTypeEnum.ripple;
  readonly type = RippleMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IRippleMarkSpec> = {
      ...super._getDefaultStyle(),
      x: 0,
      y: 0,
      ripple: 0
    };
    return defaultStyle;
  }

  protected _initProduct(group?: string | IGroupMark) {
    const view = this.getVGrammarView();

    // 声明语法元素
    const id = this.getProductId();
    const glyphType = 'ripplePoint';
    this._product = view.glyph(glyphType, group ?? view.rootMark).id(id);
    this._compiledProductId = id;
  }
}

export const registerRippleMark = () => {
  Factory.registerMark(RippleMark.type, RippleMark);
  registerRippleGlyph();
};
