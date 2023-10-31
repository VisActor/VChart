import type { IRectMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';

export type IRectMark = IMarkRaw<IRectMarkSpec>;

export class RectMark extends BaseMark<IRectMarkSpec> implements IRectMark {
  static readonly type = MarkTypeEnum.rect;
  readonly type = RectMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IRectMarkSpec> = {
      ...super._getDefaultStyle(),
      width: undefined,
      height: undefined,
      lineWidth: 0
    };
    return defaultStyle;
  }
}
