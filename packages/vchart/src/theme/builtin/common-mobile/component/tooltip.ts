import type { ITooltipTheme } from '../../../../component/tooltip/interface';
import { THEME_CONSTANTS } from '../constants';

export const tooltip: ITooltipTheme = {
  offset: {
    x: 10,
    y: 10
  },
  panel: {
    padding: {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10
    }
  },
  spaceRow: 6,
  titleLabel: {
    fontSize: THEME_CONSTANTS.l4FontSize,
    lineHeight: THEME_CONSTANTS.l4LineHeight,
    spacing: 0
  },
  shape: {
    size: 8,
    spacing: 6
  },
  keyLabel: {
    fontSize: THEME_CONSTANTS.l4FontSize,
    lineHeight: THEME_CONSTANTS.l4LineHeight,
    spacing: 26
  },
  valueLabel: {
    fontSize: THEME_CONSTANTS.l4FontSize,
    lineHeight: THEME_CONSTANTS.l4LineHeight,
    spacing: 0
  }
};
