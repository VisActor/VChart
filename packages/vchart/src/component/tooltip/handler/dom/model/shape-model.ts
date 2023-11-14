import type { IGradientColor, ILinearGradient } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { Symbol } from '@visactor/vrender-core';

import { isObject, isString } from '@visactor/vutils';
import type { ShapeType } from '../../../../../typings';
import { BaseTooltipModel } from './base-tooltip-model';
import { pixelPropertyStrToNumber } from '../util';

export interface IShapeSvgOption {
  hasShape?: boolean;
  symbolType?: ShapeType | string;
  size?: string;
  fill?: string | IGradientColor;
  stroke?: string;
  lineWidth?: number;
  hollow?: boolean;
  marginTop?: string;
  index?: number;
}

export class ShapeModel extends BaseTooltipModel {
  svg: SVGElement;

  private _svgHtmlCache: string;

  init(classList?: string[], id?: string, tag?: keyof HTMLElementTagNameMap): void {
    if (!this.product) {
      const container = this.createElement(tag ?? 'div', [...(classList ?? []), 'shape'], undefined, id);
      this.product = container;
    }
  }

  setStyle(style?: Partial<CSSStyleDeclaration>, option?: IShapeSvgOption): void {
    super.setStyle(style);
    this.setSvg(option);
  }

  setContent(option: IShapeSvgOption) {
    this.setSvg(option);
  }

  setSvg(option?: IShapeSvgOption) {
    const html = getSvgHtml(option, this._option.valueToHtml);
    if (this.product && html !== this._svgHtmlCache) {
      this._svgHtmlCache = html;
      this.product.innerHTML = html;
    }
  }

  release(): void {
    super.release();
    this._svgHtmlCache = '';
  }
}

function getSvgHtml(option: IShapeSvgOption | undefined, valueToHtml: (value: any) => string) {
  if (!option?.hasShape || !option.symbolType) {
    return '';
  }

  const { symbolType, fill, stroke, hollow = false } = option;
  const size = option.size ? valueToHtml(option.size) : '8px';
  const marginTop = option.marginTop ? valueToHtml(option.marginTop) : '0px';
  const lineWidth = option.lineWidth ? valueToHtml(option.lineWidth) + 'px' : '0px';
  let fillString: string = 'currentColor';
  const getStroke = () => (stroke ? valueToHtml(stroke) : fillString);

  const symbol = new Symbol({ symbolType, size: pixelPropertyStrToNumber(size) as number, fill: true });
  const pathModel = symbol.getParsedPath().path ?? symbol.getParsedPath().pathStr;
  const path = pathModel.toString();
  let viewBox = '-0.5 -0.5 1 1';
  if (!isString(pathModel)) {
    const bounds = pathModel.bounds;
    viewBox = `${bounds.x1} ${bounds.y1} ${bounds.width()} ${bounds.height()}`;
  }

  if (!fill || isString(fill) || hollow) {
    fillString = hollow ? 'none' : fill ? valueToHtml(fill) : 'currentColor';
    return `
    <svg width="${size}" height="${size}" viewBox="${viewBox}"
      style="display: inline-block; vertical-align: middle; margin-top: ${marginTop};">
      <path
        d="${path}"
        style="fill: ${fillString}; stroke: ${getStroke()}; stroke-width: ${lineWidth}"
      >
      </path>
    </svg>`;
  }
  if (isObject(fill)) {
    fillString = 'gradientColor' + option.index ?? '';
    let gradient = '';
    const stops = (fill.stops ?? [])
      .map(s => `<stop offset="${valueToHtml(s.offset.toString())}" stop-color="${valueToHtml(s.color)}"/>`)
      .join('');
    if ((fill as IGradientColor).gradient === 'radial') {
      gradient = `<radialGradient id="${fillString}" cx="50%" cy="50%" r="50%" fx="0%" fy="0%">
      ${stops}
      </radialGradient>`;
    } else if ((fill as IGradientColor).gradient === 'linear') {
      gradient = `<linearGradient id="${fillString}" x1="${
        (((fill as ILinearGradient).x0 as number) ?? 0) * 100
      }%" y1="${(((fill as ILinearGradient).y0 as number) ?? 0) * 100}%" x2="${
        (((fill as ILinearGradient).x1 as number) ?? 0) * 100
      }%" y2="${(((fill as ILinearGradient).y1 as number) ?? 0) * 100}%">
      ${stops}
      </linearGradient>`;
    }
    return `
    <svg width="${size}" height="${size}" viewBox="-0.5 -0.5 1 1"
      style="display: inline-block; vertical-align: middle; margin-top: ${marginTop};">
      ${gradient}
      <path
        d="${path}"
        style="fill: url(#${fillString}); stroke: ${getStroke()}; stroke-width: ${lineWidth}"
      >
      </path>
    </svg>`;
  }

  return '';
}
