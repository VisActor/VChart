import type { ITooltipActual, ITooltipPositionActual } from '../../../../typings/tooltip';
import { BaseTooltipHandler } from '../base';
import { cssToStyleString, getDomStyle, getTextStyle, setStyleToDom } from './utils/style';
import { TOOLTIP_CONTAINER_EL_CLASS_NAME } from '../constants';
import { type Maybe, isNil } from '@visactor/vutils';
import type { IContainerSize } from '@visactor/vrender-components';
import { domDocument } from '../../../../util/env';
import type { ITooltipSpec, TooltipHandlerParams } from '../../../../component/tooltip';
import type { IComponentPluginService } from '../../interface';
import { registerComponentPlugin } from '../../register';
import { DEFAULT_TOOLTIP_Z_INDEX } from './constant';
import type { ILayoutPoint } from '../../../../typings';
import { TooltipHandlerType } from '../../../../component/tooltip/constant';
import { getSvgHtml } from './utils/svg';
import { escapeHTML } from '../utils';

/**
 * The tooltip handler class.
 */
export class DomTooltipHandler extends BaseTooltipHandler {
  static readonly type = TooltipHandlerType.dom;
  readonly type = TooltipHandlerType.dom;

  protected _tooltipContainer = domDocument?.body;
  protected _domStyle: {
    panel: Partial<CSSStyleDeclaration>;
    row: Partial<CSSStyleDeclaration>;
    title: Partial<CSSStyleDeclaration>;
    shape: Partial<CSSStyleDeclaration>;
    key: Partial<CSSStyleDeclaration>;
    value: Partial<CSSStyleDeclaration>;
  };
  protected _rootDom?: HTMLElement;
  protected _tooltipActual?: ITooltipActual;
  protected declare _container: Maybe<HTMLDivElement>;
  protected _domString?: string;

  /** 自定义 tooltip 的位置缓存 */
  protected _cacheCustomTooltipPosition: ILayoutPoint;

  getVisibility() {
    return this._rootDom ? this._rootDom.style.visibility === 'visible' : false;
  }

