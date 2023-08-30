import { type Maybe, array } from '@visactor/vutils';
import type { ITheme } from '../../theme';
import { transformColorSchemeToStandardStruct } from '../../theme/color-scheme/util';
import type { IThemeColorScheme } from '../../theme/color-scheme/interface';
import type { ISeriesTheme } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import { seriesMarkInfoMap, type ISeriesMarkInfo } from '../../series/interface';
import { mergeSpec } from './merge-spec';

export function mergeTheme(target: Maybe<ITheme>, ...sources: Maybe<ITheme>[]): Maybe<ITheme> {
  return mergeSpec(transformThemeToMerge(target), ...sources.map(transformThemeToMerge));
}

function transformThemeToMerge(theme?: Maybe<ITheme>): Maybe<ITheme> {
  if (!theme) {
    return theme;
  }

  // 将色板转化为标准形式
  let { colorScheme } = theme;
  if (colorScheme) {
    colorScheme = Object.keys(colorScheme).reduce<IThemeColorScheme>((scheme, key) => {
      const value = colorScheme[key];
      scheme[key] = transformColorSchemeToStandardStruct(value);
      return scheme;
    }, {} as IThemeColorScheme);
  }

  // 将全局 mark 主题 merge 进系列主题
  let { series } = theme;
  const { mark: markByType, markByName } = theme;
  if (markByType || markByName) {
    series = Object.keys(seriesMarkInfoMap).reduce((newSeriesTheme, key) => {
      const value = series?.[key] ?? {};
      const newValue = {};
      Object.values<ISeriesMarkInfo>(seriesMarkInfoMap[key]).forEach(({ type, name }) => {
        newValue[name] = mergeSpec({}, markByType?.[array(type)[0]] ?? {}, markByName?.[name] ?? {}, value[name]);
      });
      newSeriesTheme[key] = {
        ...value,
        ...newValue
      };
      return newSeriesTheme;
    }, {} as ISeriesTheme);
  }

  return {
    ...theme,
    colorScheme,
    series
  };
}
