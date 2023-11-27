import type { IIndicatorTheme } from '../../../../component/indicator/interface';
import { THEME_CONSTANTS } from '../constants';

export const indicator: IIndicatorTheme = {
  title: {
    visible: true,
    autoLimit: false,
    autoFit: false,
    style: {
      fontSize: THEME_CONSTANTS.l1FontSize,
      fill: { type: 'palette', key: 'primaryFontColor' },
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
      fill: { type: 'palette', key: 'tertiaryFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1,
      textBaseline: 'top',
      textAlign: 'center'
    }
  }
};
