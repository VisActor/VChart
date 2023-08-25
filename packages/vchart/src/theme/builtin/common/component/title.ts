import type { ITitleTheme } from '../../../../component/title/interface';
import { THEME_CONSTANTS } from '../constants';

export const title: ITitleTheme = {
  padding: {
    bottom: 30
  },
  textStyle: {
    fontSize: THEME_CONSTANTS.TITLE_FONT_SIZE,
    fill: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] }
  },
  subtextStyle: {
    fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE,
    lineHeight: THEME_CONSTANTS.TITLE_FONT_SIZE,
    fill: { type: 'palette', key: 'secondaryFontColor' }
  }
};
