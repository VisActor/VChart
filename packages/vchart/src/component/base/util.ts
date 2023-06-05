import type { ITheme } from '../../theme';
import { getCartesianAxisConfig, getOrient } from '../axis/cartesian/util';
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
      return getCartesianAxisConfig(direction, getOrient(componentSpec), theme.cartesianAxis);
    case ComponentTypeEnum.polarAxis:
    case ComponentTypeEnum.polarBandAxis:
    case ComponentTypeEnum.polarLinearAxis:
      return theme.polarAxis?.common;
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
