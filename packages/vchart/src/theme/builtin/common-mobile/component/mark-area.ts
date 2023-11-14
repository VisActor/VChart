import type { IMarkAreaTheme } from '../../../../component/marker/mark-area/interface';
import { THEME_CONSTANTS } from '../constants';

export const markArea: IMarkAreaTheme = {
  label: {
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
