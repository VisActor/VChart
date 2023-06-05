import { SeriesTypeEnum } from '../series/interface';
import type { ILineMarkSpec } from '../typings/visual';
import { BaseLineMark } from './base';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type ILineMark = IMarkRaw<ILineMarkSpec>;

export class LineMark extends BaseLineMark<ILineMarkSpec> implements ILineMark {
  static readonly type = MarkTypeEnum.line;
  readonly type = LineMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ILineMarkSpec> = {
      ...super._getDefaultStyle(),
      lineWidth: 1
    };
    return defaultStyle;
  }

  /**
   * TODO: SeriesTypeEnum 移到最外层
   * @override 线不支持填充
   * @returns
   */
  protected _getIgnoreAttributes(): string[] {
    if (this.model?.type === SeriesTypeEnum.radar && this.model?.coordinate === 'polar') {
      return [];
    }
    return ['fill', 'fillOpacity'];
  }
}
