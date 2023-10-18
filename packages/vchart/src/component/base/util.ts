import type { IModelOption } from '../../model/interface';
import { getThemeFromOption } from '../../theme/util';
import { getOrient } from '../axis/cartesian/util';
import { getCartesianAxisTheme, getPolarAxisTheme } from '../axis/util';
import { getCartesianCrosshairTheme, getPolarCrosshairTheme } from '../crosshair/util';
import { ComponentTypeEnum } from '../interface';
import { getLayout } from '../legend/util';
import { getComponentThemeFromOption } from '../util';

export function getComponentThemeFromGlobalTheme(
  type: ComponentTypeEnum,
  option: Partial<IModelOption>,
  componentSpec: any
) {
  const chart = option.getChart?.();
  switch (type) {
    case ComponentTypeEnum.cartesianBandAxis:
      return getCartesianAxisTheme(getOrient(componentSpec), 'band', option);
    case ComponentTypeEnum.cartesianLinearAxis:
      return getCartesianAxisTheme(getOrient(componentSpec), 'linear', option);
    case ComponentTypeEnum.cartesianLogAxis:
      return getCartesianAxisTheme(getOrient(componentSpec), 'log', option);
    case ComponentTypeEnum.cartesianSymlogAxis:
      return getCartesianAxisTheme(getOrient(componentSpec), 'symlog', option);
    case ComponentTypeEnum.cartesianAxis:
    case ComponentTypeEnum.cartesianTimeAxis:
      return getCartesianAxisTheme(getOrient(componentSpec), undefined, option);
    case ComponentTypeEnum.polarBandAxis:
      return getPolarAxisTheme(componentSpec.orient, 'band', option);
    case ComponentTypeEnum.polarLinearAxis:
      return getPolarAxisTheme(componentSpec.orient, 'linear', option);
    case ComponentTypeEnum.polarAxis:
      return getPolarAxisTheme(componentSpec.orient, undefined, option);
    case ComponentTypeEnum.cartesianCrosshair:
      return getCartesianCrosshairTheme(option, chart);
    case ComponentTypeEnum.polarCrosshair:
      return getPolarCrosshairTheme(option, chart);
    case ComponentTypeEnum.colorLegend:
    case ComponentTypeEnum.sizeLegend:
      return getThemeFromOption(`component.${type}.${getLayout(componentSpec)}`, option);
    default:
      return getComponentThemeFromOption(type, option);
  }
}
