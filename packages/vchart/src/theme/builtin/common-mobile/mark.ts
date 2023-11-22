import type { IGlobalMarkThemeByName, IGlobalMarkThemeByType } from '../../interface';
import { THEME_CONSTANTS } from './constants';

export const markByType: IGlobalMarkThemeByType = {
  text: {
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      lineHeight: THEME_CONSTANTS.l4LineHeight,

      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};

export const markByName: IGlobalMarkThemeByName = {
  label: {
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize
      // lineHeight: THEME_CONSTANTS.l4LineHeight,
    }
  },
  line: {
    style: {
      lineWidth: 2
    }
  },
  point: {
    style: {
      size: 8
    }
  }
};
