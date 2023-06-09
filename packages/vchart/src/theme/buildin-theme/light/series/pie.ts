import type { IPieSeriesTheme } from '../../../../series/pie/interface';
import { THEME_CONSTANTS } from '../constants';

export const pie: IPieSeriesTheme = {
  outerRadius: 0.6,
  label: {
    visible: false,
    position: 'outside',
    style: {
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE,
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};
