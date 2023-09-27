import type { IDotSeriesTheme } from '../../../../series/dot/interface';
import { THEME_CONSTANTS } from '../constants';

export const dot: IDotSeriesTheme = {
  dot: {
    style: {
      size: 10,
      fillOpacity: 1
    }
  },
  symbol: {
    style: {
      size: 10
    }
  },
  title: {
    style: {
      textAlign: 'left',
      textBaseline: 'middle',
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  },
  subTitle: {
    style: {
      textAlign: 'left',
      textBaseline: 'top',
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  }
};
