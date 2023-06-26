import { degreeToRadian, isEmpty, isValid, isValidNumber } from '@visactor/vutils';

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

export function transformCornerRadius(style: any) {
  if (isEmpty(style)) {
    return style;
  }

  if (
    isValidNumber(style.cornerRadiusBottomLeft) ||
    isValidNumber(style.cornerRadiusBottomRight) ||
    isValidNumber(style.cornerRadiusTopLeft) ||
    isValidNumber(style.cornerRadiusTopRight)
  ) {
    style.cornerRadius = [
      style.cornerRadiusTopLeft ?? 0,
      style.cornerRadiusTopRight ?? 0,
      style.cornerRadiusBottomRight ?? 0,
      style.cornerRadiusBottomLeft ?? 0
    ];
  }

  return style;
}

export function transformToGraphic(style: any) {
  if (isEmpty(style)) {
    return style;
  }
  if (style.angle) {
    style.angle = degreeToRadian(style.angle);
  }

  transformCornerRadius(style);

  return style;
}
