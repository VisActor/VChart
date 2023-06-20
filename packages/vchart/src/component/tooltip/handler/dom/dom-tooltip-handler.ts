import type { IToolTipActual } from '../../../../typings/tooltip';
import type { ITooltipSpec, TooltipHandlerParams } from '../../interface';
import { BaseTooltipHandler } from '../base';
import { getDomStyles } from './utils/style';
import type { IDomTooltipStyle } from './interface';
import { TooltipModel } from './model/tooltip-model';
import { domDocument } from './model/base-tooltip-model';
import { TOOLTIP_CONTAINER_EL_CLASS_NAME, TooltipHandlerType } from '../constants';
import type { Tooltip } from '../../tooltip';

/**
 * The tooltip handler class.
 */
export class DomTooltipHandler extends BaseTooltipHandler {
  type = TooltipHandlerType.dom;

  protected _tooltipContainer: HTMLElement = globalThis.document?.body;
  protected _domStyle: IDomTooltipStyle;
  protected declare _container: HTMLDivElement;

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

  constructor(tooltipSpec: ITooltipSpec, tooltipId: string, component: Tooltip) {
    super(tooltipSpec, tooltipId, component);
    this._initStyle();
    this.initEl();
  }

  initEl() {
    if (domDocument) {
      const { parentElement } = this._tooltipSpec;
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
        { valueToHtml: this._option.sanitize },
        [this._tooltipSpec.className],
        this.id,
        this._domStyle
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
        this.model.setTooltipActual(actualTooltip);
        this._initStyle();
        this.model.updateTooltipStyle(this._domStyle);
        this.model.setContent();
      }
      this.setVisibility(visible);

      // 位置
      const { x = 0, y = 0 } = actualTooltip.position ?? {};
      const el = this.model.product;
      // https://stackoverflow.com/questions/22111256/translate3d-vs-translate-performance
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }

  protected _initStyle() {
    this._domStyle = getDomStyles(this._style, this._attributeCache);
  }

  protected _getParentElement(spec: ITooltipSpec): HTMLElement {
    return this._container ?? super._getParentElement(spec);
  }
}
