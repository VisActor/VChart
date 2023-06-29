/* eslint-disable no-duplicate-imports */
import type { IPolygonMarkSpec } from '../../typings/visual';
import { BasePolygonMark } from './base-polygon';
import type { IMarkRaw } from '../interface';
import { MarkTypeEnum } from '../interface';

export type IPolygonMark = IMarkRaw<IPolygonMarkSpec>;

export class PolygonMark extends BasePolygonMark<IPolygonMarkSpec> implements IPolygonMark {
  static readonly type = MarkTypeEnum.polygon;
  readonly type = PolygonMark.type;
}
