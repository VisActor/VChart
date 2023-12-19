import { get } from '@visactor/vutils';
import type { ITheme } from '../theme';

export function getComponentThemeFromOption(type: string, chartTheme: ITheme) {
  return get(chartTheme, `component.${type}`);
}
