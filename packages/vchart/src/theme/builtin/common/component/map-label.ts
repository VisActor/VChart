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
      textBaseline: 'middle',
      textAlign: 'left',
      fill: 'black',
      fontSize: THEME_CONSTANTS.l6FontSize
    }
  },
  valueLabel: {
    visible: true,
    style: {
      textBaseline: 'middle',
      textAlign: 'left',
      fill: 'black',
      fontSize: THEME_CONSTANTS.l6FontSize
    }
  },
  background: {
    visible: true,
    padding: { top: 4, bottom: 4, left: 6, right: 6 },
    style: {
      cornerRadius: 2,
      lineWidth: 1,
      fill: 'white',
      stroke: 'grey'
    }
  },
  leader: {
    visible: false,
    style: {
      lineWidth: 1,
      stroke: 'red'
    }
  }
};
