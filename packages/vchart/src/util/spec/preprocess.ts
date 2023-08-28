import { isArray, isFunction, isObject } from '@visactor/vutils';
import type { SeriesTypeEnum } from '../../series/interface';
import type { IThemeColorScheme } from '../../theme/color-scheme/interface';
import { isDataView, isHTMLElement } from './common';
import { getActualColor, isColorKey } from '../../theme/color-scheme/util';
import { normalizeLayoutPaddingSpec } from '../space';

/** 对 spec 或者类 spec 配置（如 theme）进行预处理，如进行语义化颜色的转换等 */
export function preprocessSpecOrTheme(obj: any, colorScheme?: IThemeColorScheme, seriesType?: SeriesTypeEnum): any {
  if (isArray(obj)) {
    return obj.map(element => {
      if (isObject(element) && !isFunction(element)) {
        return preprocessSpecOrTheme(element, colorScheme, seriesType);
      }
      return element;
    });
  }

  const newObj = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    // 绕过数据
    if (key.includes('data')) {
      newObj[key] = value;
      return;
    }
    if (isObject(value)) {
      // 绕过不可深拷贝的对象
      if (isFunction(value) || isDataView(value) || isHTMLElement(value)) {
        newObj[key] = value;
        return;
      }
      if (isColorKey(value)) {
        // 查询、替换语义化颜色
        newObj[key] = getActualColor(value, colorScheme, seriesType);
      } else if (key === 'padding') {
        // 标准化 padding
        newObj[key] = normalizeLayoutPaddingSpec(value);
      } else {
        newObj[key] = preprocessSpecOrTheme(value, colorScheme, seriesType);
      }
    } else {
      newObj[key] = value;
    }
  });

  return newObj;
}
