import type { IRadarSeriesTheme } from '../../../../series/radar/interface';
import { THEME_CONSTANTS } from '../constants';

export const radar: IRadarSeriesTheme = {
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
