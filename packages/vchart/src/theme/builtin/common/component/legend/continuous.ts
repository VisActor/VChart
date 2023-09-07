import type { IContinuousLegendTheme } from '../../../../../component/legend';
import { THEME_CONSTANTS } from '../../constants';

export const DEFAULT_CONTINUOUS_LEGEND_THEME: IContinuousLegendTheme = {
  orient: 'right',
  position: 'middle',
  padding: [16, 24],
  title: {
    visible: false,
    padding: 0,
    textStyle: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
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
    },
    space: 6
  },
  endText: {
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    },
    space: 6
  },
  handlerText: {
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' }
    },
    space: 6
  }
};
