import type { IScatterSeriesTheme } from '../../../../series/scatter/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const scatter: IScatterSeriesTheme = {
  size: 10,
  shape: 'circle',
  fillOpacity: 1,
  strokeOpacity: 1,
  label: {
    visible: false,
    offset: 5,
    position: 'top',
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontFamily,
      fontSize
    }
  }
};
