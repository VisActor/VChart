import { merge } from '@visactor/vutils';
import { buildinThemeMap, defaultThemeName } from './buildin-theme';
import type { ITheme } from './interface';
import { VChart } from '../vchart-all';

export class ThemeManager {
  /** 主题字典 */
  static themes: Map<string, ITheme> = new Map();

  private static _currentThemeName: string = defaultThemeName; // 设置缺省为默认主题

  /**
   * 注册主题
   * @param name 主题名称
   * @param theme 主题配置
   * @returns
   */
  static registerTheme(name: string, theme: Partial<ITheme>) {
    if (!name) {
      return;
    }
    // 所有主题基于默认主题扩展，保证基础值
    ThemeManager.themes.set(name, merge({}, ThemeManager.getDefaultTheme(), theme));
  }

  /**
   * 获取主题
   * @param name 主题名称
   * @returns
   */
  static getTheme(name: string) {
    return ThemeManager.themes.get(name) || ThemeManager.getDefaultTheme();
  }

  /**
   * 移除主题
   * @param name 主题名称
   * @returns 是否移除成功
   */
  static removeTheme(name: string): boolean {
    return ThemeManager.themes.delete(name);
  }

  /**
   * 判断主题是否存在
   * @param name 主题名称
   * @returns 是否存在
   */
  static themeExist(name: string) {
    return ThemeManager.themes.has(name);
  }

  /** 获取图表默认主题（非用户配置） */
  static getDefaultTheme(): ITheme {
    return ThemeManager.themes.get(defaultThemeName);
  }

  /** 设置当前主题（所有实例生效） */
  static setCurrentTheme(name: string) {
    if (!ThemeManager.themeExist(name)) {
      return;
    }
    ThemeManager._currentThemeName = name;
    Object.values(VChart.instances).forEach((instance: VChart) => instance?.setCurrentTheme(name));
  }

  /** 获取当前主题（只能获取用户通过`setCurrentTheme`方法设置过的主题，默认值为默认主题） */
  static getCurrentTheme(): ITheme {
    return ThemeManager.getTheme(ThemeManager._currentThemeName);
  }

  /** 获取当前主题名称（只能获取用户通过`setCurrentTheme`方法设置过的主题，默认值为默认主题） */
  static getCurrentThemeName(): string {
    return ThemeManager._currentThemeName;
  }
}

// 先注册默认主题
ThemeManager.registerTheme(defaultThemeName, buildinThemeMap.get(defaultThemeName));
// 再注册其他内置主题
buildinThemeMap.forEach((theme, name) => {
  if (name !== defaultThemeName) {
    ThemeManager.registerTheme(name, theme);
  }
});
