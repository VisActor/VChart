import type { IDataZoomTheme } from '../../../../component/data-zoom';
import { THEME_CONSTANTS } from '../constants';

export const dataZoom: IDataZoomTheme = {
  padding: [12, 0],
  middleHandler: {
    visible: false,
    background: {
      size: 6
    },
    icon: {
      style: {
        size: 4
      }
    }
  },
  background: {
    size: 20
  },
  startText: {
    padding: 8,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  },
  endText: {
    padding: 8,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  }
};
