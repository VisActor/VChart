import { defaultContainerBoxStyle } from './style-constants';
import { BaseTooltipModel } from './base-tooltip-model';
import { ContentColumnModel } from './content-column-model';
import { merge } from '@visactor/vutils';

export class ContentModel extends BaseTooltipModel {
  shapeBox: ContentColumnModel;
  keyBox: ContentColumnModel;
  valueBox: ContentColumnModel;

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
    const shapeBox = new ContentColumnModel(
      this.product,
      this._option,
      'shape-box',
      0,
      this._tooltipStyle,
      this._tooltipActual
    );
    shapeBox.init();
    this.shapeBox = shapeBox;
    this.children[shapeBox.childIndex] = shapeBox;
  }

  private _initKeyBox() {
    const keyBox = new ContentColumnModel(
      this.product,
      this._option,
      'key-box',
      1,
      this._tooltipStyle,
      this._tooltipActual
    );
    keyBox.init();
    this.keyBox = keyBox;
    this.children[keyBox.childIndex] = keyBox;
  }

  private _initValueBox() {
    const valueBox = new ContentColumnModel(
      this.product,
      this._option,
      'value-box',
      2,
      this._tooltipStyle,
      this._tooltipActual
    );
    valueBox.init();
    this.valueBox = valueBox;
    this.children[valueBox.childIndex] = valueBox;
  }

  setStyle(style?: Partial<CSSStyleDeclaration>): void {
    super.setStyle(merge({}, defaultContainerBoxStyle, style));
    Object.values(this.children).forEach(c => {
      c.setStyle();
    });
  }

  setContent(): void {
    Object.values(this.children).forEach(c => {
      c.setContent();
    });
  }

  release(): void {
    super.release();
    this.shapeBox = null;
    this.keyBox = null;
    this.valueBox = null;
  }
}
