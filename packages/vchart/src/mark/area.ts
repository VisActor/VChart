import type { IAreaMarkSpec } from '../typings/visual';
import { BaseLineMark } from './base';
import type { IMarkRaw } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type IAreaMark = IMarkRaw<IAreaMarkSpec>;

export class AreaMark extends BaseLineMark<IAreaMarkSpec> implements IAreaMark {
  static readonly type = MarkTypeEnum.area;
  readonly type = AreaMark.type;

  protected _getIgnoreAttributes(): string[] {
    return [];
  }
}
