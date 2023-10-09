import type { IToolTipActual } from '../../../../typings/tooltip';
import type { ITooltipSpec, TooltipHandlerParams } from '../../interface';
import { BaseTooltipHandler } from '../base';
import { getDomStyles } from './util';
import type { IDomTooltipStyle } from './interface';
import { TooltipModel } from './model/tooltip-model';
import { TOOLTIP_CONTAINER_EL_CLASS_NAME, TooltipHandlerType } from '../constants';
import type { Tooltip } from '../../tooltip';
import type { Maybe } from '@visactor/vutils';
import { domDocument } from '../../../../util/env';

/**
 * The tooltip handler class.
 */
export class DomTooltipHandler extends BaseTooltipHandler {
  type = TooltipHandlerType.dom;

  protected _tooltipContainer = domDocument?.body;
  protected _domStyle: IDomTooltipStyle;
  protected _tooltipActual?: IToolTipActual;
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
    const parentElement = tooltipSpec.parentElement as HTMLElement | HTMLCanvasElement;
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
          getTooltipAttributes: () => this._attributes
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
        this._tooltipActual = actualTooltip;
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
    this._domStyle = getDomStyles(this._style, this._attributes);
  }

  protected _getParentElement(spec: ITooltipSpec): HTMLElement {
    return this._container ?? super._getParentElement(spec);
  }

  isTooltipShown() {
    return this.getVisibility();
  }

  reInit() {
    super.reInit();
    this._initStyle();
  }
}
