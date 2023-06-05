export * from './config';
export * from './light';
export * from './dark';

import type { ITheme } from '../interface';
import { lightTheme } from './light';
import { darkTheme } from './dark';

/** 内置主题 map */
export const buildinThemeMap: Map<string, ITheme> = new Map([
  [lightTheme.name, lightTheme],
  [darkTheme.name, darkTheme]
]);

/** 默认主题 */
export const defaultThemeName = lightTheme.name;
