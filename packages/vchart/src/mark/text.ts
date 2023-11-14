import type { ITextMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';

export type ITextMark = IMarkRaw<ITextMarkSpec>;

export class TextMark extends BaseMark<ITextMarkSpec> implements ITextMark {
  static readonly type = MarkTypeEnum.text;
  readonly type = TextMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ITextMarkSpec> = {
      ...super._getDefaultStyle(),
      // TODO: 删除后会有显示问题，待排查
      angle: 0,
      textAlign: 'center',
      lineWidth: 0
    };
    return defaultStyle;
  }
}
