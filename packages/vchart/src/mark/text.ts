import type { ITextMarkSpec } from '../typings/visual';
import { BaseMark } from './base';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type ITextMark = IMarkRaw<ITextMarkSpec>;

/**
 * text的text属性可能比较麻烦，因为文字测量在chartspace做了
 */
export class TextMark extends BaseMark<ITextMarkSpec> implements ITextMark {
  static readonly type = MarkTypeEnum.text;
  readonly type = TextMark.type;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ITextMarkSpec> = {
      ...super._getDefaultStyle(),
      // TODO: 删除后会有显示问题，待排查
      angle: 0,
      textAlign: 'center'
    };
    return defaultStyle;
  }
}
