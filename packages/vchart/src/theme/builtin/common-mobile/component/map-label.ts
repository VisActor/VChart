import type { IMapLabelTheme } from '../../../../component/map-label';
import { THEME_CONSTANTS } from '../constants';

export const mapLabel: IMapLabelTheme = {
  visible: true,
  offset: 12,
  position: 'top',
  space: 10,
  nameLabel: {
    visible: true,
    style: {
      fontSize: THEME_CONSTANTS.l6FontSize
      // lineHeight: THEME_CONSTANTS.l6LineHeight,
    }
  },
  valueLabel: {
    visible: true,
    style: {
      fontSize: THEME_CONSTANTS.l6FontSize
      // lineHeight: THEME_CONSTANTS.l6LineHeight,
    }
  },
  background: {
    visible: true,
    padding: { top: 4, bottom: 4, left: 6, right: 6 }
  },
  leader: {
    visible: false
  }
};
