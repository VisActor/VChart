import type { IRadarSeriesTheme } from '../../../../series/radar/interface';
import { THEME_CONSTANTS } from '../constants';

export const radar: IRadarSeriesTheme = {
  area: {
    style: {
      fillOpacity: 0.2
    }
  },
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
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE
    }
  }
};
