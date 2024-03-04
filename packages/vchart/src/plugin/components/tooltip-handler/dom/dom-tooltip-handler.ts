import type { ITooltipActual } from '../../../../typings/tooltip';
import { BaseTooltipHandler } from '../base';
import { getDomStyles } from './utils';
import type { IDomTooltipStyle } from './interface';
import { TooltipModel } from './model/tooltip-model';
import { TOOLTIP_CONTAINER_EL_CLASS_NAME, TooltipHandlerType } from '../constants';
import type { Maybe } from '@visactor/vutils';
import { domDocument } from '../../../../util/env';
import type { ITooltipSpec, TooltipHandlerParams } from '../../../../component/tooltip';
import type { IComponentPluginService } from '../../interface';
import { registerComponentPlugin } from '../../register';
import { DEFAULT_TOOLTIP_Z_INDEX } from './constant';

/**
 * The tooltip handler class.
 */
export class DomTooltipHandler extends BaseTooltipHandler {
  static readonly type = TooltipHandlerType.dom;
  readonly type = TooltipHandlerType.dom;

  protected _tooltipContainer = domDocument?.body;
  protected _domStyle: IDomTooltipStyle;
  protected _tooltipActual?: ITooltipActual;
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

  constructor() {
    super(DomTooltipHandler.type);
  }

  onAdd(service: IComponentPluginService<any>): void {
    super.onAdd(service);
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
        this._container.style.zIndex = DEFAULT_TOOLTIP_Z_INDEX;
        this._container.classList.add(TOOLTIP_CONTAINER_EL_CLASS_NAME);
        parentElement.appendChild(this._container);
      }
      this.model = new TooltipModel(
        {
          valueToHtml: this._option.sanitize,
          getTooltipStyle: () => this._domStyle,
          getTooltipActual: () => this._tooltipActual,
          getTooltipAttributes: () => this._attributes,
          getContainer: () => this._container
        },
        [tooltipSpec.className],
        this.name
      );
    }
  }

  protected _removeTooltip() {
    this.model?.release();
    this._container = null;
  }

  protected _updateTooltip(visible: boolean, params: TooltipHandlerParams, actualTooltip: ITooltipActual) {
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
      const el = this.model.product;
      if (el) {
        const { x = 0, y = 0 } = actualTooltip.position ?? {};
        // 此处先设定一次位置，防止页面暂时出现滚动条
        // translate3d 性能较好：https://stackoverflow.com/questions/22111256/translate3d-vs-translate-performance
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        if (this._cacheViewSpec?.updateElement) {
          this._cacheViewSpec.updateElement(el, actualTooltip, params);
          // 重新计算 tooltip 位置
          const position = this._getActualTooltipPosition(actualTooltip, params, {
            width: el.offsetWidth,
            height: el.offsetHeight
          });
          // 更新位置
          el.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
        }
      }
    }
  }

  protected _initStyle() {
    this._domStyle = getDomStyles(this._attributes);
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

export const registerDomTooltipHandler = () => {
  registerComponentPlugin(DomTooltipHandler);
};
