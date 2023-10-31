import { isArray, isFunction, isNil, isObject, isString, isValid, isValidNumber } from '@visactor/vutils';
import type { SeriesTypeEnum } from '../../series/interface/type';
import { seriesMarkNameSet } from '../../series/interface/type';
import type { IThemeColorScheme } from '../../theme/color-scheme/interface';
import { isDataView, isHTMLElement } from './common';
import { getActualColor, isColorKey } from '../../theme/color-scheme/util';
import { normalizeLayoutPaddingSpec } from '../space';

/**
 * 对 spec 或者类 spec 配置（如 theme）进行预处理，如进行语义化颜色的转换等
 * @param type 需要转换的对象类型（spec 或者 theme）
 * @param obj 需要转换的对象
 * @param colorScheme 主题色板
 * @param seriesType 当前系列类型
 * @returns
 */
export function preprocessSpecOrTheme(
  type: 'spec' | 'theme' | 'mark-spec' | 'mark-theme',
  obj: any,
  colorScheme?: IThemeColorScheme,
  seriesType?: SeriesTypeEnum
): any {
  if (isNil(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    return obj.map(element => {
      if (isObject(element) && !isFunction(element)) {
        return preprocessSpecOrTheme(type, element, colorScheme, seriesType);
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
      } else {
        newObj[key] = preprocessSpecOrTheme(
          seriesMarkNameSet.has(key) ? (type.includes('spec') ? 'mark-spec' : 'mark-theme') : type,
          value,
          colorScheme,
          seriesType
        );
      }
    } else if (!type.includes('mark') && key === 'padding') {
      // 标准化 padding
      newObj[key] = normalizeLayoutPaddingSpec(value);
    } else if (!type.includes('theme') && key === 'lineHeight' && isString(value) && value[value.length - 1] === '%') {
      if (isValid(obj.fontSize)) {
        // 处理 lineHeight 的比例值
        // FIXME: vrender 支持行高字符串后删掉这段逻辑
        const scale = Number.parseFloat(value.substring(0, value.length - 1)) / 100;
        const newValue = obj.fontSize * scale;
        if (isValidNumber(newValue)) {
          newObj[key] = newValue;
        }
      }
      // 如果 spec 同级里没有 fontSize 配置，lineHeight 比例值失效
    } else {
      newObj[key] = value;
    }
  });

  return newObj;
}
