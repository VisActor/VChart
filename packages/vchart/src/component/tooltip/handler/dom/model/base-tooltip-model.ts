import type { Maybe } from '@visactor/vutils';
import type { IToolTipActual, IToolTipLineActual } from '../../../../../typings';
import type { IDomTooltipStyle } from '../interface';
import type { ITooltipModelOption } from './interface';

export const TOOLTIP_MAX_COUNT = 20;
export const TOOLTIP_EMPTY_STRING = '';

export const domDocument: Document | undefined = globalThis.document;

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

  protected _tooltipActual: Maybe<IToolTipActual> = null;
  setTooltipActual(tooltipActual: IToolTipActual) {
    this._tooltipActual = tooltipActual;
    this._renderContentCache = null; // 清除缓存
    this.init();
    Object.values(this.children).forEach(c => c.setTooltipActual(tooltipActual));
  }

  protected _tooltipStyle: Maybe<IDomTooltipStyle> = null;
  setTooltipStyle(tooltipStyle: IDomTooltipStyle) {
    this._tooltipStyle = tooltipStyle;
    this.init();
    Object.values(this.children).forEach(c => c.setTooltipStyle(tooltipStyle));
  }

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

  constructor(
    parent: BaseTooltipModel | HTMLElement,
    option: ITooltipModelOption,
    childIndex?: number,
    tooltipStyle?: Maybe<IDomTooltipStyle>,
    tooltipActual?: Maybe<IToolTipActual>
  ) {
    this.parent = parent;
    this._option = option;
    this.childIndex = childIndex ?? 0;
    this._tooltipStyle = tooltipStyle;
    this._tooltipActual = tooltipActual;
  }

  init(classList?: string[], id?: string) {
    // do nothing
  }

  updateTooltipStyle(style?: Maybe<IDomTooltipStyle>) {
    if (style) {
      this._tooltipStyle = style;
      Object.values(this.children).forEach(c => c.updateTooltipStyle(style));
    }
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
      this.getParentEl()?.removeChild(this.product);
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
      return;
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
        const childModel = Object.values(this.parent.children).find(c => c.product === parentEl.children[i])!;
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

  protected getRenderContent() {
    if (!this._tooltipActual) {
      return [];
    }
    if (this._renderContentCache) {
      return this._renderContentCache;
    }

    const { content: originContent = [] } = this._tooltipActual;
    const renderContent = originContent.slice(0, TOOLTIP_MAX_COUNT);

    // 最后一行被转化为省略
    if (renderContent?.[TOOLTIP_MAX_COUNT - 1]) {
      renderContent[TOOLTIP_MAX_COUNT - 1] = {
        ...renderContent[TOOLTIP_MAX_COUNT - 1],
        // TODO: i18n
        key: '其他',
        value: '...'
      };
    }

    return renderContent;
  }
}
