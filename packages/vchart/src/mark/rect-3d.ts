import { Factory } from './../core/factory';
import type { IRect3dMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerRect3dGraphic } from '@visactor/vgrammar-core';
import { registerVGrammarRectAnimation } from '../animation/config';

export type IRect3dMark = IMarkRaw<IRect3dMarkSpec>;

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
  registerRect3dGraphic();
  registerVGrammarRectAnimation();
};
