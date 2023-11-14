import { IThemeColorScheme } from '@visactor/vchart-types';
import { palette } from './palette';

export const getColorScheme = (dataScheme: string[]): IThemeColorScheme => ({
  default: {
    dataScheme,
    palette
  }
});
