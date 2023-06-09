import { degreeToRadian, isEmpty, isString, isValid } from '@visactor/vutils';
import { DUPLICATED_ATTRS } from '../mark/utils';

/**
 * 针对一些可以配置状态样式的属性的转换函数，结构如下：
 * { style: {}, state: { hover: {} } }
 * @param cfg
 * @returns
 */
export function transformComponentStyle(cfg: any = {}) {
  if (!isEmpty(cfg.style)) {
    cfg.style = transformToGraphic(cfg.style);
  }

  if (!isEmpty(cfg.state)) {
    Object.keys(cfg.state).forEach(key => {
      if (!isEmpty(cfg.state[key])) {
        cfg.state[key] = transformToGraphic(cfg.state[key]);
      }
    });
  }

  return cfg;
}

export function transformStateStyle(stateStyle: any) {
  if (isEmpty(stateStyle)) {
    return null;
  }
  Object.keys(stateStyle).forEach(key => {
    if (!isEmpty(stateStyle[key])) {
      stateStyle[key] = transformToGraphic(stateStyle[key]);
    }
  });

  return stateStyle;
}

export function transformToGraphic(style: any) {
  if (isEmpty(style)) {
    return style;
  }
  if (style.angle) {
    style.angle = degreeToRadian(style.angle);
  }
  if (isValid(style.strokeWidth)) {
    style.lineWidth = style.strokeWidth;
  }
  if (isValid(style.limit)) {
    style.maxLineWidth = style.limit;
    delete style.limit;
  }
  Object.keys(DUPLICATED_ATTRS).forEach(oldAttr => {
    if (style[oldAttr]) {
      style[DUPLICATED_ATTRS[oldAttr]] = style[oldAttr];
      delete style[oldAttr];
    }
  });

  return style;
}
