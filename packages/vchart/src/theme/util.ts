import { isString, get, isObject, isNil } from '@visactor/vutils';
import type { ITheme } from './interface';
import { ThemeManager } from './theme-manager';
import { mergeSpec } from '../util/spec/merge-spec';
import { transformColorSchemeToMerge, transformSeriesThemeToMerge } from '../util/spec/merge-theme';
import { getActualColor } from './color-scheme/util';
import type { IThemeColorScheme } from './color-scheme/interface';
import type { IModelOption } from '../model/interface';
import { defaultChartLevelTheme, defaultThemeName } from './builtin';

/**
 * 性能优化过的主题合并，只合并需要取用的主题部分
 * @param path 需要取用的路径
 * @param currentThemeName （低优先级）当前全局主题 name
 * @param optionTheme （中优先级）option 中设置的主题
 * @param specTheme （高优先级）spec 中设置的主题
 * @returns
 */
export const mergeThemeAndGet = (
  path: string,
  currentThemeName?: string,
  optionTheme?: string | ITheme,
  specTheme?: string | ITheme,
  colorScheme?: IThemeColorScheme
) => {
  if (isString(specTheme) && ThemeManager.themeExist(specTheme)) {
    // 以 specTheme 为最底开始合并
    return getMergedValue(getThemeValue(path, specTheme, colorScheme));
  } else if (isString(optionTheme) && ThemeManager.themeExist(optionTheme)) {
    // 以 optionTheme 为最底开始合并
    return getMergedValue(getThemeValue(path, optionTheme, colorScheme), getThemeValue(path, specTheme, colorScheme));
  }
  // 以 baseTheme 为最底开始合并
  return getMergedValue(
    getThemeValue(path, currentThemeName, colorScheme),
    getThemeValue(path, optionTheme, colorScheme),
    getThemeValue(path, specTheme, colorScheme)
  );
};

/** 从 theme 取特定 path 的值，但可能会改变形式为 merge 作准备 */
const getThemeValue = (path: string, theme?: string | ITheme, colorScheme?: IThemeColorScheme) => {
  if (isNil(theme)) {
    return undefined;
  }

  let themeObject: ITheme;
  if (isString(theme) && ThemeManager.themeExist(theme)) {
    themeObject = ThemeManager.getTheme(theme);
  } else if (isObject(theme)) {
    themeObject = theme;
  }
  if (isNil(themeObject)) {
    return undefined;
  }

  const paths = path.split('.');

  const colorSchemePath: keyof ITheme = 'colorScheme';
  if (path === colorSchemePath) {
    return transformColorSchemeToMerge(themeObject.colorScheme);
  }
  const backgroundPath: keyof ITheme = 'background';
  if (path === backgroundPath) {
    return getActualColor(themeObject.background, colorScheme);
  }
  const seriesPath: keyof ITheme = 'series';
  if (paths.length === 2 && paths[0] === seriesPath) {
    const { markByName, mark } = themeObject;
    return transformSeriesThemeToMerge(get(themeObject, paths), paths[1], mark, markByName);
  }

  return get(themeObject, paths);
};

const getMergedValue = (...sources: any[]) => {
  const tmpKey = '__TMP_KEY__';
  const obj = mergeSpec(
    {},
    ...sources.map(source => ({
      [tmpKey]: source
    }))
  );
  return obj[tmpKey];
};

export const getThemeFromOption = (path: string, option: Partial<IModelOption>) => {
  const {
    globalTheme = defaultThemeName,
    optionTheme,
    specTheme,
    chartLevelTheme = defaultChartLevelTheme
  } = option.getThemeConfig?.() ?? {};
  return mergeThemeAndGet(path, globalTheme, optionTheme, specTheme, chartLevelTheme?.colorScheme);
};
