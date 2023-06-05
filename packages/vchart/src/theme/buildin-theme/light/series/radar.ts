import type { IRadarSeriesTheme } from '../../../../series/radar/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const radar: IRadarSeriesTheme = {
  size: 10,
  fillOpacity: 1,
  strokeOpacity: 1,
  area: {
    style: {
      fillOpacity: 0.2
    }
  },
  label: {
    visible: false,
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontFamily,
      fontSize
    }
  }
};
