import type { IBarSeriesTheme } from '../../../../series/bar/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const bar: IBarSeriesTheme = {
  fillOpacity: 1,
  strokeOpacity: 1,
  label: {
    visible: false,
    position: 'outside',
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontFamily,
      fontSize
    }
  }
};
