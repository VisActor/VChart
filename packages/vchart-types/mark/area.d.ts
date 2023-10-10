import type { IAreaMarkSpec } from '../typings/visual';
import { BaseLineMark } from './base/base-line';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
export type IAreaMark = IMarkRaw<IAreaMarkSpec>;
export declare class AreaMark extends BaseLineMark<IAreaMarkSpec> implements IAreaMark {
  static readonly type = MarkTypeEnum.area;
  readonly type = MarkTypeEnum.area;
  protected _getDefaultStyle(): IMarkStyle<IAreaMarkSpec>;
  protected _getIgnoreAttributes(): string[];
}
