import type { IPathMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';

export type IPathMark = IMarkRaw<IPathMarkSpec>;

export class PathMark extends BaseMark<IPathMarkSpec> implements IPathMark {
  static readonly type = MarkTypeEnum.path;
  readonly type = PathMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IPathMarkSpec> = {
      ...super._getDefaultStyle(),
      lineWidth: 0,
      path: ''
    };
    return defaultStyle;
  }
}
