import type { IAreaSeriesTheme } from '../../../../series/area/interface';
import { THEME_CONSTANTS } from '../constants';

export const area: IAreaSeriesTheme = {
  area: {
    style: {
      fillOpacity: 0.2
    }
  },
  line: {
    style: {
      lineWidth: 2
    }
  },
  point: {
    style: {
      size: 10
    }
  },
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
