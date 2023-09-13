export * from './light';
/** 历史弃用主题 */
export * from './common/legacy';

import { mergeTheme } from '../../util/spec/merge-theme';
import type { ITheme } from '../interface';
import { darkTheme } from './dark';
import { lightTheme } from './light';

/** 内置主题 map (没有 merge 过默认主题的原始主题) */
export const builtinThemeMap: Map<string, ITheme> = new Map([
  [lightTheme.name, lightTheme],
  [darkTheme.name, darkTheme]
]);

/** 默认主题 */
export const defaultThemeName = lightTheme.name;

/** merge 过默认主题的最终主题字典 */
export const themes: Map<string, ITheme> = new Map([[defaultThemeName, builtinThemeMap.get(defaultThemeName)]]);

/** 使新主题基于默认主题扩展，保证基础值 */
export const getMergedTheme = (theme: Partial<ITheme>): ITheme =>
  mergeTheme({}, builtinThemeMap.get(defaultThemeName), theme);

// 注册其他内置主题
builtinThemeMap.forEach((theme, name) => {
  if (name !== defaultThemeName) {
    themes.set(name, getMergedTheme(theme));
  }
});
