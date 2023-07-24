import { degreeToRadian, isEmpty, isFunction } from '@visactor/vutils';
import type { Datum } from '../typings';
import type { LegendItemDatum } from '@visactor/vrender-components';

/**
 * 针对一些可以配置状态样式的属性的转换函数，结构如下：
 * { style: {}, state: { hover: {} } }
 * @param cfg
 * @returns
 */
export function transformComponentStyle(cfg: any = {}) {
  const newConfig = {
    ...cfg
  };

  if (isFunction(cfg.style)) {
    newConfig.style = (item: LegendItemDatum, isSelected: boolean, index: number, allItems: LegendItemDatum[]) =>
      transformToGraphic(cfg.style(item, isSelected, index, allItems));
  } else if (!isEmpty(cfg.style)) {
    newConfig.style = transformToGraphic(cfg.style);
  }

  if (!isEmpty(cfg.state)) {
    const newStateStyle = {};
    Object.keys(cfg.state).forEach(key => {
      if (isFunction(cfg.state[key])) {
        newStateStyle[key] = (item: LegendItemDatum, isSelected: boolean, index: number, allItems: LegendItemDatum[]) =>
          transformToGraphic(cfg.state[key](item, isSelected, index, allItems));
      } else if (!isEmpty(cfg.state[key])) {
        newStateStyle[key] = transformToGraphic(cfg.state[key]);
      }
    });
    newConfig.state = newStateStyle;
  }

  return newConfig;
}

export function transformStateStyle(stateStyle: any) {
  if (isEmpty(stateStyle)) {
    return null;
  }
  const newStateStyle = {};
  Object.keys(stateStyle).forEach(key => {
    if (isFunction(stateStyle[key])) {
      newStateStyle[key] = (value: any, index: number, datum: Datum, data: Datum[]) =>
        transformToGraphic(stateStyle[key](value, index, datum, data));
    } else if (!isEmpty(stateStyle[key])) {
      newStateStyle[key] = transformToGraphic(stateStyle[key]);
    }
  });

  return newStateStyle;
}

export function transformAxisLabelStateStyle(stateStyle: any) {
  if (isEmpty(stateStyle)) {
    return null;
  }
  const newStateStyle = {};
  Object.keys(stateStyle).forEach(key => {
    if (isFunction(stateStyle[key])) {
      newStateStyle[key] = (datum: Datum, index: number, data: Datum[], layer?: number) => {
        return transformToGraphic(stateStyle[key](datum.rawValue, index, datum, data, layer));
      };
    } else if (!isEmpty(stateStyle[key])) {
      newStateStyle[key] = transformToGraphic(stateStyle[key]);
    }
  });

  return newStateStyle;
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
