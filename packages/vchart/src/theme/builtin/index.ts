export * from './light';
/** 历史弃用主题 */
export * from './common/legacy';

import { isString } from '@visactor/vutils';
import type { IChartLevelTheme } from '../../core/interface';
import { mergeTheme } from '../../util/spec/merge-theme';
import { getActualColor } from '../color-scheme/util';
import type { ITheme } from '../interface';
import { darkTheme } from './dark';
import { lightTheme } from './light';

/** 声明内置主题 */
export const builtinThemes: Record<string, ITheme> = {
  [lightTheme.name]: lightTheme,
  [darkTheme.name]: darkTheme
};

/** 获取默认主题 */
export const getDefaultThemeName = (type?: ITheme['type']) => (type === 'dark' ? darkTheme.name : lightTheme.name);
export const defaultThemeName = getDefaultThemeName();

/** 全局主题 map (包含用户新注册的主题) */
export const themes: Map<string, ITheme> = new Map(Object.keys(builtinThemes).map(key => [key, builtinThemes[key]]));
/** 主题 map 中的元素是否 merge 过默认主题 (非默认主题的其他内置主题没有 merge 过默认主题) */
export const hasThemeMerged: Map<string, boolean> = new Map(
  Object.keys(builtinThemes).map(key => [key, key === defaultThemeName])
);

/** 注册主题 */
export const registerTheme = (name: string, theme: Partial<ITheme>) => {
  if (!name) {
    return;
  }
  // 所有主题基于默认主题扩展，保证基础值
  themes.set(name, getMergedTheme(theme));
  hasThemeMerged.set(name, true);
};

/** 获取注册过的主题 */
export const getTheme = (name: string) => {
  if (hasThemeMerged.has(name) && !hasThemeMerged.get(name)) {
    // 重新 merge 默认主题
    registerTheme(name, themes.get(name));
  }
  return themes.get(name) || themes.get(defaultThemeName);
};

/** 删除主题 */
export const removeTheme = (name: string): boolean => {
  return themes.delete(name) && hasThemeMerged.delete(name);
};

/** 主题是否存在 */
export const themeExist = (name: any) => {
  if (!isString(name)) {
    return false;
  }
  return themes.has(name);
};

/** 使新主题基于默认主题扩展，保证基础值 */
export const getMergedTheme = (theme: Partial<ITheme>): ITheme => {
  const baseThemeName = getDefaultThemeName(theme.type);
  const baseTheme = getTheme(baseThemeName);
  return mergeTheme({}, baseTheme, theme);
};

export const defaultChartLevelTheme: IChartLevelTheme = {
  background: getActualColor(builtinThemes[defaultThemeName].background, builtinThemes[defaultThemeName].colorScheme),
  fontFamily: builtinThemes[defaultThemeName].fontFamily,
  colorScheme: builtinThemes[defaultThemeName].colorScheme
};
