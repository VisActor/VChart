import type { IPie3dSeriesTheme } from '../../../../series/pie/interface';
import { THEME_CONSTANTS } from '../constants';

export const pie3d: IPie3dSeriesTheme = {
  outerRadius: 0.6,
  pie3d: {
    style: {
      height: 10
    }
  },
  label: {
    visible: false,
    position: 'outside',
    style: {
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE
    }
  }
};
