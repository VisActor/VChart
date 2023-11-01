/* eslint-disable no-duplicate-imports */
import type { IPolygonMarkSpec } from '../../typings/visual';
import { BasePolygonMark } from './base-polygon';
import type { IMarkRaw, IMarkStyle } from '../interface';
import { MarkTypeEnum } from '../interface/type';

export type IPolygonMark = IMarkRaw<IPolygonMarkSpec>;

export class PolygonMark extends BasePolygonMark<IPolygonMarkSpec> implements IPolygonMark {
  static readonly type = MarkTypeEnum.polygon;
  readonly type = PolygonMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IPolygonMarkSpec> = {
      ...super._getDefaultStyle(),
      lineWidth: 0
    };
    return defaultStyle;
  }
}
