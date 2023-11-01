import type { Tag } from '@visactor/vrender-components';
import type { IBoundsLike } from '@visactor/vutils';
import type { Datum, IOrientType } from '../../typings';
import type { IChart } from '../../chart/interface';
import type { ICrosshairTheme } from './interface';
import { isValid } from '@visactor/vutils';
import { mergeSpec } from '../../util/spec/merge-spec';
import { isXAxis, isYAxis } from '../axis/cartesian/util/common';
import { isDiscrete } from '@visactor/vscale';
import type { IAxis } from '../axis';
import type { IModelOption } from '../../model/interface';
import { getComponentThemeFromOption } from '../util';
import { ComponentTypeEnum } from '../interface/type';

export function limitTagInBounds(shape: Tag, bounds: IBoundsLike) {
  const { x1: regionMinX, y1: regionMinY, x2: regionMaxX, y2: regionMaxY } = bounds;
  const { x1, y1, x2, y2 } = shape.AABBBounds;
  const { dx: originDx = 0, dy: originDy = 0 } = shape.attribute;

  let dx = 0;
  let dy = 0;
  if (x1 < regionMinX) {
    // 超出左侧
    dx = regionMinX - x1;
  }
  if (y1 < regionMinY) {
    // 超出顶部
    dy = regionMinY - y1;
  }

  if (x2 > regionMaxX) {
    // 超出右侧
    dx = regionMaxX - x2;
  }

  if (y2 > regionMaxY) {
    // 整体超出顶部
    dy = regionMaxY - y2;
  }
  if (dx) {
    shape.setAttribute('dx', dx + originDx);
  }
  if (dy) {
    shape.setAttribute('dy', dy + originDy);
  }
}

// 二分查找数据
export function getDatumByValue(data: Datum[], value: number, startField: string, endField?: string): Datum | null {
  let left = 0;
  let right = data.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const record = data[mid];

    if (record[startField] <= value && record[endField || startField] >= value) {
      return record;
    }

    if (record[startField] > value) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return null;
}

export const getCartesianCrosshairTheme = (option: Partial<IModelOption>, chart: IChart): ICrosshairTheme => {
  const axes = chart.getAllComponents().filter(component => component.type.includes('Axis')) as IAxis[];
  const { bandField, linearField, xField, yField } =
    getComponentThemeFromOption(ComponentTypeEnum.crosshair, option) ?? {};

  const xAxis = axes.find(axis => isXAxis(axis.getOrient() as IOrientType));
  let newXField;
  if (isValid(xAxis)) {
    newXField = mergeSpec({}, isDiscrete(xAxis.getScale().type) ? bandField : linearField, xField);
  } else {
    newXField = xField;
  }

  const yAxis = axes.find(axis => isYAxis(axis.getOrient() as IOrientType));
  let newYField;
  if (isValid(yAxis)) {
    newYField = mergeSpec({}, isDiscrete(yAxis.getScale().type) ? bandField : linearField, yField);
  } else {
    newYField = yField;
  }

  return {
    xField: newXField,
    yField: newYField
  };
};

export const getPolarCrosshairTheme = (option: Partial<IModelOption>, chart: IChart): ICrosshairTheme => {
  const axes = chart.getAllComponents().filter(component => component.type.includes('Axis')) as IAxis[];
  const { bandField, linearField, categoryField, valueField } =
    getComponentThemeFromOption(ComponentTypeEnum.crosshair, option) ?? {};

  const angleAxis = axes.find(axis => axis.getOrient() === 'angle');
  let newAngleField;
  if (isValid(angleAxis)) {
    newAngleField = mergeSpec({}, isDiscrete(angleAxis.getScale().type) ? bandField : linearField, categoryField);
  } else {
    newAngleField = categoryField;
  }

  const radiusAxis = axes.find(axis => axis.getOrient() === 'radius');
  let newRadiusField;
  if (isValid(radiusAxis)) {
    newRadiusField = mergeSpec({}, isDiscrete(radiusAxis.getScale().type) ? bandField : linearField, valueField);
  } else {
    newRadiusField = valueField;
  }

  return {
    categoryField: newAngleField,
    valueField: newRadiusField
  };
};
