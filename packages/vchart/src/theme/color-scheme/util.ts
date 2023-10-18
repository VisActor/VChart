import { array, isArray, isFunction, isObject, isString, isValid } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { ColorUtil } from '@visactor/vutils';
import type { SeriesTypeEnum } from '../../series/interface';
import { Color } from '../../util/color';
import type {
  ColorScheme,
  ColorSchemeItem,
  IColorKey,
  IColorSchemeStruct,
  IProgressiveDataSchemeCase,
  IThemeColorScheme,
  ProgressiveDataScheme
} from './interface';

/**
 * 从色板中获取数据色板（在此步骤中替换语义色值）
 * @param colorScheme
 * @param seriesType
 * @returns
 */
export function getDataScheme(
  colorScheme: IThemeColorScheme,
  seriesType?: SeriesTypeEnum
): Array<ColorSchemeItem> | ProgressiveDataScheme<ColorSchemeItem> {
  const scheme = !isValid(seriesType) ? colorScheme?.default : colorScheme?.[seriesType] ?? colorScheme?.default;
  if (!scheme || isArray(scheme)) {
    // 不带语义色板，直接输出
    return scheme as Array<ColorSchemeItem> | ProgressiveDataScheme<ColorSchemeItem>;
  } else if (isObject(scheme)) {
    // 带语义色板，转换颜色后输出
    const { dataScheme } = scheme as IColorSchemeStruct;
    if (!dataScheme) {
      return [];
    }
    // 渐进式色板的情况
    if (isProgressiveDataColorScheme(dataScheme)) {
      return dataScheme.map(item => ({
        ...item,
        scheme: item.scheme
          .map(color => {
            if (isColorKey(color)) {
              return queryColorFromColorScheme(colorScheme, color, seriesType);
            }
            return color;
          })
          .filter(isValid)
      }));
    }
    // 普通色板的情况
    return dataScheme
      .map(color => {
        if (isColorKey(color)) {
          return queryColorFromColorScheme(colorScheme, color, seriesType);
        }
        return color;
      })
      .filter(isValid);
  }
  return [];
}

/**
 * 计算最终数据色板（在此步骤中获得渐进式色板的最终色板）
 * @param colorScheme
 * @param seriesType
 * @returns
 */
export function computeActualDataScheme(
  dataScheme: Array<ColorSchemeItem> | ProgressiveDataScheme<ColorSchemeItem>,
  colorDomain: any[]
): Array<ColorSchemeItem> {
  if (isProgressiveDataColorScheme(dataScheme)) {
    return (
      dataScheme.find(item => {
        if (isValid(item.isAvailable)) {
          if (isFunction(item.isAvailable)) {
            return item.isAvailable(colorDomain);
          }
          return !!item.isAvailable;
        } else if (isValid(item.maxDomainLength)) {
          return colorDomain?.length <= item.maxDomainLength;
        }
        return true;
      })?.scheme ?? dataScheme[dataScheme.length - 1].scheme
    );
  }
  return dataScheme;
}

/**
 * 根据色板和色值索引生成颜色
 * @param colorScheme
 * @param colorKey
 * @param seriesType
 * @returns
 */
export function queryColorFromColorScheme(
  colorScheme: IThemeColorScheme,
  colorKey: IColorKey,
  seriesType?: SeriesTypeEnum
): ColorSchemeItem | undefined {
  const scheme = !isValid(seriesType) ? colorScheme.default : colorScheme[seriesType] ?? colorScheme.default;
  if (!scheme) {
    return undefined;
  }
  let color;
  const { palette } = scheme as IColorSchemeStruct;
  if (isObject(palette)) {
    color = palette[colorKey.key] ?? colorKey.default;
  }
  if (!color) {
    return undefined;
  }
  if ((!isValid(colorKey.a) && !isValid(colorKey.l)) || !isString(color)) {
    return color;
  }
  let c = new Color(color);
  if (isValid(colorKey.l)) {
    const { r, g, b } = c.color;
    const { h, s } = ColorUtil.rgbToHsl(r, g, b);
    const rgb = ColorUtil.hslToRgb(h, s, colorKey.l);
    const newColor = new Color(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    newColor.setOpacity(c.color.opacity);
    c = newColor;
  }
  if (isValid(colorKey.a)) {
    c.setOpacity(colorKey.a);
  }
  return c.toRGBA();
}

/** 查询语义化颜色 */
export const getActualColor = (value: any, colorScheme?: IThemeColorScheme, seriesType?: SeriesTypeEnum) => {
  if (isColorKey(value)) {
    if (colorScheme) {
      const color = queryColorFromColorScheme(colorScheme, value, seriesType);
      if (color) {
        return color;
      }
    }
  }
  return value;
};

export function isColorKey(obj: any): obj is IColorKey {
  return isObject(obj) && (obj as IColorKey).type === 'palette' && !!(obj as IColorKey).key;
}

export function isProgressiveDataColorScheme<T>(obj: any): obj is ProgressiveDataScheme<T> {
  if (!isArray(obj) || obj.length === 0) {
    return false;
  }
  return obj.every(item => {
    return isValid((item as IProgressiveDataSchemeCase<T>).scheme);
  });
}

/** 将色板转化为标准形式 */
export function transformColorSchemeToStandardStruct(colorScheme: ColorScheme): IColorSchemeStruct {
  if (isArray(colorScheme)) {
    return {
      dataScheme: colorScheme
    };
  }
  return colorScheme;
}
