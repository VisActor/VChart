import type { IBar3dSeriesTheme } from '../../../../series/bar/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const bar3d: IBar3dSeriesTheme = {
  fillOpacity: 1,
  strokeOpacity: 1,
  bar3d: {
    style: {
      length: 3
    }
  },
  label: {
    visible: false,
    style: {
      fontFamily,
      fontSize,
      offset: 12,
      position: 'outside'
    }
  }
};
