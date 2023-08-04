import type { IThemeColorScheme } from '../../color-scheme/interface';
import { dataScheme } from '../../color-scheme/builtin/default';

export const colorScheme: IThemeColorScheme = {
  default: {
    dataScheme,
    palette: {
      titleFontColor: '#e2e3e6',
      labelFontColor: '#888c93',
      labelReverseFontColor: '#202020',
      axisGridColor: '#404349',
      axisDomainColor: '#55595f',
      backgroundColor: '#202020'
    }
  }
};
