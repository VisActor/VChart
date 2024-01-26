import { BaseTooltipModel } from './base-tooltip-model';

export class TextModel extends BaseTooltipModel {
  init(classList?: string[], id?: string, tag?: keyof HTMLElementTagNameMap): void {
    if (!this.product) {
      this.product = this.createElement(tag ?? 'span', classList, undefined, id);
    }
  }

  setContent(content?: any, multiLine?: boolean): void {
    if (!this.product) {
      return;
    }
    let html = this._option.valueToHtml(content);
    if (multiLine) {
      html = html.replaceAll('\n', '<br>');
    }
    if (html !== this.product.innerHTML) {
      this.product.innerHTML = html;
    }
  }
}
