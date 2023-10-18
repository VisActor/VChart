import { get } from '@visactor/vutils';
import { mergeSpec } from '../../util';
import type { IOrientType, IPolarOrientType } from '../../typings';
import type { AxisType, ICommonAxisSpec, ILinearAxisSpec } from './interface';
import { transformComponentStyle } from '../../util/style';
import { isXAxis } from './cartesian/util';
import type { IModelOption } from '../../model/interface';
import { getComponentThemeFromOption } from '../util';

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

export const getCartesianAxisTheme = (orient: IOrientType, type: AxisType, option: Partial<IModelOption>) => {
  const axisTypeTheme =
    (type === 'band'
      ? getComponentThemeFromOption('axisBand', option)
      : (['linear', 'log', 'symlog'] as AxisType[]).includes(type)
      ? getComponentThemeFromOption('axisLinear', option)
      : {}) ?? {};
  const axisTheme = isXAxis(orient)
    ? getComponentThemeFromOption('axisX', option)
    : getComponentThemeFromOption('axisY', option);
  return mergeSpec({}, getComponentThemeFromOption('axis', option), axisTypeTheme, axisTheme);
};

export const getPolarAxisTheme = (orient: IPolarOrientType, type: AxisType, option: Partial<IModelOption>) => {
  const axisTypeTheme =
    (type === 'band'
      ? getComponentThemeFromOption('axisBand', option)
      : type === 'linear'
      ? getComponentThemeFromOption('axisLinear', option)
      : {}) ?? {};
  const axisTheme =
    orient === 'angle'
      ? getComponentThemeFromOption('axisAngle', option)
      : getComponentThemeFromOption('axisRadius', option);
  return mergeSpec({}, getComponentThemeFromOption('axis', option), axisTypeTheme, axisTheme);
};
