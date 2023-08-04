import type { IThemeColorScheme } from '../../color-scheme/interface';
import { dataScheme } from '../../color-scheme/builtin/default';

export const colorScheme: IThemeColorScheme = {
  default: {
    dataScheme,
    palette: {
      titleFontColor: '#21252c',
      labelFontColor: '#89909D',
      labelReverseFontColor: '#ffffff',
      axisGridColor: '#f1f2f5',
      axisDomainColor: '#D9DDE4',
      backgroundColor: '#ffffff'
    }
  }
};
