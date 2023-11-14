import type { IContinuousLegendTheme } from '../../../../../component/legend';
import { THEME_CONSTANTS } from '../../constants';

export const DEFAULT_CONTINUOUS_LEGEND_THEME: IContinuousLegendTheme = {
  orient: 'right',
  position: 'middle',
  padding: [12, 12],
  title: {
    visible: false,
    padding: 0,
    textStyle: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    },
    space: 12
  },
  startText: {
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    },
    space: 6
  },
  endText: {
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    },
    space: 6
  },
  handlerText: {
    style: {
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    },
    space: 6
  }
};
