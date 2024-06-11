import { BaseTooltipModel } from './base-tooltip-model';
import type { ContentColumnType } from './content-column-model';
import { ContentColumnModel } from './content-column-model';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isValid } from '@visactor/vutils';
import { mergeSpec } from '@visactor/vutils-extension';
import { getPixelPropertyStr, getScrollbarWidth, pixelPropertyStrToNumber } from '../utils';

export class ContentModel extends BaseTooltipModel {
  shapeBox: Maybe<ContentColumnModel>;
  keyBox: Maybe<ContentColumnModel>;
  valueBox: Maybe<ContentColumnModel>;

  init(): void {
    if (!this.product) {
      this.product = this.createElement('div', ['container-box']);
    }
    const { align } = this._option.getTooltipAttributes();
    if (align === 'right') {
      if (!this.valueBox) {
        this.valueBox = this._initBox('value-box', 0);
      }
      if (!this.keyBox) {
        this.keyBox = this._initBox('key-box', 1);
      }
      if (!this.shapeBox) {
        this.shapeBox = this._initBox('shape-box', 2);
      }
    } else {
      if (!this.shapeBox) {
        this.shapeBox = this._initBox('shape-box', 0);
      }
      if (!this.keyBox) {
        this.keyBox = this._initBox('key-box', 1);
      }
      if (!this.valueBox) {
        this.valueBox = this._initBox('value-box', 2);
      }
    }
  }

  private _initBox(className: ContentColumnType, index: number) {
    const box = new ContentColumnModel(this.product!, this._option, className, index);
    box.init();
    this.children[box.childIndex] = box;
    return box;
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
