import type { IScatterSeriesTheme } from '../../../../series/scatter/interface';
import { THEME_CONSTANTS } from '../constants';

export const scatter: IScatterSeriesTheme = {
  point: {
    style: {
      size: 8,
      symbolType: 'circle',
      lineWidth: 0,
      fillOpacity: 0.8
    }
  },
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
