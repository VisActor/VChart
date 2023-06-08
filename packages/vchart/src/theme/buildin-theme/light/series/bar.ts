import type { IBarSeriesTheme } from '../../../../series/bar/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../config';

export const bar: IBarSeriesTheme = {
  label: {
    visible: false,
    position: 'outside',
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontSize
    }
  }
};
