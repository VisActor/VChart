import type { IMapSeriesTheme } from '../../../../series/map/interface';
import { THEME_CONSTANTS } from '../constants';

export const map: IMapSeriesTheme = {
  defaultFillColor: '#f3f3f3',
  area: {
    style: {
      lineWidth: 0.5,
      strokeOpacity: 1,
      stroke: 'black',
      fillOpacity: 1
    }
  },
  label: {
    interactive: false,
    style: {
      fontSize: THEME_CONSTANTS.MAP_LABEL_FONT_SIZE,
      textBaseline: 'middle',
      fill: { type: 'palette', key: 'labelFontColor' },
      stroke: 'white'
    }
  }
};
