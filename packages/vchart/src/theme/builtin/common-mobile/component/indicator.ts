import type { IIndicatorTheme } from '../../../../component/indicator/interface';
import { THEME_CONSTANTS } from '../constants';

export const indicator: IIndicatorTheme = {
  title: {
    visible: true,
    style: {
      fontSize: THEME_CONSTANTS.l1FontSize
      // lineHeight: THEME_CONSTANTS.l1LineHeight,
    }
  },
  content: {
    visible: true,
    style: {
      fontSize: THEME_CONSTANTS.l2FontSize
      // lineHeight: THEME_CONSTANTS.l2LineHeight,
    }
  }
};
