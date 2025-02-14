import { Factory } from './../core/factory';
import type { IComposedTextMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkOption, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';
import type { ITextMark, ITextSpec } from './interface/mark';
import { registerRichtext, registerShadowRoot, registerText } from '@visactor/vrender-kits';
import type { IGraphic, IRichTextGraphicAttribute, ITextGraphicAttribute } from '@visactor/vrender-core';
import { createRichText, createText } from '@visactor/vrender-core';
import { isObject, isValid } from '@visactor/vutils';

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

  protected _transformGraphicAttributes(g: IGraphic, attrs: any, groupAttrs?: any) {
    const textAttrs = super._transformGraphicAttributes(g, attrs, groupAttrs);

    const { text } = textAttrs;

    if ((isObject(text) && this._textType === 'rich', isValid((text as any).text))) {
      textAttrs.textConfig = (text as any).text;
    }

    return textAttrs;
  }

  createGraphic(attrs: ITextGraphicAttribute | IRichTextGraphicAttribute = {}): IGraphic {
    return this._textType === 'rich'
      ? createRichText(attrs as IRichTextGraphicAttribute)
      : createText(attrs as ITextGraphicAttribute);
  }
}

export const registerTextMark = () => {
  Factory.registerMark(TextMark.type, TextMark);
  registerShadowRoot();
  registerText();
  registerRichtext();

  Factory.registerGraphicComponent(MarkTypeEnum.text, createText);
  Factory.registerGraphicComponent('richtext', createRichText);
};
