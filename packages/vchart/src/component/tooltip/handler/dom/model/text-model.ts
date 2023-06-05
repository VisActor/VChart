import { BaseTooltipModel } from './base-tooltip-model';

export class TextModel extends BaseTooltipModel {
  init(classList?: string[], id?: string, tag?: keyof HTMLElementTagNameMap): void {
    if (!this.product) {
      this.product = this.createElement(tag ?? 'span', classList, undefined, id);
    }
  }

  setContent(content?: any): void {
    const html = this._option.valueToHtml(content);
    if (html !== this.product.innerHTML) {
      this.product.innerHTML = this._option.valueToHtml(content);
    }
  }
}
