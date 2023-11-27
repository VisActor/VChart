import type { ITextMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle, IMarkOption } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';
import { GrammarMarkType } from '@visactor/vgrammar-core';
import type { IGroupMark } from '@visactor/vgrammar-core';

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
      lineWidth: 0,
      textConfig: []
    };
    return defaultStyle;
  }

  protected _initProduct(group?: string | IGroupMark) {
    const view = this.getVGrammarView();

    // 声明语法元素
    const id = this.getProductId();

    if (this.getStyle('textType') === 'rich') {
      this._product = view.mark(GrammarMarkType.richtext as GrammarMarkType, group ?? view.rootMark).id(id);
    } else {
      this._product = view.mark(GrammarMarkType.text as GrammarMarkType, group ?? view.rootMark).id(id);
    }

    this._compiledProductId = id;
  }
}
