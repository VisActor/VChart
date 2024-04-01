import type { Tag } from '@visactor/vrender-components';
import type { IBoundsLike } from '@visactor/vutils';
import type { Datum, StringOrNumber } from '../../../typings';
import type { ICrosshairTheme } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { array, isValid, isValidNumber } from '@visactor/vutils';
import { isXAxis, isYAxis } from '../../axis/cartesian/util/common';
import { isContinuous, isDiscrete } from '@visactor/vscale';
import type { IAxis, ICartesianAxisCommonSpec, IPolarAxisCommonSpec } from '../../axis';
import { getComponentThemeFromOption } from '../../util';
import { ComponentTypeEnum } from '../../interface/type';
import type { ITheme } from '../../../theme';
import { isDiscreteAxis } from '../../axis/util';
import { mergeSpec } from '@visactor/vutils-extension';

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

export const getCartesianCrosshairTheme = (chartTheme: ITheme, chartSpec: any): ICrosshairTheme => {
  const axes: ICartesianAxisCommonSpec[] = array(chartSpec.axes ?? []);
  const { bandField, linearField, xField, yField } =
    getComponentThemeFromOption(ComponentTypeEnum.crosshair, chartTheme) ?? {};

  const xAxis = axes.find(axis => isXAxis(axis.orient));
  let newXField;
  if (isValid(xAxis)) {
    newXField = mergeSpec({}, isDiscreteAxis(xAxis.type) ? bandField : linearField, xField);
  } else {
    newXField = xField;
  }

  const yAxis = axes.find(axis => isYAxis(axis.orient));
  let newYField;
  if (isValid(yAxis)) {
    newYField = mergeSpec({}, isDiscrete(yAxis.type) ? bandField : linearField, yField);
  } else {
    newYField = yField;
  }

  return {
    xField: newXField,
    yField: newYField
  };
};

export const getPolarCrosshairTheme = (chartTheme: ITheme, chartSpec: any): ICrosshairTheme => {
  const axes: IPolarAxisCommonSpec[] = array(chartSpec.axes ?? []);
  const { bandField, linearField, categoryField, valueField } =
    getComponentThemeFromOption(ComponentTypeEnum.crosshair, chartTheme) ?? {};

  const angleAxis = axes.find(axis => axis.orient === 'angle');
  let newAngleField;
  if (isValid(angleAxis)) {
    newAngleField = mergeSpec({}, isDiscreteAxis(angleAxis.type) ? bandField : linearField, categoryField);
  } else {
    newAngleField = categoryField;
  }

  const radiusAxis = axes.find(axis => axis.orient === 'radius');
  let newRadiusField;
  if (isValid(radiusAxis)) {
    newRadiusField = mergeSpec({}, isDiscrete(radiusAxis.type) ? bandField : linearField, valueField);
  } else {
    newRadiusField = valueField;
  }

  return {
    categoryField: newAngleField,
    valueField: newRadiusField
  };
};

export const toFixedCrosshairLabelValue = (axis: IAxis, value: StringOrNumber) => {
  if (isContinuous(axis.getScale().type) && isValidNumber(+value)) {
    // 根据轴 domain 范围做动态判断，取最多 n + 2 位小数
    const domain = axis.getScale().domain();
    const domainSpan = Math.abs(domain[1] - domain[0]);
    const n = Math.max(-Math.log10(domainSpan), 0) + 2;
    const unit = Math.pow(10, n);
    return Math.round((+value as number) * unit) / unit;
  }
  return value;
};
