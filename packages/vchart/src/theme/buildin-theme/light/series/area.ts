import type { IAreaSeriesTheme } from '../../../../series/area/interface';
import { THEME_CONSTANTS } from '../constants';

export const area: IAreaSeriesTheme = {
  label: {
    visible: false,
    offset: 5,
    position: 'top',
    style: {
      stroke: 'white',
      lineWidth: 2,
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE
    }
  }
};
