import type { IBarSeriesTheme } from '../../../../series/bar/interface';
import { THEME_CONSTANTS } from '../constants';

export const bar: IBarSeriesTheme = {
  label: {
    visible: false,
    position: 'outside',
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE
    }
  }
};
