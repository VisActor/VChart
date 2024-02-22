import type { ITheme } from '../../theme';
import { getOrient } from '../axis/cartesian/util/common';
import { getCartesianAxisTheme, getPolarAxisTheme } from '../axis/util';
import { getCartesianCrosshairTheme, getPolarCrosshairTheme } from '../crosshair/utils';
import { getDataFilterTheme } from '../data-zoom/util';
import { ComponentTypeEnum } from '../interface/type';
import { getLayout } from '../legend/util';
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
      return getComponentThemeFromOption(`${type}.${getLayout(componentSpec)}`, chartTheme);
    case ComponentTypeEnum.dataZoom:
    case ComponentTypeEnum.scrollBar:
      return getDataFilterTheme(getOrient(componentSpec), type, chartTheme);
    default:
      return getComponentThemeFromOption(type, chartTheme);
  }
}
