import { BaseTooltipModel } from './base-tooltip-model';
import { ContentColumnModel } from './content-column-model';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValid } from '@visactor/vutils';
import { mergeSpec } from '../../../../../util/spec/merge-spec';
import { getPixelPropertyStr, getScrollbarWidth, pixelPropertyStrToNumber } from '../utils';

export class ContentModel extends BaseTooltipModel {
  shapeBox: Maybe<ContentColumnModel>;
  keyBox: Maybe<ContentColumnModel>;
  valueBox: Maybe<ContentColumnModel>;

  init(): void {
    if (!this.product) {
      this.product = this.createElement('div', ['container-box']);
    }
    if (!this.shapeBox) {
      this._initShapeBox();
    }
    if (!this.keyBox) {
      this._initKeyBox();
    }
    if (!this.valueBox) {
      this._initValueBox();
    }
  }

  private _initShapeBox() {
    const shapeBox = new ContentColumnModel(this.product!, this._option, 'shape-box', 0);
    shapeBox.init();
    this.shapeBox = shapeBox;
    this.children[shapeBox.childIndex] = shapeBox;
  }

  private _initKeyBox() {
    const keyBox = new ContentColumnModel(this.product!, this._option, 'key-box', 1);
    keyBox.init();
    this.keyBox = keyBox;
    this.children[keyBox.childIndex] = keyBox;
  }

  private _initValueBox() {
    const valueBox = new ContentColumnModel(this.product!, this._option, 'value-box', 2);
    valueBox.init();
    this.valueBox = valueBox;
    this.children[valueBox.childIndex] = valueBox;
  }

  setStyle(style?: Partial<CSSStyleDeclaration>): void {
    super.setStyle(mergeSpec(this._getContentContainerStyle(), style));
    Object.values(this.children).forEach(c => {
      c.setStyle();
    });
  }

  setContent(): void {
    Object.values(this.children).forEach(c => {
      c.setContent();
    });
  }

  protected _getContentContainerStyle(): Partial<CSSStyleDeclaration> {
    const defaultStyle = {
      whiteSpace: 'nowrap',
      lineHeight: '0px'
    };

    const { panelDomHeight, panel: panelAttribute, maxContentHeight } = this._option.getTooltipAttributes();
    if (isValid(maxContentHeight) && panelDomHeight < panelAttribute.height) {
      const { shapeColumn = {}, keyColumn = {}, valueColumn = {}, panel = {} } = this._option.getTooltipStyle();
      const width = [
        shapeColumn.width,
        shapeColumn.marginRight,
        keyColumn.width,
        keyColumn.marginRight,
        valueColumn.width,
        valueColumn.marginRight,
        panel.paddingRight
      ].reduce((sum, cur) => sum + <number>pixelPropertyStrToNumber(cur), 0);
      return {
        ...defaultStyle,
        width: `${width + getScrollbarWidth(this._option.getContainer())}px`,
        maxHeight: getPixelPropertyStr(maxContentHeight),
        overflow: 'auto'
      };
    }
    return defaultStyle;
  }

  release(): void {
    super.release();
    this.shapeBox = null;
    this.keyBox = null;
    this.valueBox = null;
  }
}
