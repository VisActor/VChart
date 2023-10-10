import type { IRectMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
export type IRectMark = IMarkRaw<IRectMarkSpec>;
export declare class RectMark extends BaseMark<IRectMarkSpec> implements IRectMark {
  static readonly type = MarkTypeEnum.rect;
  readonly type = MarkTypeEnum.rect;
  protected _getDefaultStyle(): IMarkStyle<IRectMarkSpec>;
}
