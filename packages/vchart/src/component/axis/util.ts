import { get } from '@visactor/vutils';
import { mergeSpec } from '../../util/spec/merge-spec';
import type { IOrientType, IPolarOrientType } from '../../typings';
import type { AxisType, ICommonAxisSpec, ILinearAxisSpec } from './interface';
import { transformComponentStyle } from '../../util/style';
import { isXAxis, isYAxis } from './cartesian/util/common';
import { getComponentThemeFromOption } from '../util';
import type { ITheme } from '../../theme';

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

export const getCartesianAxisTheme = (orient: IOrientType, type: AxisType, chartTheme: ITheme) => {
  const axisTypeTheme =
    (type === 'band'
      ? getComponentThemeFromOption('axisBand', chartTheme)
      : (['linear', 'log', 'symlog'] as AxisType[]).includes(type)
      ? getComponentThemeFromOption('axisLinear', chartTheme)
      : {}) ?? {};
  const axisTheme = isXAxis(orient)
    ? getComponentThemeFromOption('axisX', chartTheme)
    : isYAxis(orient)
    ? getComponentThemeFromOption('axisY', chartTheme)
    : getComponentThemeFromOption('axisZ', chartTheme);
  return mergeSpec({}, getComponentThemeFromOption('axis', chartTheme), axisTypeTheme, axisTheme);
};

export const getPolarAxisTheme = (orient: IPolarOrientType, type: AxisType, chartTheme: ITheme) => {
  const axisTypeTheme =
    (type === 'band'
      ? getComponentThemeFromOption('axisBand', chartTheme)
      : type === 'linear'
      ? getComponentThemeFromOption('axisLinear', chartTheme)
      : {}) ?? {};
  const axisTheme =
    orient === 'angle'
      ? getComponentThemeFromOption('axisAngle', chartTheme)
      : getComponentThemeFromOption('axisRadius', chartTheme);
  return mergeSpec({}, getComponentThemeFromOption('axis', chartTheme), axisTypeTheme, axisTheme);
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
