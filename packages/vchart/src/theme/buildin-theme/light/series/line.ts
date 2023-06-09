import type { ILineSeriesTheme } from '../../../../series/line/interface';
import { THEME_CONSTANTS } from '../constants';

export const line: ILineSeriesTheme = {
  point: {
    style: {
      size: 10
    }
  },
  line: {
    style: {
      lineWidth: 2
    }
  },
  label: {
    visible: false,
    position: 'top',
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE
    }
  }
};
