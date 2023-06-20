import type { IToolTipActual, IToolTipLineActual } from '../../../../typings/tooltip';
import type { ITooltipSpec, TooltipHandlerParams } from '../../interface';
import { BaseTooltipHandler } from '../base';
import { getDomStyles } from './util';
import type { IDomTooltipStyle } from './interface';
import { TooltipModel } from './model/tooltip-model';
import { domDocument } from './model/base-tooltip-model';
import { TOOLTIP_CONTAINER_EL_CLASS_NAME, TooltipHandlerType } from '../constants';
import type { Tooltip } from '../../tooltip';
import type { Maybe } from '@visactor/vutils';
import { TOOLTIP_MAX_COUNT } from './constants';

/**
 * The tooltip handler class.
 */
export class DomTooltipHandler extends BaseTooltipHandler {
  type = TooltipHandlerType.dom;

  protected _tooltipContainer: HTMLElement = globalThis.document?.body;
  protected _domStyle: IDomTooltipStyle;
  protected _tooltipActual: IToolTipActual;
  protected _renderContent: IToolTipLineActual[];
  protected declare _container: Maybe<HTMLDivElement>;

  protected model: TooltipModel;

  getVisibility() {
    return !!this.model?.getVisibility();
  }

  setVisibility(_value: boolean) {
    // 这里做个节流
    if (_value !== this.getVisibility()) {
      this.model?.setVisibility(_value);
    }
  }

  constructor(tooltipId: string, component: Tooltip) {
    super(tooltipId, component);
    this._initStyle();
    this.initEl();
  }

  initEl() {
    const tooltipSpec = this._component.getSpec();
    const { parentElement } = tooltipSpec;
    if (domDocument && parentElement) {
      for (let i = 0; i < parentElement.children.length; i++) {
        if (parentElement.children[i].classList.contains(TOOLTIP_CONTAINER_EL_CLASS_NAME)) {
          this._container = parentElement.children[i] as HTMLDivElement;
          break;
        }
      }
      if (!this._container) {
        this._container = domDocument.createElement('div');
        this._container.style.position = 'relative';
        this._container.classList.add(TOOLTIP_CONTAINER_EL_CLASS_NAME);
        parentElement.appendChild(this._container);
      }
      this.model = new TooltipModel(
        this._container,
        {
          valueToHtml: this._option.sanitize,
          getTooltipStyle: () => this._domStyle,
          getTooltipActual: () => this._tooltipActual,
          getRenderContent: () => this._renderContent
        },
        [tooltipSpec.className],
        this.id
      );
    }
  }

  protected _removeTooltip() {
    this.model?.release();
    this._container = null;
  }

  protected _updateTooltip(visible: boolean, params: TooltipHandlerParams, actualTooltip: IToolTipActual) {
    if (!visible || !this.model) {
      this.setVisibility(visible);
    } else {
      if (!params.changePositionOnly) {
        this._updateTooltipActual(actualTooltip);
        this._initStyle();

        this.model.initAll();
        this.model.setStyle();
        this.model.setContent();
      }
      this.setVisibility(visible);

      // 位置
      const { x = 0, y = 0 } = actualTooltip.position ?? {};
      const el = this.model.product;
      if (el) {
        // https://stackoverflow.com/questions/22111256/translate3d-vs-translate-performance
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }
  }

  protected _initStyle() {
    this._domStyle = getDomStyles(this._style, this._attributeCache);
  }

  protected _getParentElement(spec: ITooltipSpec): HTMLElement {
    return this._container ?? super._getParentElement(spec);
  }

  protected _updateTooltipActual(actualTooltip: IToolTipActual) {
    this._tooltipActual = actualTooltip;

    // 计算 renderContent
    if (!this._tooltipActual) {
      this._renderContent = [];
    } else {
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
      this._renderContent = renderContent;
    }
  }

  reInit() {
    super.reInit();
    this._initStyle();
  }
}
