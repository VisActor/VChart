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
    const html = getSvgHtml(option);
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

function getSvgHtml(option?: IShapeSvgOption) {
  if (!option?.hasShape || !option.symbolType) {
    return '';
  }

  const { symbolType, size, fill, stroke, lineWidth, hollow = false, marginTop = '0px' } = option;
  const symbol = new Symbol({ symbolType, size: pixelPropertyStrToNumber(size) as number, fill: true });
  const pathModel = symbol.getParsedPath().path ?? symbol.getParsedPath().pathStr;
  const path = pathModel.toString();
  let viewBox = '-0.5 -0.5 1 1';
  if (!isString(pathModel)) {
    const bounds = pathModel.bounds;
    viewBox = `${bounds.x1} ${bounds.y1} ${bounds.width()} ${bounds.height()}`;
  }

  let fillString: string = 'currentColor';
  if (!fill || isString(fill) || hollow) {
    fillString = hollow ? 'none' : (fill as string) ?? 'currentColor';
    return `
    <svg width="${size}" height="${size}" viewBox="${viewBox}"
      style="display: inline-block; vertical-align: middle; margin-top: ${marginTop};">
      <path
        d="${path}"
        style="fill: ${fillString}; stroke: ${stroke ?? fillString}; stroke-width: ${lineWidth ?? 0}px"
      >
      </path>
    </svg>`;
  }
  if (isObject(fill)) {
    fillString = 'gradientColor';
    let gradient = '';
    if ((fill as IGradientColor).gradient === 'radial') {
      gradient = `
      <radialGradient id="${fillString}" cx="50%" cy="50%" r="50%" fx="0%" fy="0%">
        ${(((fill as IGradientColor).stops as any[]) ?? []).map(
          s => `<stop offset="${s.offset}" stop-color="${s.color}"/>`
        )}
     	</radialGradient>
      `;
    } else if ((fill as IGradientColor).gradient === 'linear') {
      gradient = `
      <linearGradient id="${fillString}" x1="${(((fill as ILinearGradient).x0 as number) ?? 0) * 100}%" y1="${
        (((fill as ILinearGradient).y0 as number) ?? 0) * 100
      }%" x2="${(((fill as ILinearGradient).x1 as number) ?? 0) * 100}%" y2="${
        (((fill as ILinearGradient).y1 as number) ?? 0) * 100
      }%">
        ${((fill as ILinearGradient).stops ?? []).map(s => `<stop offset="${s.offset}" stop-color="${s.color}"/>`)}
      </linearGradient>
      `;
    }
    return `
    <svg width="${size}" height="${size}" viewBox="-0.5 -0.5 1 1"
      style="display: inline-block; vertical-align: middle; margin-top: ${marginTop};">
      ${gradient}
      <path
        d="${path}"
        style="fill: url(#${fillString}); stroke: ${stroke ?? fillString}; stroke-width: ${lineWidth ?? 0}px"
      >
      </path>
    </svg>`;
  }

  return '';
}
