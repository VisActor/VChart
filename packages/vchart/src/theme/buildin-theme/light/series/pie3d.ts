import type { IPie3dSeriesTheme } from '../../../../series/pie/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const pie3d: IPie3dSeriesTheme = {
  fillOpacity: 1,
  outerRadius: 0.6,
  pie3d: {
    style: {
      height: 10
    }
  },
  label: {
    visible: false,
    position: 'outside',
    style: {
      fontFamily,
      fontSize
    }
  }
};
