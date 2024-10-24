import type { ITooltipActual, ITooltipPositionActual } from '../../../typings/tooltip';
import { BaseTooltipHandler } from './base';
import { cssToStyleString, getDomStyle, getTextStyle, setStyleToDom } from './utils/style';
import {
  TOOLTIP_CONTAINER_EL_CLASS_NAME,
  DEFAULT_TOOLTIP_Z_INDEX,
  TOOLTIP_PREFIX,
  TOOLTIP_CONTENT_BOX_CLASS_NAME,
  TOOLTIP_TITLE_CLASS_NAME
} from './constants';
import { type Maybe, isNil, isValid } from '@visactor/vutils';
import type { IContainerSize } from '@visactor/vrender-components';
import { domDocument } from '../../../util/env';
import type { ITooltipSpec, TooltipHandlerParams } from '../../../component/tooltip';
import type { IComponentPluginService } from '../interface';
import { registerComponentPlugin } from '../register';
import type { ILayoutPoint } from '../../../typings';
import { TooltipHandlerType } from '../../../component/tooltip/constant';
import { getSvgHtml } from './utils/svg';
import { escapeHTML } from './utils/common';
import { token } from '../../../theme/token';
import { calcLayoutNumber } from '../../../util/space';
/**
 * The tooltip handler class.
 */
export class DomTooltipHandler extends BaseTooltipHandler {
  static readonly type = TooltipHandlerType.dom;
  readonly type = TooltipHandlerType.dom;

