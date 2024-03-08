import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { array } from '@visactor/vutils';
import type { IGlobalMarkThemeByName, IGlobalMarkThemeByType, ITheme } from '../../theme';
import { transformColorSchemeToStandardStruct } from '../../theme/color-scheme/util';
import type { IThemeColorScheme } from '../../theme/color-scheme/interface';
import type { ISeriesTheme } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import type { ISeriesMarkInfo } from '../../series/interface/common';
import { seriesMarkInfoMap } from '../../series/interface/theme';
import { mergeSpec } from '../spec/merge-spec';

export function mergeTheme(target: Maybe<ITheme>, ...sources: Maybe<ITheme>[]): Maybe<ITheme> {
  return mergeSpec(transformThemeToMerge(target), ...sources.map(transformThemeToMerge));
}

function transformThemeToMerge(theme?: Maybe<ITheme>): Maybe<ITheme> {
  if (!theme) {
    return theme;
  }

  // 将色板转化为标准形式
  const colorScheme = transformColorSchemeToMerge(theme.colorScheme);

  // 将全局 mark 主题 merge 进系列主题
  const { series } = theme;
  const { mark: markByType, markByName } = theme;
  let newSeriesTheme;
  if (markByType || markByName) {
    newSeriesTheme = Object.keys(seriesMarkInfoMap).reduce((newSeriesTheme, key) => {
      const value = series?.[key] ?? {};
      newSeriesTheme[key] = transformSeriesThemeToMerge(value, key, markByType, markByName);
      return newSeriesTheme;
    }, {} as ISeriesTheme);
  }

  return Object.assign({}, theme, {
    colorScheme,
    token: theme.token ?? {},
    series: Object.assign({}, theme.series, newSeriesTheme)
  } as Partial<ITheme>);
}

/** 将色板转化为标准形式 */
export function transformColorSchemeToMerge(colorScheme?: Maybe<IThemeColorScheme>): Maybe<IThemeColorScheme> {
  if (colorScheme) {
    colorScheme = Object.keys(colorScheme).reduce<IThemeColorScheme>((scheme, key) => {
      const value = colorScheme[key];
      scheme[key] = transformColorSchemeToStandardStruct(value);
      return scheme;
    }, {} as IThemeColorScheme);
  }
  return colorScheme;
}

/** 将全局 mark 主题 merge 进系列主题 */
export function transformSeriesThemeToMerge(
  seriesTheme: any,
  seriesType: string,
  markByType: IGlobalMarkThemeByType,
  markByName: IGlobalMarkThemeByName
): any {
  if (!seriesMarkInfoMap[seriesType]) {
    return seriesTheme;
  }
  const newTheme: any = {};
  Object.values<ISeriesMarkInfo>(seriesMarkInfoMap[seriesType]).forEach(({ type, name }) => {
    newTheme[name] = mergeSpec({}, markByType?.[array(type)[0]], markByName?.[name], seriesTheme?.[name]);
  });
  return {
    ...seriesTheme,
    ...newTheme
  };
}