  setVisibility(_value: boolean) {
    // 这里做个节流
    if (_value !== this.getVisibility() && this._rootDom) {
      this._rootDom.style.visibility = _value ? 'visible' : 'hidden';
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
    const tooltipSpec = this._component.getSpec() as ITooltipSpec;
    const parentElement = tooltipSpec.parentElement as HTMLElement | HTMLCanvasElement;
    if (domDocument && parentElement && parentElement.children && parentElement.children.length) {
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
      const tooltipElement = document.createElement('div');
      setStyleToDom(tooltipElement, {
        left: '0',
        top: '0',
        pointerEvents: 'none',
        padding: '12px',
        position: 'absolute',
        zIndex: DEFAULT_TOOLTIP_Z_INDEX,
        fontFamily: 'sans-serif',
        fontSize: '11px',
        borderRadius: '3px',
        borderStyle: 'solid',
        lineHeight: 'initial',
        background: '#fff',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
        maxWidth: '100wh',
        maxHeight: '100vh',
        ...this._domStyle?.panel
      } as CSSStyleDeclaration);

      this._container.appendChild(tooltipElement);
      this._rootDom = tooltipElement;
    }
  }

  // 计算 tooltip 内容区域的宽高，并缓存结果
  protected _getTooltipBoxSize(actualTooltip: ITooltipActual, changePositionOnly: boolean): IContainerSize | undefined {
    if (!changePositionOnly || isNil(this._domString)) {
      this._updateDomString(actualTooltip);
    }
    this._rootDom.innerHTML = this._domString ?? '';

    this._updateDomStyle();

    const rect = this._rootDom?.getBoundingClientRect();

    return {
      width: rect?.width,
      height: rect?.height
    };
  }

  protected _removeTooltip() {
    if (this._rootDom && this._rootDom.parentNode) {
      this._rootDom.parentNode.removeChild(this._rootDom);
      this._rootDom = null;
    }
    this._container = null;
  }

  protected _updateTooltip(visible: boolean, params: TooltipHandlerParams) {
    if (!visible || !this._rootDom) {
      this.setVisibility(visible);
      this._cacheCustomTooltipPosition = undefined;
    } else {
      const { tooltipSpec, activeTooltipSpec } = params;

      if (!params.changePositionOnly) {
        this._tooltipActual = activeTooltipSpec;
      }
      this.setVisibility(visible);

      // 位置
      const el = this._rootDom;
      if (el) {
        const { x = 0, y = 0 } = activeTooltipSpec.position ?? {};
        if (tooltipSpec.updateElement) {
          // 此处先设定一次位置，防止页面暂时出现滚动条（优先设置上次的位置）
          this._updatePosition(this._cacheCustomTooltipPosition ?? { x, y });
          // 更新 tooltip dom
          tooltipSpec.updateElement(el, activeTooltipSpec, params);
          // 重新计算 tooltip 位置
          const position = this._getActualTooltipPosition(activeTooltipSpec, params, {
            width: el.offsetWidth,
            height: el.offsetHeight
          });
          // 更新位置
          this._updatePosition(position);
          // 更新缓存
          this._cacheCustomTooltipPosition = position;
        } else {
          this._updatePosition({ x, y });
        }
      }
    }
  }

  protected _initStyle() {
    this._domStyle = getDomStyle(this._component.getSpec(), this._chartOption?.getTheme() ?? {});
  }

  protected _updateDomString(actualTooltip?: ITooltipActual) {
    let domString = '';
    const { title = {}, content } = actualTooltip;
    const hasContent = content && content.length;
    const rowStyle = this._domStyle.row;

    if (title.visible !== false) {
      domString += `<h2 style="${cssToStyleString({
        ...this._domStyle.title,
        ...(hasContent ? rowStyle : { marginBottom: '0px' }),
        marginTop: '0px'
      })}"><span>${title.value ?? ''}</span></h2>`;
    }
    if (hasContent) {
      const shapeContent = content
        .map((entry, index) => {
          return `<div class="shape" style="${cssToStyleString({
            ...(index === content.length - 1 ? null : rowStyle)
          })}">${getSvgHtml(entry)}</div>`;
        })
        .join('');
      const keyContent = content
        .map((entry, index) => {
          return `<div class="key" style="${cssToStyleString({
            ...(entry.keyStyle ? getTextStyle(entry.keyStyle) : null),
            ...(index === content.length - 1 ? null : rowStyle)
          })}">${escapeHTML(entry.key)}</div>`;
        })
        .join('');
      const valueContent = content
        .map((entry, index) => {
          return `<div class="value" style="${cssToStyleString({
            ...(entry.valueStyle ? getTextStyle(entry.valueStyle) : null),
            ...(index === content.length - 1 ? null : rowStyle)
          })}">${escapeHTML(entry.value)}</div>`;
        })
        .join('');

      domString += `<div class="container-box">
      <div class="shape-box" style="float:left;${cssToStyleString(this._domStyle.shape)}">
        ${shapeContent}
      </div>
      <div class="key-box" style="float:left;${cssToStyleString(this._domStyle.key)}">
        ${keyContent}
      </div>
      <div class="value-box" style="float:left;${cssToStyleString(this._domStyle.value)}">
       ${valueContent}
      </div>`;
    }

    this._domString = domString;
  }
  protected _updateDomStyle(actualTooltip?: ITooltipActual) {
    const rootDom = this._rootDom;

    if (rootDom) {
      const contentDom = rootDom.children[rootDom.children.length - 1];

      if (contentDom.className.includes('container-box')) {
        const columns = contentDom.children;
        const heightByRow: number[] = [];

        if (columns) {
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];

            const rows = column.children ?? ([] as HTMLElement[]);

            for (let j = 0; j < rows.length; j++) {
              const height = rows[j].getBoundingClientRect().height;

              if (heightByRow[j] === undefined || heightByRow[j] < height) {
                heightByRow[j] = height;
              }
            }
          }

          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];

            const rows = column.children ?? ([] as HTMLElement[]);

            for (let j = 0; j < rows.length; j++) {
              const row = rows[j];

              (row as HTMLElement).style.height = `${heightByRow[j]}px`;
            }
          }
        }
      }
    }
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

  protected _updatePosition({ x, y }: ITooltipPositionActual) {
    if (this._rootDom) {
      // translate3d 性能较好：https://stackoverflow.com/questions/22111256/translate3d-vs-translate-performance
      this._rootDom.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }
}

export const registerDomTooltipHandler = () => {
  registerComponentPlugin(DomTooltipHandler);
};
