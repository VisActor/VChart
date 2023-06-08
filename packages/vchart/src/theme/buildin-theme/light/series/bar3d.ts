import type { IBar3dSeriesTheme } from '../../../../series/bar/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../config';

export const bar3d: IBar3dSeriesTheme = {
  bar3d: {
    style: {
      length: 3
    }
  },
  label: {
    visible: false,
    style: {
      fontSize,
      offset: 12,
      position: 'outside'
    }
  }
};
