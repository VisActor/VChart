import type { IThemeColorScheme } from '../../color-scheme/interface';
import { dataScheme } from '../../color-scheme/builtin/default';

export const colorScheme: IThemeColorScheme = {
  default: {
    dataScheme,
    palette: {
      primaryFontColor: '#fdfdfd',
      secondaryFontColor: '#888c93',
      disableFontColor: '#55595f',
      labelFontColor: '#bbbdc3',
      labelReverseFontColor: '#202226',
      axisGridColor: '#404349',
      axisDomainColor: '#4b4f54',
      axisLabelFontColor: '#bbbdc3',
      backgroundColor: '#202226',
      borderColor: '#404349'
    }
  }
};
