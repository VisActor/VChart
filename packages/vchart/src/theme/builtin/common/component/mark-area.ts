import type { IMarkAreaTheme } from '../../../../component/marker/mark-area/interface';
import { THEME_CONSTANTS } from '../constants';

export const markArea: IMarkAreaTheme = {
  area: {
    style: {
      fill: 'rgba(46, 47, 50, 0.1)'
    }
  },
  label: {
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      lineHeight: THEME_CONSTANTS.l4LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: { type: 'palette', key: 'labelReverseFontColor' },
      stroke: { type: 'palette', key: 'labelReverseFontColor' },
      lineWidth: 0
    },
    labelBackground: {
      padding: {
        top: 2,
        bottom: 2,
        right: 4,
        left: 4
      },
      style: {
        cornerRadius: 0,
        fill: '#F68484'
      }
    }
  }
};
