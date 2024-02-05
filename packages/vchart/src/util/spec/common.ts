import { DataView } from '@visactor/vdataset';
import type { ITheme } from '../../theme';
// eslint-disable-next-line no-duplicate-imports
import { ThemeManager } from '../../theme';
import { isObject, isString } from '@visactor/vutils';

export function isDataView(obj: any): obj is DataView {
  return obj instanceof DataView;
}

export function isHTMLElement(obj: any): obj is Element {
  try {
    return obj instanceof Element;
  } catch {
    // 跨端 plan B
    const htmlElementKeys: (keyof Element)[] = [
      'children',
      'innerHTML',
      'classList',
      'setAttribute',
      'tagName',
      'getBoundingClientRect'
    ];
    const keys = Object.keys(obj);
    return htmlElementKeys.every(key => keys.includes(key));
  }
}

export function getThemeObject(theme?: string | ITheme, transformed?: boolean): ITheme {
  if (isString(theme)) {
    if (ThemeManager.themeExist(theme)) {
      return ThemeManager.getTheme(theme, transformed);
    }
    return {};
  } else if (isObject(theme)) {
    return theme;
  }
  return {};
}
