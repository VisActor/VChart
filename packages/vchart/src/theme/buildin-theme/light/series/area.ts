import type { IAreaSeriesTheme } from '../../../../series/area/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../config';

export const area: IAreaSeriesTheme = {
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
    position: 'top',
    style: {
      stroke: 'white',
      lineWidth: 2,
      fontSize
    }
  }
};
