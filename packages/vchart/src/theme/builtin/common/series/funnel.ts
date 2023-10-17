import type { IFunnelSeriesTheme } from '../../../../series/funnel/interface';
import { THEME_CONSTANTS } from '../constants';

export const funnel: IFunnelSeriesTheme = {
  transform: {
    style: {
      fill: { type: 'palette', key: 'axisGridColor' }
    }
  },
  label: {
    style: {
      fill: 'white',
      textBaseline: 'middle',
      lineWidth: 2
    }
  },
  outerLabel: {
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      lineHeight: THEME_CONSTANTS.l4LineHeight,

      fill: { type: 'palette', key: 'secondaryFontColor' }
    },
    line: {
      style: {
        stroke: { type: 'palette', key: 'axisDomainColor' }
      }
    }
  },
  transformLabel: {
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      lineHeight: THEME_CONSTANTS.l4LineHeight,

      fill: { type: 'palette', key: 'secondaryFontColor' },
      textBaseline: 'middle'
    }
  }
};
