import type { ICartesianAxisCommonTheme } from '../../../../../component/axis/cartesian/interface';
import { THEME_CONSTANTS } from '../../constants';

export const axisX: ICartesianAxisCommonTheme = {
  label: {
    space: 4
  },
  title: {
    space: 4
  },
  unit: {
    visible: false,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize
    }
  }
};

export const axisY: ICartesianAxisCommonTheme = {
  label: {
    space: 6
  },
  title: {
    space: 6
  },
  unit: {
    visible: false,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize
    }
  }
};

export const axisZ: ICartesianAxisCommonTheme = {
  ...axisX,
  label: {
    space: 0
  }
};
