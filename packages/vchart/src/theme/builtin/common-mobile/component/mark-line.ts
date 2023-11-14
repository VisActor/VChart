import type { IMarkLineTheme } from '../../../../component/marker/mark-line/interface';
import { THEME_CONSTANTS } from '../constants';

export const markLine: IMarkLineTheme = {
  startSymbol: {
    visible: false,
    size: 10
  },
  endSymbol: {
    visible: true,
    size: 10
  },
  label: {
    refY: 5,
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize
      // lineHeight: THEME_CONSTANTS.l4LineHeight,
    },
    labelBackground: {
      padding: {
        top: 2,
        bottom: 2,
        right: 4,
        left: 4
      }
    }
  }
};