  protected _tooltipContainer = domDocument?.body;
  protected _domStyle: {
    panelPadding?: number[];
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
      const globalTheme = this._chartOption?.getTheme() ?? {};

      setStyleToDom(tooltipElement, {
        left: '0',
        top: '0',
        pointerEvents: 'none',
        padding: '12px',
        position: 'absolute',
        zIndex: DEFAULT_TOOLTIP_Z_INDEX,
        fontFamily: (globalTheme?.fontFamily ?? token.fontFamily) as string,
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
      this._updateDomStringByCol(actualTooltip);
    }
    this._rootDom.innerHTML = this._domString ?? '';

    this._updateDomStyle('height');

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
    const tooltipSpec = this._component.getSpec() as ITooltipSpec;

    this._domStyle = getDomStyle(tooltipSpec);
  }

  // protected _updateDomString(actualTooltip?: ITooltipActual) {
  //   let domString = '';
  //   const { title = {}, content } = actualTooltip;
  //   const hasContent = content && content.length;
  //   const rowStyle = this._domStyle.row;

  //   if (title.visible !== false) {
  //     domString += `<h2 style="${cssToStyleString({
  //       ...this._domStyle.title,
  //       ...(hasContent ? rowStyle : { marginBottom: '0px' }),
  //       marginTop: '0px'
  //     })}"><span>${title.value ?? ''}</span></h2>`;
  //   }
  //   if (hasContent) {
  //     const rowItems = content
  //       .map((entry, index) => {
  //         const rowStyleString = cssToStyleString({
  //           ...(index === content.length - 1 ? null : rowStyle)
  //         });

  //         return `<div class="${TOOLTIP_PREFIX}-row" style="${rowStyleString}">
  //       <div class="${TOOLTIP_PREFIX}-shape" style="${cssToStyleString({
  //           display: 'inline-block',
  //           ...this._domStyle.shape
  //         })}">${getSvgHtml(entry)}</div>
  //       <div class="${TOOLTIP_PREFIX}-key" style="${cssToStyleString({
  //           display: 'inline-block',
  //           ...this._domStyle.key,
  //           ...(entry.keyStyle ? getTextStyle(entry.keyStyle) : null)
  //         })}">${escapeHTML(entry.key)}</div>
  //       <div class="${TOOLTIP_PREFIX}-value" style="${cssToStyleString({
  //           display: 'inline-block',
  //           ...this._domStyle.value,
  //           ...(entry.valueStyle ? getTextStyle(entry.valueStyle) : null)
  //         })}">${escapeHTML(entry.value)}</div>
  //       </div>`;
  //       })
  //       .join('');

  //     domString += `<div class="${TOOLTIP_CONTENT_BOX_CLASS_NAME}" style="${cssToStyleString(
  //       this._domStyle.content
  //     )}">${rowItems}</div>`;
  //   }

  //   this._domString = domString;
  // }

  protected _updateDomStringByCol(actualTooltip?: ITooltipActual) {
    let domString = '';
    const { title = {}, content } = actualTooltip;
    const hasContent = content && content.length;
    const rowStyle = this._domStyle.row;

    if (title.visible !== false) {
      domString += `<h2 class="${TOOLTIP_TITLE_CLASS_NAME}" style="${cssToStyleString({
        ...this._domStyle.title,
        ...(hasContent ? rowStyle : { marginBottom: '0px' }),
        marginTop: '0px'
      })}"><span>${title.value ?? ''}</span></h2>`;
    }
    if (hasContent) {
      let shapeItems = '';
      let keyItems = '';
      let valueItems = '';
      content.forEach((entry, index) => {
        const styleByRow = index === content.length - 1 ? null : rowStyle;

        shapeItems += `<div class="${TOOLTIP_PREFIX}-shape" style="${cssToStyleString(styleByRow)}">${getSvgHtml(
          entry
        )}</div>`;

        keyItems += `<div class="${TOOLTIP_PREFIX}-key" style="${cssToStyleString({
          ...styleByRow,
          ...(entry.keyStyle ? getTextStyle(entry.keyStyle) : null)
        })}">${escapeHTML(entry.key)}</div>`;

        valueItems += `<div class="${TOOLTIP_PREFIX}-value" style="${cssToStyleString({
          ...styleByRow,
          ...(entry.valueStyle ? getTextStyle(entry.valueStyle) : null)
        })}">${escapeHTML(entry.value)}</div>`;
      });

      domString += `<div class="${TOOLTIP_CONTENT_BOX_CLASS_NAME}">
        <div class="${TOOLTIP_PREFIX}-shape-column" style="${cssToStyleString({
        ...this._domStyle.shape,
        display: 'inline-block',
        verticalAlign: 'top'
      })}">
        ${shapeItems}
        </div>
        <div class="${TOOLTIP_PREFIX}-key-column" style="${cssToStyleString({
        ...this._domStyle.key,
        display: 'inline-block',
        verticalAlign: 'top'
      })}">
        ${keyItems}
        </div>
        <div class="${TOOLTIP_PREFIX}-value-column" style="${cssToStyleString({
        ...this._domStyle.value,
        display: 'inline-block',
        verticalAlign: 'top'
      })}">
        ${valueItems}
        </div>
      </div>`;
    }

    this._domString = domString;
  }
  protected _updateDomStyle(sizeKey: 'width' | 'height' = 'width') {
    const rootDom = this._rootDom;

    if (rootDom) {
      const contentDom = rootDom.children[rootDom.children.length - 1];

      if (contentDom.className.includes(TOOLTIP_CONTENT_BOX_CLASS_NAME)) {
        const tooltipSpec = this._component.getSpec() as ITooltipSpec;
        const contentStyle: Partial<CSSStyleDeclaration> = {};

        if (isValid(tooltipSpec?.style?.maxContentHeight)) {
          const titleDom = rootDom.children[0];
          const titleHeight =
            titleDom && titleDom.className.includes(TOOLTIP_TITLE_CLASS_NAME)
              ? titleDom.getBoundingClientRect().height + (tooltipSpec.style.spaceRow ?? 0)
              : 0;
          const viewBox = this._chartOption.viewBox;
          const maxHeight = calcLayoutNumber(
            tooltipSpec.style.maxContentHeight,
            Math.min(viewBox.y2 - viewBox.y1, document.body.clientHeight) -
              titleHeight -
              (this._domStyle.panelPadding ? this._domStyle.panelPadding[0] + this._domStyle.panelPadding[1] : 0)
          );

          if (maxHeight > 0) {
            contentStyle.maxHeight = `${maxHeight}px`;
            contentStyle.overflowY = 'auto';
            // todo 让内容宽度往外阔一点，给滚动条留出位置
            contentStyle.width = `calc(100% + ${
              this._domStyle.panelPadding ? this._domStyle.panelPadding[1] + 'px' : '10px'
            })`;

            setStyleToDom(contentDom as HTMLElement, contentStyle);
          }
        }

        const rows = contentDom.children;
        const widthByCol: number[] = [];
        if (rows) {
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cols = row.children ?? ([] as HTMLElement[]);

            for (let j = 0; j < cols.length; j++) {
              const width = cols[j].getBoundingClientRect()[sizeKey];
              if (widthByCol[j] === undefined || widthByCol[j] < width) {
                widthByCol[j] = width;
              }
            }
          }

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cols = row.children ?? ([] as HTMLElement[]);

            for (let j = 0; j < cols.length; j++) {
              (cols[j] as HTMLElement).style[sizeKey] = `${widthByCol[j]}px`;
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
