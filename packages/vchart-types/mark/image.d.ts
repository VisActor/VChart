import type { IImageMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
export type IImageMark = IMarkRaw<IImageMarkSpec>;
export declare class ImageMark extends BaseMark<IImageMarkSpec> implements IImageMark {
  static readonly type = MarkTypeEnum.image;
  readonly type = MarkTypeEnum.image;
  protected _getDefaultStyle(): IMarkStyle<IImageMarkSpec>;
}
