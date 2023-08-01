import type { IBar3dSeriesTheme } from '../../../../series/bar/interface';
import { THEME_CONSTANTS } from '../constants';

export const bar3d: IBar3dSeriesTheme = {
  bar3d: {
    style: {
      length: 3
    }
  },
  label: {
    visible: false,
    style: {
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE,
      offset: 12,
      position: 'outside'
    }
  }
};
