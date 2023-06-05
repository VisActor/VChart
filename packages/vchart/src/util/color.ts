import { ColorUtil } from '@visactor/vutils';
import { findColor, isColorKey } from '../theme/color-scheme/util';
import type { SeriesTypeEnum } from '../series/interface';
import type { IThemeColorScheme } from '../theme/color-scheme/interface';

const { Color } = ColorUtil;

export { Color };

/** 查询语义化颜色 */
export const getActualColor = (value: any, colorScheme?: IThemeColorScheme, seriesType?: SeriesTypeEnum) => {
  if (isColorKey(value)) {
    if (colorScheme) {
      const color = findColor(colorScheme, value, seriesType);
      if (color) {
        return color;
      }
    }
  }
  return value;
};
