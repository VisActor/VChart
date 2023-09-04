export * from './light';

import type { ITheme } from '../interface';
import { darkTheme } from './dark';
import { lightTheme } from './light';

/** 内置主题 map */
export const builtinThemeMap: Map<string, ITheme> = new Map([
  [lightTheme.name, lightTheme],
  [darkTheme.name, darkTheme]
]);

/** 默认主题 */
export const defaultThemeName = lightTheme.name;

/** 历史弃用主题 */
export * from './common/legacy';
