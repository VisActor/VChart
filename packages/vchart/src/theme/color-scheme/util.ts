import { isArray, isObject, isString, isValid } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { ColorUtil } from '@visactor/vutils';
import type { SeriesTypeEnum } from '../../series/interface';
import { Color } from '../../util';
import type { ColorSchemeItem, IColorKey, IColorSchemeStruct, IThemeColorScheme } from './interface';

/**
 * 获取数据色板
 * @param colorScheme
 * @param seriesType
 * @returns
 */
export function getDataScheme(colorScheme: IThemeColorScheme, seriesType?: SeriesTypeEnum): ColorSchemeItem[] {
  const scheme = !isValid(seriesType) ? colorScheme?.default : colorScheme?.[seriesType] ?? colorScheme?.default;
  if (!scheme || isArray(scheme)) {
    return scheme as string[];
  } else if (isObject(scheme)) {
    return (scheme as IColorSchemeStruct).dataScheme.map(color => {
      if (isColorKey(color)) {
        return findColor(colorScheme, color, seriesType);
      }
      return color;
    });
  }
  return [];
}

/**
 * 根据色板和色值索引生成颜色
 * @param colorScheme
 * @param colorKey
 * @param seriesType
 * @returns
 */
export function findColor(
  colorScheme: IThemeColorScheme,
  colorKey: IColorKey,
  seriesType?: SeriesTypeEnum
): ColorSchemeItem | undefined {
  const scheme = !isValid(seriesType) ? colorScheme.default : colorScheme[seriesType] ?? colorScheme.default;
  if (!scheme) {
    return undefined;
  }
  const color = scheme[colorKey.key];
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

export function isColorKey(obj: any): obj is IColorKey {
  return isObject(obj) && (obj as IColorKey).type === 'scheme' && !!(obj as IColorKey).key;
}
