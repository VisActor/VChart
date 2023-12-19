import { Factory } from './../core/factory';
import type { IImageMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerImageGraphic } from '@visactor/vgrammar-core';

export type IImageMark = IMarkRaw<IImageMarkSpec>;

export class ImageMark extends BaseMark<IImageMarkSpec> implements IImageMark {
  static readonly type = MarkTypeEnum.image;
  readonly type = ImageMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IImageMarkSpec> = {
      ...super._getDefaultStyle(),
      width: undefined,
      height: undefined,
      lineWidth: 0
    };
    return defaultStyle;
  }
}

export const registerImageMark = () => {
  Factory.registerMark(ImageMark.type, ImageMark);
  registerImageGraphic();
};
