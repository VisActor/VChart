import type { ILineSeriesTheme } from '../../../../series/line/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../config';

export const line: ILineSeriesTheme = {
  point: {
    style: {
      size: 10
    }
  },
  label: {
    visible: false,
    position: 'top',
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white',
      fontSize
    }
  }
};
