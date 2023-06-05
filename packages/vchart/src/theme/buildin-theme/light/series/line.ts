import type { ILineSeriesTheme } from '../../../../series/line/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const line: ILineSeriesTheme = {
  size: 10,
  fillOpacity: 1,
  strokeOpacity: 1,
  label: {
    visible: false,
    position: 'top',
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontFamily,
      fontSize
    }
  }
};
