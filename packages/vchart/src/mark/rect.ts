import type { IRect3dMarkSpec, IRectMarkSpec } from '../typings/visual';
import { BaseMark } from './base';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type IRectMark = IMarkRaw<IRectMarkSpec>;
export type IRect3dMark = IMarkRaw<IRect3dMarkSpec>;

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
