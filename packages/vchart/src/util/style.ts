import { degreeToRadian, isEmpty, isFunction, isValid, isValidNumber } from '@visactor/vutils';
import type { Datum } from '../typings';
import type { LegendItemDatum } from '@visactor/vrender-components';

/**
 * 针对一些可以配置状态样式的属性的转换函数，结构如下：
 * { style: {}, state: { hover: {} } }
 * @param cfg
 * @returns
 */
export function transformComponentStyle(cfg: any = {}) {
  if (!isEmpty(cfg.style)) {
    if (isFunction(cfg.style)) {
      cfg.style = (item: LegendItemDatum, isSelected: boolean, index: number, allItems: LegendItemDatum[]) =>
        cfg.style(item, isSelected, index, allItems);
    }
    cfg.style = transformToGraphic(cfg.style);
  }

  if (!isEmpty(cfg.state)) {
    Object.keys(cfg.state).forEach(key => {
      if (!isEmpty(cfg.state[key])) {
        if (isFunction(cfg.state[key])) {
          cfg.state[key] = (item: LegendItemDatum, isSelected: boolean, index: number, allItems: LegendItemDatum[]) =>
            cfg.state[key](item, isSelected, index, allItems);
        }
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
      if (isFunction(stateStyle[key])) {
        stateStyle[key] = (value: any, index: number, datum: Datum, data: Datum[]) =>
          stateStyle[key](value, index, datum, data);
      }
      stateStyle[key] = transformToGraphic(stateStyle[key]);
    }
  });

  return stateStyle;
}

export function transformAxisLabelStateStyle(stateStyle: any) {
  if (isEmpty(stateStyle)) {
    return null;
  }
  Object.keys(stateStyle).forEach(key => {
    if (!isEmpty(stateStyle[key])) {
      if (isFunction(stateStyle[key])) {
        stateStyle[key] = (datum: Datum, index: number, data: Datum[], layer?: number) =>
          stateStyle[key](datum.rawValue, index, datum, data, layer);
      }
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

  return style;
}
