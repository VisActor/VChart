import type { IPathMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
export type IPathMark = IMarkRaw<IPathMarkSpec>;
export declare class PathMark extends BaseMark<IPathMarkSpec> implements IPathMark {
  static readonly type = MarkTypeEnum.path;
  readonly type = MarkTypeEnum.path;
  protected _getDefaultStyle(): IMarkStyle<IPathMarkSpec>;
}
