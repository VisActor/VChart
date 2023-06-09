import type { IScatterSeriesTheme } from '../../../../series/scatter/interface';
import { THEME_CONSTANTS } from '../constants';

export const scatter: IScatterSeriesTheme = {
  size: 10,
  shape: 'circle',
  label: {
    visible: false,
    offset: 5,
    position: 'top',
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE
    }
  }
};
