export * from './light';
/** 历史弃用主题 */
export * from './common/legacy';

import { mergeTheme } from '../../util/spec/merge-theme';
import type { ITheme } from '../interface';
import { darkTheme } from './dark';
import { lightTheme } from './light';

/** 声明内置主题 */
export const builtinThemes: [string, ITheme][] = [
  [lightTheme.name, lightTheme],
  [darkTheme.name, darkTheme]
];
/** 声明默认主题 */
export const defaultThemeName = lightTheme.name;

/** 全局主题 map (包含用户新注册的主题，没有 merge 过默认主题的原始主题) */
export const themes: Map<string, ITheme> = new Map(builtinThemes);

/** 使新主题基于默认主题扩展，保证基础值 */
export const getMergedTheme = (theme: Partial<ITheme>): ITheme => mergeTheme({}, themes.get(defaultThemeName), theme);
