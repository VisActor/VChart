import type { IGradientColor, ILinearGradient } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { Symbol } from '@visactor/vrender-core';

import { isObject, isString } from '@visactor/vutils';
import type { ShapeType } from '../../../../../typings';
import { BaseTooltipModel } from './base-tooltip-model';
import { pixelPropertyStrToNumber } from '../utils';

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

const builtInShape = {
  // FIXME: vrender 的五角星是用 canvas api 画出来的，没有内置的 path。这里先覆盖一下，等 vrender 修复
  // eslint-disable-next-line max-len
  star: 'M0 -1L0.22451398828979266 -0.3090169943749474L0.9510565162951535 -0.30901699437494745L0.3632712640026804 0.1180339887498948L0.5877852522924732 0.8090169943749473L8.326672684688674e-17 0.3819660112501051L-0.587785252292473 0.8090169943749476L-0.3632712640026804 0.11803398874989487L-0.9510565162951536 -0.30901699437494723L-0.22451398828979274 -0.30901699437494734Z'
};

function getSvgHtml(option: IShapeSvgOption | undefined, valueToHtml: (value: any) => string) {
  if (!option?.hasShape || !option.symbolType) {
    return '';
  }

  const { symbolType, fill, stroke, hollow = false } = option;
  const size = option.size ? valueToHtml(option.size) : '8px';
  const lineWidth = option.lineWidth ? valueToHtml(option.lineWidth) + 'px' : '0px';
  let fillString: string = 'currentColor';
  const getStroke = () => (stroke ? valueToHtml(stroke) : fillString);

  const sizeNumber = pixelPropertyStrToNumber(size) as number;
  const createSymbol = (symbolType: string) => new Symbol({ symbolType, size: sizeNumber, fill: true });

  let symbol = createSymbol(builtInShape[symbolType] ?? symbolType);
  const parsedPath = symbol.getParsedPath();
  if (!parsedPath.path) {
    symbol = createSymbol(parsedPath.pathStr);
  }
  const pathModel = symbol.getParsedPath().path;
  const path = pathModel.toString();
  const bounds = pathModel.bounds;
  let viewBox = `${bounds.x1} ${bounds.y1} ${bounds.width()} ${bounds.height()}`;

  // svg 不支持内描边，需要手动将描边空间预留在 viewBox 上
  if (lineWidth !== '0px') {
    const [x, y, w, h] = viewBox.split(' ').map(n => Number(n));
    const lw = Number(lineWidth.slice(0, -2));
    viewBox = `${x - lw / 2} ${y - lw / 2} ${w + lw} ${h + lw}`;
  }

  if (!fill || isString(fill) || hollow) {
    fillString = hollow ? 'none' : fill ? valueToHtml(fill) : 'currentColor';
    return `
    <svg width="${size}" height="${size}" viewBox="${viewBox}"
      style="display: block;">
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
      style="display: block;">
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
