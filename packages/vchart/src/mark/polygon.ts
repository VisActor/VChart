import type { ICommonSpec, IPolygonMarkSpec, IPyramid3dMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type IPolygonMark = IMarkRaw<IPolygonMarkSpec>;
export type IPyramid3dMark = IMarkRaw<IPyramid3dMarkSpec>;

class BasePolygonMark<T extends ICommonSpec> extends BaseMark<T> {
  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<T> = {
      ...super._getDefaultStyle(),
      points: []
    };
    return defaultStyle;
  }
}

export class PolygonMark extends BasePolygonMark<IPolygonMarkSpec> implements IPolygonMark {
  static readonly type = MarkTypeEnum.polygon;
  readonly type = PolygonMark.type;
}

export class Pyramid3dMark extends BasePolygonMark<IPyramid3dMarkSpec> implements IPyramid3dMark {
  static readonly type = MarkTypeEnum.pyramid3d;
  readonly type = Pyramid3dMark.type;
}
