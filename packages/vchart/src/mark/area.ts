import type { IAreaMarkSpec } from '../typings/visual';
import { BaseLineMark } from './base/base-line';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';

export type IAreaMark = IMarkRaw<IAreaMarkSpec>;

export class AreaMark extends BaseLineMark<IAreaMarkSpec> implements IAreaMark {
  static readonly type = MarkTypeEnum.area;
  readonly type = AreaMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IAreaMarkSpec> = {
      ...super._getDefaultStyle(),
      lineWidth: 0
    };
    return defaultStyle;
  }

  protected _getIgnoreAttributes(): string[] {
    return [];
  }
}
