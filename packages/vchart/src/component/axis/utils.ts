import type { ITheme } from './../../theme/interface';
import { merge, get } from '@visactor/vutils';
import type { IOrientType, IPolarOrientType } from '../../typings';
import type { AxisType, ICommonAxisSpec, ILinearAxisSpec } from './interface';
import { transformComponentStyle } from '../../util/style';
import { isXAxis } from './cartesian/util';

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
  transformComponentStyle(lineCfg);
  transformComponentStyle(lineCfg.startSymbol);
  transformComponentStyle(lineCfg.endSymbol);

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

export const getCartesianAxisTheme = (orient: IOrientType, type: AxisType, theme: ITheme) => {
  const { axisBand, axisLinear, axisX, axisY, axis } = theme.component ?? {};
  const axisTypeTheme = (type === 'band' ? axisBand : type === 'linear' ? axisLinear : {}) ?? {};
  const axisTheme = isXAxis(orient) ? axisX : axisY;
  return merge({}, axis, axisTypeTheme, axisTheme);
};

export const getPolarAxisTheme = (orient: IPolarOrientType, type: AxisType, theme: ITheme) => {
  const { axisBand, axisLinear, axisAngle, axisRadius, axis } = theme.component ?? {};
  const axisTypeTheme = (type === 'band' ? axisBand : type === 'linear' ? axisLinear : {}) ?? {};
  const axisTheme = orient === 'angle' ? axisAngle : axisRadius;
  return merge({}, axis, axisTypeTheme, axisTheme);
};
