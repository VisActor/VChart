import type { ITheme } from '../../theme';
import { Direction, type IOrientType } from '../../typings';
import { mergeSpec } from '../../util';
import { getDirectionByOrient, getOrient } from '../axis/cartesian/util/common';
import { getCartesianAxisTheme, getPolarAxisTheme } from '../axis/util';
import { getCartesianCrosshairTheme, getPolarCrosshairTheme } from '../crosshair/utils';
import type { ComponentThemeWithDirection } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import { getComponentThemeFromOption } from '../util';

export function getComponentThemeFromGlobalTheme(
  type: ComponentTypeEnum,
  chartTheme: ITheme,
  componentSpec: any,
  chartSpec: any
) {
  switch (type) {
    case ComponentTypeEnum.cartesianBandAxis:
      return getCartesianAxisTheme(getOrient(componentSpec, ['z']), 'band', chartTheme);
    case ComponentTypeEnum.cartesianLinearAxis:
      return getCartesianAxisTheme(getOrient(componentSpec, ['z']), 'linear', chartTheme);
    case ComponentTypeEnum.cartesianLogAxis:
      return getCartesianAxisTheme(getOrient(componentSpec, ['z']), 'log', chartTheme);
    case ComponentTypeEnum.cartesianSymlogAxis:
      return getCartesianAxisTheme(getOrient(componentSpec, ['z']), 'symlog', chartTheme);
    case ComponentTypeEnum.cartesianAxis:
    case ComponentTypeEnum.cartesianTimeAxis:
      return getCartesianAxisTheme(getOrient(componentSpec), undefined, chartTheme);
    case ComponentTypeEnum.polarBandAxis:
      return getPolarAxisTheme(componentSpec.orient, 'band', chartTheme);
    case ComponentTypeEnum.polarLinearAxis:
      return getPolarAxisTheme(componentSpec.orient, 'linear', chartTheme);
    case ComponentTypeEnum.polarAxis:
      return getPolarAxisTheme(componentSpec.orient, undefined, chartTheme);
    case ComponentTypeEnum.cartesianCrosshair:
      return getCartesianCrosshairTheme(chartTheme, chartSpec);
    case ComponentTypeEnum.polarCrosshair:
      return getPolarCrosshairTheme(chartTheme, chartSpec);
    case ComponentTypeEnum.colorLegend:
    case ComponentTypeEnum.sizeLegend:
    case ComponentTypeEnum.discreteLegend:
    case ComponentTypeEnum.dataZoom:
    case ComponentTypeEnum.scrollBar:
      return getComponentThemeWithDirection(getOrient(componentSpec), getComponentThemeFromOption(type, chartTheme));
    default:
      return getComponentThemeFromOption(type, chartTheme);
  }
}

export const getComponentThemeWithDirection = <T>(
  orient: IOrientType,
  originalTheme: ComponentThemeWithDirection<T>
): T => {
  const directionTheme = originalTheme[getDirectionByOrient(orient)];
  const finalTheme = mergeSpec({}, originalTheme, directionTheme);

  delete finalTheme[Direction.horizontal];
  delete finalTheme[Direction.vertical];
  return finalTheme;
};
