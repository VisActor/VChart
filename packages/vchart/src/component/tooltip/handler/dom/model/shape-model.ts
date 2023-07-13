import type { IGradientColor, ILinearGradient } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { builtinSymbolsMap } from '@visactor/vrender';

import { isObject, isString } from '../../../../../util';
import type { ShapeType } from '../../../../../typings';
import { BaseTooltipModel } from './base-tooltip-model';

export interface IShapeSvgOption {
  hasShape?: boolean;
  shapeType?: ShapeType;
  size?: string;
  color?: string | IGradientColor;
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
  if (!option?.hasShape || !option.shapeType || !builtinSymbolsMap[option.shapeType]) {
    return '';
  }

  const { shapeType, size, color, hollow = false, marginTop = '0px' } = option;

  // FIXME 通过 VRender 获取symbol path
  const path = builtinSymbolsMap[shapeType].pathStr;
  let fill: string = 'currentColor';
  if (!color || isString(color) || hollow) {
    fill = hollow ? 'none' : (color as string) ?? 'currentColor';
    return `
    <svg width="${size}" height="${size}" viewBox="-0.5 -0.5 1 1"
      style="display: inline-block; vertical-align: middle; margin-top: ${marginTop};">
      <path fill="${fill}" d="${path}" style="fill: ${fill};">
      </path>
    </svg>`;
  }
  if (isObject(color)) {
    fill = 'gradientColor';
    let gradient = '';
    if ((color as IGradientColor).gradient === 'radial') {
      gradient = `
      <radialGradient id="${fill}" cx="50%" cy="50%" r="50%" fx="0%" fy="0%">
        ${(((color as IGradientColor).stops as any[]) ?? []).map(
          s => `<stop offset="${s.offset}" stop-color="${s.color}"/>`
        )}
     	</radialGradient>
      `;
    } else if ((color as IGradientColor).gradient === 'linear') {
      gradient = `
      <linearGradient id="${fill}" x1="${(((color as ILinearGradient).x0 as number) ?? 0) * 100}%" y1="${
        (((color as ILinearGradient).y0 as number) ?? 0) * 100
      }%" x2="${(((color as ILinearGradient).x1 as number) ?? 0) * 100}%" y2="${
        (((color as ILinearGradient).y1 as number) ?? 0) * 100
      }%">
        ${((color as ILinearGradient).stops ?? []).map(s => `<stop offset="${s.offset}" stop-color="${s.color}"/>`)}
      </linearGradient>
      `;
    }
    return `
    <svg width="${size}" height="${size}" viewBox="-0.5 -0.5 1 1"
      style="display: inline-block; vertical-align: middle; margin-top: ${marginTop};">
      ${gradient}
      <path fill="url(#${fill})" d="${path}" style="fill: url(#${fill});">
      </path>
    </svg>`;
  }

  return '';
}
