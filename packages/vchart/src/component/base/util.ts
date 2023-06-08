import type { ITheme } from '../../theme';
import { getOrient } from '../axis/cartesian/util';
import { getCartesianAxisTheme, getPolarAxisTheme } from '../axis/utils';
import { ComponentTypeEnum } from '../interface';
import { getLayout } from '../legend/util';

export function getComponentThemeFromGlobalTheme(
  type: ComponentTypeEnum,
  theme: ITheme,
  componentSpec: any,
  direction: string | undefined
) {
  switch (type) {
    case ComponentTypeEnum.cartesianAxis:
    case ComponentTypeEnum.cartesianBandAxis:
    case ComponentTypeEnum.cartesianLinearAxis:
    case ComponentTypeEnum.cartesianTimeAxis:
      return getCartesianAxisTheme(direction, getOrient(componentSpec), theme);
    case ComponentTypeEnum.polarAxis:
    case ComponentTypeEnum.polarBandAxis:
    case ComponentTypeEnum.polarLinearAxis:
      return getPolarAxisTheme(componentSpec.orient, theme);
    case ComponentTypeEnum.cartesianCrosshair:
    case ComponentTypeEnum.polarCrosshair:
      return theme.crosshair;
    case ComponentTypeEnum.colorLegend:
      return theme.colorLegend[getLayout(componentSpec)];
    case ComponentTypeEnum.sizeLegend:
      return theme.sizeLegend[getLayout(componentSpec)];
    default:
      return theme[type];
  }
}
