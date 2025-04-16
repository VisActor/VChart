import { Factory } from './../core/factory';
import type { IComposedTextMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkOption, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';
import { registerRichTextGraphic, registerTextGraphic } from '@visactor/vgrammar-core';
import type { ITextMark, ITextSpec } from './interface/mark';

export class TextMark extends BaseMark<IComposedTextMarkSpec> implements ITextMark {
  static readonly type = MarkTypeEnum.text;
  readonly type = TextMark.type;

  protected _textType: 'text' | 'rich' = 'text';
  getTextType() {
    return this._textType;
  }

  constructor(name: string, option: IMarkOption) {
    super(name, option);
  }

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IComposedTextMarkSpec> = {
      ...super._getDefaultStyle(),
      // TODO: 删除后会有显示问题，待排查
      angle: 0,
      textAlign: 'center',
      lineWidth: 0,
      textConfig: []
    };
    return defaultStyle;
  }

  initStyleWithSpec(spec: ITextSpec<IComposedTextMarkSpec>, key?: string) {
    super.initStyleWithSpec(spec, key);
    if (spec.textType) {
      this._textType = spec.textType;
    }
  }

  compileEncode() {
    super.compileEncode();
    if (this._textType === 'rich') {
      this._product.encodeState('group', { textType: this._textType });
    }
  }
}

export const registerTextMark = () => {
  Factory.registerMark(TextMark.type, TextMark);
  registerTextGraphic();
  registerRichTextGraphic();
};
