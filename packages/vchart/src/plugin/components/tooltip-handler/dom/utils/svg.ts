import { escapeHTML } from '../../utils/common';
// eslint-disable-next-line no-duplicate-imports
import type { IGradientColor, ILinearGradient } from '@visactor/vrender-core';
import { Symbol } from '@visactor/vrender-core';
import { pixelPropertyStrToNumber } from './common';
import { isObject, isString } from '@visactor/vutils';
import type { ITooltipShapeActual } from '../../../../../typings';

export function getSvgHtml(option: ITooltipShapeActual | undefined, index?: number) {
  if (!option || !option.hasShape || !option.shapeType) {
    return '';
  }

  const styleString = `style="display:inline-block;vertical-align:middle;"`;
  const { shapeType, shapeFill, shapeStroke, shapeHollow = false } = option;
  const size = option.shapeSize ? escapeHTML(option.shapeSize) : '8px';
  const lineWidth = option.shapeLineWidth ? escapeHTML(option.shapeLineWidth) + 'px' : '0px';
  let fillString: string = 'currentColor';
  const getStroke = () => (shapeStroke ? escapeHTML(shapeStroke) : fillString);

  const sizeNumber = pixelPropertyStrToNumber(size) as number;
  const createSymbol = (symbolType: string) => new Symbol({ symbolType, size: sizeNumber, fill: true });

  let symbol = createSymbol(shapeType);
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

  if (!shapeFill || isString(shapeFill) || shapeHollow) {
    fillString = shapeHollow ? 'none' : shapeFill ? escapeHTML(shapeFill) : 'currentColor';
    return `
    <svg ${styleString} width="${size}" height="${size}" viewBox="${viewBox}">
      <path
        d="${path}"
        style="fill: ${fillString}; stroke: ${getStroke()}; stroke-width: ${lineWidth}"
      >
      </path>
    </svg>`;
  }
  if (isObject(shapeFill)) {
    fillString = 'gradientColor' + (index ?? '');
    let gradient = '';
    const stops = ((shapeFill as IGradientColor).stops ?? [])
      .map(s => `<stop offset="${escapeHTML(s.offset.toString())}" stop-color="${escapeHTML(s.color)}"/>`)
      .join('');
    if ((shapeFill as IGradientColor).gradient === 'radial') {
      gradient = `<radialGradient id="${fillString}" cx="50%" cy="50%" r="50%" fx="0%" fy="0%">
      ${stops}
      </radialGradient>`;
    } else if ((shapeFill as IGradientColor).gradient === 'linear') {
      gradient = `<linearGradient id="${fillString}" x1="${
        (((shapeFill as ILinearGradient).x0 as number) ?? 0) * 100
      }%" y1="${(((shapeFill as ILinearGradient).y0 as number) ?? 0) * 100}%" x2="${
        (((shapeFill as ILinearGradient).x1 as number) ?? 0) * 100
      }%" y2="${(((shapeFill as ILinearGradient).y1 as number) ?? 0) * 100}%">
      ${stops}
      </linearGradient>`;
    }
    return `
    <svg ${styleString} width="${size}" height="${size}" viewBox="-0.5 -0.5 1 1">
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
