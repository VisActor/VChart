import type { Include } from './../typings/commnt';
import { ElementsMap } from './../elements/index';
import type { BaseElement } from '../elements/base-element';
import type { IElementOption } from './../elements/interface';
import type { ILayout } from './../layout/interface';
import { isString } from '@visactor/vutils';

export class VChartEditor {
  protected _layout: ILayout;

  protected _option: { dom: string | HTMLElement };
  protected _container: HTMLElement;

  protected _elements: BaseElement[] = [];

  constructor(option: { dom: string | HTMLElement }) {
    this._option = option;
    const { dom } = this._option;

    if (dom) {
      this._container = isString(dom) ? document?.getElementById(dom) : dom;
    }
    if (!this._container) {
      this._container.style.position = 'relative';
    }
  }

  addElements(type: string, option: Include<IElementOption>) {
    if (!ElementsMap[type]) {
      return;
    }
    if (type === 'chart') {
      const canvas = document.createElement('canvas');
      canvas.width = this._container.clientWidth;
      canvas.height = this._container.clientHeight;
      canvas.style.position = 'absolute';
      this._container.appendChild(canvas);
      // @ts-ignore
      option.renderCanvas = canvas;
    }
    const el = new ElementsMap[type](option);
    if (!el) {
      return;
    }
    el.initWithOption();
    this._elements.push(el);
  }
}
