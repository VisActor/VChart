import type { IAxisCommonTheme } from '../../../../../component/axis';
import { THEME_CONSTANTS } from '../../constants';

export const commonAxis: IAxisCommonTheme = {
  domainLine: {
    visible: true
  },
  grid: {
    visible: true
  },
  subGrid: {
    visible: false
  },
  tick: {
    visible: false,
    tickSize: THEME_CONSTANTS.axisTickSize
  },
  subTick: {
    visible: false,
    tickSize: THEME_CONSTANTS.axisTickSize / 2
  },
  label: {
    visible: true,
    space: 6,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize
      // lineHeight: THEME_CONSTANTS.l5LineHeight,
    }
  },
  title: {
    space: 6,
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  }
};
