import type { IContinuousLegendTheme } from '../../../../../component/legend';
import { THEME_CONSTANTS } from '../../constants';

export const DEFAULT_CONTINUOUS_LEGEND_THEME: IContinuousLegendTheme = {
  orient: 'right',
  position: 'middle',
  padding: 30,
  title: {
    visible: false,
    padding: 0,
    textStyle: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      lineHeight: THEME_CONSTANTS.l4LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fontWeight: 'normal',
      fill: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] }
    },
    space: 12
  },
  handler: {
    visible: true
  },
  startText: {
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    }
  },
  endText: {
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    }
  },
  handlerText: {
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    }
  }
};
