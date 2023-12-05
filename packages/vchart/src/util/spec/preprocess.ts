import { isPlainObject } from '@visactor/vutils';
import type { IThemeColorScheme } from '../../theme/color-scheme/interface';
import { getActualColor, isColorKey } from '../../theme/color-scheme/util';
import type { ISeriesSpec } from '../../typings';

const IGNORE_KEYS = ['animationThreshold', 'colorScheme', 'fontFamily', 'name', 'padding'];

export function preprocessTheme(obj: any, colorScheme?: IThemeColorScheme, seriesSpec?: ISeriesSpec): any {
  if (!obj) {
    return obj;
  }

  const newObj = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (IGNORE_KEYS.includes(key)) {
      newObj[key] = value;
    } else if (isPlainObject(value)) {
      if (isColorKey(value)) {
        // 查询、替换语义化颜色
        newObj[key] = getActualColor(value, colorScheme, seriesSpec);
      } else {
        newObj[key] = preprocessTheme(value, colorScheme, seriesSpec);
      }
    } else {
      newObj[key] = value;
    }
  });

  return newObj;
}
