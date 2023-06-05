import type { IAreaSeriesTheme } from '../../../../series/area/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const area: IAreaSeriesTheme = {
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
    position: 'top',
    style: {
      stroke: 'white',
      lineWidth: 2,
      fontFamily,
      fontSize
    }
  }
};
