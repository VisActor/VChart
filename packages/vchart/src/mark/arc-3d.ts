import type { IArc3dMarkSpec } from '../typings';
import { BaseArcMark } from './arc';
import type { IMarkRaw } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';

export type IArc3dMark = IMarkRaw<IArc3dMarkSpec>;

export class Arc3dMark extends BaseArcMark<IArc3dMarkSpec> implements IArc3dMark {
  static readonly type = MarkTypeEnum.arc3d;
  readonly type: MarkTypeEnum = Arc3dMark.type;
}
