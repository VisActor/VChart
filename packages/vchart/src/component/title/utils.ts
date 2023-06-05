import type { IPadding } from '../../typings';
import { isNumber, isValid } from '@visactor/vutils';

export function transformPadding(padding: number | IPadding) {
  if (isNumber(padding)) {
    return padding;
  }

  const result: number[] = [
    padding.top ? padding.top : 0,
    padding.right ? padding.right : 0,
    padding.bottom ? padding.bottom : 0,
    padding.left ? padding.left : 0
  ];
  return result;
}

export function transformFillAndStroke(cfg: any) {
  const style = cfg.style;
  if (style) {
    if (style.stroke) {
      style.strokeColor = style.stroke;
      style.stroke = true;
    }
    if (isValid(style.strokeWidth)) {
      style.lineWidth = style.strokeWidth;
    }
    if (style.fill) {
      style.fillColor = style.fill;
      style.fill = true;
    }
  }

  return cfg;
}
