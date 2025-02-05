import { get } from '@visactor/vutils';
import { mergeSpec } from '@visactor/vutils-extension';
import type { IOrientType, IPolarOrientType } from '../../typings';
import type { AxisType, ICommonAxisSpec, ILinearAxisSpec } from './interface';
import { transformComponentStyle } from '../../util/style';
import { isXAxis, isYAxis } from './cartesian/util/common';
import { getComponentThemeFromOption } from '../util';
import type { IAxisHelper } from './cartesian';
import type { IPolarAxisHelper } from './polar';

export const DEFAULT_TITLE_STYLE = {
  left: {
    textAlign: 'center',
    textBaseline: 'bottom'
  },
  right: {
    textAlign: 'center',
    textBaseline: 'bottom'
  },
  radius: {},
  angle: {}
};

export function transformAxisLineStyle(lineCfg: any) {
  lineCfg = transformComponentStyle(lineCfg);
  lineCfg.startSymbol = transformComponentStyle(lineCfg.startSymbol);
  lineCfg.endSymbol = transformComponentStyle(lineCfg.endSymbol);

  return lineCfg;
}

export function getAxisLabelOffset(axisSpec: ICommonAxisSpec) {
  let labelOffset = 0;
  if (get(axisSpec, 'tick.visible')) {
    labelOffset += get(axisSpec, 'tick.tickSize');
  }

  if (get(axisSpec, 'label.visible')) {
    labelOffset += get(axisSpec, 'label.space');
  }

  return labelOffset;
}

export function getLinearAxisSpecDomain(
  axisSpec: ILinearAxisSpec,
  defaultDomain?: {
    min?: number;
    max?: number;
  }
) {
  // 兼容策略
  return {
    min: axisSpec.min ?? axisSpec.range?.min ?? defaultDomain?.min,
    max: axisSpec.max ?? axisSpec.range?.max ?? defaultDomain?.max
  };
}

export function isValidCartesianAxis(spec: any) {
  const orient = spec?.orient;
  return orient === 'top' || orient === 'bottom' || orient === 'left' || orient === 'right' || orient === 'z';
}

export function isValidPolarAxis(spec: any) {
  const orient = spec?.orient;
  return orient === 'angle' || orient === 'radius';
}

export const getCartesianAxisTheme = (orient: IOrientType, type: AxisType, getTheme: (...keys: string[]) => any) => {
  const axisTypeTheme =
    (type === 'band'
      ? getComponentThemeFromOption('axisBand', getTheme)
      : (['linear', 'log', 'symlog'] as AxisType[]).includes(type)
      ? getComponentThemeFromOption('axisLinear', getTheme)
      : {}) ?? {};
  const axisTheme = isXAxis(orient)
    ? getComponentThemeFromOption('axisX', getTheme)
    : isYAxis(orient)
    ? getComponentThemeFromOption('axisY', getTheme)
    : getComponentThemeFromOption('axisZ', getTheme);
  return mergeSpec({}, getComponentThemeFromOption('axis', getTheme), axisTypeTheme, axisTheme);
};

export const getPolarAxisTheme = (orient: IPolarOrientType, type: AxisType, getTheme: (...keys: string[]) => any) => {
  const axisTypeTheme =
    (type === 'band'
      ? getComponentThemeFromOption('axisBand', getTheme)
      : type === 'linear'
      ? getComponentThemeFromOption('axisLinear', getTheme)
      : {}) ?? {};
  const axisTheme =
    orient === 'angle'
      ? getComponentThemeFromOption('axisAngle', getTheme)
      : getComponentThemeFromOption('axisRadius', getTheme);
  return mergeSpec({}, getComponentThemeFromOption('axis', getTheme), axisTypeTheme, axisTheme);
};

export const isDiscreteAxis = (axisType: AxisType) =>
  axisType === 'band' || axisType === 'ordinal' || axisType === 'point';

export function getAxisItem(value: any, normalizedValue: number) {
  return {
    id: value,
    label: value,
    value: normalizedValue,
    rawValue: value
  };
}

// 更新的条件: 指定绑定关系 或 初次绑定 或 更新前后id一致(防止声明多个轴时, 后面的轴覆盖前面的轴)
export function shouldUpdateAxis(
  preHelper: IAxisHelper | IPolarAxisHelper,
  curHelper: IAxisHelper | IPolarAxisHelper,
  forceUpdate: boolean
) {
  return forceUpdate || !preHelper || preHelper.getAxisId() === curHelper.getAxisId();
}
