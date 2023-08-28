import type { IIndicatorTheme } from '../../../../component/indicator/interface';
import { THEME_CONSTANTS } from '../constants';

export const indicator: IIndicatorTheme = {
  title: {
    visible: true,
    autoLimit: false,
    autoFit: false,
    style: {
      fontSize: THEME_CONSTANTS.l1FontSize,
      lineHeight: THEME_CONSTANTS.l1LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fill: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] },
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  },
  content: {
    visible: true,
    style: {
      fontSize: THEME_CONSTANTS.l2FontSize,
      lineHeight: THEME_CONSTANTS.l2LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fill: { type: 'palette', key: 'secondaryFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  }
};
