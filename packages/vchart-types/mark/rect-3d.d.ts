import type { IRect3dMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
export type IRect3dMark = IMarkRaw<IRect3dMarkSpec>;
export declare class Rect3dMark extends BaseMark<IRect3dMarkSpec> implements IRect3dMark {
  static readonly type = MarkTypeEnum.rect3d;
  readonly type = MarkTypeEnum.rect3d;
  protected _getDefaultStyle(): IMarkStyle<IRect3dMarkSpec>;
}
