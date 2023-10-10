import type { IChart } from '../../chart/interface';
import type { ITheme } from '../../theme';
import { ComponentTypeEnum } from '../interface';
export declare function getComponentThemeFromGlobalTheme(
  type: ComponentTypeEnum,
  theme: ITheme,
  componentSpec: any,
  chart: IChart
): any;
