export * from './config';
export * from './light';

import type { ITheme } from '../interface';
import { lightTheme } from './light';

/** 内置主题 map */
export const buildinThemeMap: Map<string, ITheme> = new Map([
  [lightTheme.name, lightTheme]
  // [darkTheme.name, darkTheme] // TODO: wip
]);

/** 默认主题 */
export const defaultThemeName = lightTheme.name;
