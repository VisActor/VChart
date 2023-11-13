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
      fontSize: THEME_CONSTANTS.l6FontSize,
      lineHeight: THEME_CONSTANTS.l6LineHeight,
      textBaseline: 'middle',
      // TODO: 类型问题
      // @ts-ignore
      fill: { type: 'palette', key: 'secondaryFontColor', default: '#89909d' },
      // TODO: 类型问题
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  }
};
