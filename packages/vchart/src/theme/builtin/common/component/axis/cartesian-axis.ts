import type { ICartesianAxisCommonTheme } from '../../../../../component/axis/cartesian/interface';
import { THEME_CONSTANTS } from '../../constants';

export const axisX: ICartesianAxisCommonTheme = {
  label: {
    space: 8
  },
  title: {
    space: 8
  },
  maxHeight: '30%',
  unit: {
    visible: false,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      fill: { type: 'palette', key: 'axisLabelFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};

export const axisY: ICartesianAxisCommonTheme = {
  label: {
    space: 12,
    autoLimit: true
  },
  title: {
    space: 12,
    autoRotate: true
  },
  maxWidth: '30%',
  unit: {
    visible: false,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      fill: { type: 'palette', key: 'axisLabelFontColor' },
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};

export const axisZ: ICartesianAxisCommonTheme = {
  ...axisX,
  label: {
    space: 0
  }
};
