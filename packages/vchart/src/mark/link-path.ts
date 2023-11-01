import { BaseMark } from './base/base-mark';
import type { ILinkPathMarkSpec } from '../typings/visual';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerLinkPathGlyph } from '@visactor/vgrammar-core';
// eslint-disable-next-line no-duplicate-imports
import type { IGroupMark } from '@visactor/vgrammar-core';

export type ILinkPathMark = IMarkRaw<ILinkPathMarkSpec>;

export class LinkPathMark extends BaseMark<ILinkPathMarkSpec> implements ILinkPathMark {
  static readonly type = MarkTypeEnum.linkPath;
  readonly type = LinkPathMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ILinkPathMarkSpec> = {
      ...super._getDefaultStyle(),
      x: 0,
      y: 0,
      x0: 0,
      y0: 0,
      x1: 100,
      y1: 100,
      thickness: 1,
      round: true
    };
    return defaultStyle;
  }

  protected _initProduct(group?: string | IGroupMark) {
    registerLinkPathGlyph();

    const view = this.getVGrammarView();

    // 声明语法元素
    const id = this.getProductId();
    const glyphType = 'linkPath';
    const direction = this.getStyle('direction');
    this._product = view
      .glyph(glyphType, group ?? view.rootMark)
      .id(id)
      .configureGlyph({ direction: direction });
    this._compiledProductId = id;
  }
}
