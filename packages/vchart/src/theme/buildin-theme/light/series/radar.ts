import type { IRadarSeriesTheme } from '../../../../series/radar/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../config';

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
  label: {
    visible: false,
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontSize
    }
  }
};
