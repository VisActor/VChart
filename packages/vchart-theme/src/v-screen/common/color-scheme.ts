import { IThemeColorScheme } from '@visactor/vchart-types/theme/color-scheme/interface';
import { palette } from './palette';

export const getColorScheme = (dataScheme: string[]): IThemeColorScheme => ({
  default: {
    dataScheme,
    palette
  }
});
