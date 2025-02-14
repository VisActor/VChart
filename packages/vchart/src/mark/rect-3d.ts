import { Factory } from './../core/factory';
import type { IRect3dMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkStyle, IRect3dMark } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerVGrammarRectAnimation } from '../animation/config';
import { registerRect3d, registerShadowRoot } from '@visactor/vrender-kits';
import type { IGraphic, IRect3dGraphicAttribute } from '@visactor/vrender-core';
import { createRect3d } from '@visactor/vrender-core';

export class Rect3dMark extends BaseMark<IRect3dMarkSpec> implements IRect3dMark {
  static readonly type = MarkTypeEnum.rect3d;
  readonly type = Rect3dMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IRect3dMarkSpec> = {
      ...super._getDefaultStyle(),
      width: undefined,
      height: undefined,
      length: 3
    };
    return defaultStyle;
  }
}

export const registerRect3dMark = () => {
  Factory.registerMark(Rect3dMark.type, Rect3dMark);
  registerShadowRoot();
  registerRect3d();
  registerVGrammarRectAnimation();

  Factory.registerGraphicComponent(MarkTypeEnum.rect3d, createRect3d);
};
