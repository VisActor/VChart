import type { ITitleTheme } from '../../../../component/title/interface';
import { THEME_CONSTANTS } from '../constants';

export const title: ITitleTheme = {
  padding: {
    top: 4,
    bottom: 20
  },
  textStyle: {
    fontSize: THEME_CONSTANTS.l3FontSize,
    lineHeight: THEME_CONSTANTS.l3LineHeight,
    fontFamily: THEME_CONSTANTS.defaultFontFamily,
    fill: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] }
  },
  subtextStyle: {
    fontSize: THEME_CONSTANTS.l4FontSize,
    lineHeight: THEME_CONSTANTS.l4LineHeight,
    fontFamily: THEME_CONSTANTS.defaultFontFamily,
    fill: { type: 'palette', key: 'secondaryFontColor' }
  }
};
