import type { IPieSeriesTheme } from '../../../../series/pie/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const pie: IPieSeriesTheme = {
  fillOpacity: 1,
  outerRadius: 0.6,
  label: {
    visible: false,
    position: 'outside',
    style: {
      fontFamily,
      fontSize
    }
  }
};
