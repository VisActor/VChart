import { defaultContentContainerStyle } from './style-constants';
import { BaseTooltipModel } from './base-tooltip-model';
import { ContentColumnModel } from './content-column-model';
import type { Maybe } from '@visactor/vutils';
import { mergeSpec } from '../../../../../util/spec/merge-spec';

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
    super.setStyle(mergeSpec({}, defaultContentContainerStyle, style));
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
