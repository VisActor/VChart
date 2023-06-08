import type { IScatterSeriesTheme } from '../../../../series/scatter/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../config';

export const scatter: IScatterSeriesTheme = {
  size: 10,
  shape: 'circle',
  label: {
    visible: false,
    offset: 5,
    position: 'top',
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontSize
    }
  }
};
