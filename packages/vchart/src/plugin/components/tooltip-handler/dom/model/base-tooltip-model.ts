import type { Maybe } from '@visactor/vutils';
import type { IToolTipLineActual } from '../../../../../typings';
import type { ITooltipModelOption } from './interface';
import { domDocument } from '../../../../../util/env';

export class BaseTooltipModel {
  static type = 'tooltipModel';
  static isInstance(obj: any): obj is BaseTooltipModel {
    if (!obj) {
      return false;
    }
    return obj.type === BaseTooltipModel.type;
  }
  readonly type = BaseTooltipModel.type;

  readonly parent: BaseTooltipModel | HTMLElement;
  readonly childIndex: number;

  protected _option: ITooltipModelOption;
  setOption(option: ITooltipModelOption) {
    this._option = option;
    Object.values(this.children).forEach(c => c.setOption(option));
  }

  protected _renderContentCache: IToolTipLineActual[] | null = null;

  children: Record<number, BaseTooltipModel> = {};

  product: Maybe<HTMLElement>;

  getParentEl() {
    if (BaseTooltipModel.isInstance(this.parent)) {
      return this.parent.product;
    }
    return this.parent;
  }

  constructor(parent: BaseTooltipModel | HTMLElement, option: ITooltipModelOption, childIndex?: number) {
    this.parent = parent;
    this._option = option;
    this.childIndex = childIndex ?? 0;
  }

  init(classList?: string[], id?: string) {
    // do nothing
  }

  initAll() {
    this.init();
    Object.values(this.children).forEach(c => c.initAll());
  }

  setStyle(style?: Partial<CSSStyleDeclaration>) {
    if (!this.product || !style) {
      return;
    }
    Object.keys(style).forEach(key => {
      if (this.product!.style[key] !== style[key]) {
        this.product!.style[key] = style[key];
      }
    });
  }

  setContent(content?: any) {
    // do nothing
  }

  setVisibility(visibility: boolean) {
    if (!this.product) {
      return;
    }
    const { style } = this.product;
    if (visibility) {
      style.visibility = 'visible';
    } else {
      style.visibility = 'hidden';
    }
    Object.values(this.children).forEach(c => c.setVisibility(visibility));
  }

  getVisibility() {
    if (!this.product?.style?.visibility) {
      return false;
    }
    return this.product.style.visibility !== 'hidden';
  }

  release() {
    Object.values(this.children).forEach(c => c.release());
    this.children = {};
    if (this.product) {
      try {
        this.getParentEl()?.removeChild(this.product);
      } catch {}
      this.product = null;
    }
  }

  protected createElement(
    tag: keyof HTMLElementTagNameMap,
    classList?: string[],
    style?: Partial<CSSStyleDeclaration>,
    id?: string
  ) {
    const element = domDocument?.createElement(tag);
    const parentEl = this.getParentEl();
    if (!element || !parentEl) {
      return undefined;
    }

    if (classList) {
      element.classList.add(...classList);
    }
    if (style) {
      Object.keys(style).forEach(key => {
        element.style[key] = style[key];
      });
    }
    if (id) {
      element.id = id;
    }

    let ptr = this.childIndex;
    if (BaseTooltipModel.isInstance(this.parent)) {
      // 按照自身 childIndex 插入对应位置
      let nextChildIndex = Number.MAX_VALUE;
      for (let i = 0; i < parentEl.children.length; i++) {
        const childModel = Object.values(this.parent.children).find(c => c.product === parentEl.children[i]);
        if (childModel.childIndex > this.childIndex && childModel.childIndex < nextChildIndex) {
          nextChildIndex = childModel.childIndex;
          ptr = i;
        }
      }
    }
    if (ptr >= parentEl.children.length) {
      parentEl.appendChild(element);
    } else {
      parentEl.insertBefore(element, parentEl.children[ptr]);
    }
    return element;
  }
}
