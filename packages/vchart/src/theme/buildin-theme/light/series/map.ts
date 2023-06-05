import type { IMapSeriesTheme } from '../../../../series/map/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize, DEFAULT_TEXT_FONT_FAMILY as fontFamily } from '../../config';

export const map: IMapSeriesTheme = {
  defaultFillColor: '#f3f3f3',
  area: {
    style: {
      lineWidth: 0.5,
      strokeOpacity: 1,
      stroke: 'black'
    }
  },
  label: {
    interactive: false,
    style: {
      fontFamily,
      fontSize,
      textBaseline: 'middle',
      fill: 'black',
      stroke: 'white'
    }
  }
};
