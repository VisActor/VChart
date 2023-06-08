import type { IPieSeriesTheme } from '../../../../series/pie/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../config';

export const pie: IPieSeriesTheme = {
  outerRadius: 0.6,
  label: {
    visible: false,
    position: 'outside',
    style: {
      fontSize
    }
  }
};
