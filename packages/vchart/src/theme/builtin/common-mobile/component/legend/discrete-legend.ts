import type { IDiscreteLegendTheme } from '../../../../../component/legend';
import { THEME_CONSTANTS } from '../../constants';

export const discreteLegend: IDiscreteLegendTheme = {
  orient: 'top',
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
  item: {
    visible: true,
    spaceCol: 10,
    spaceRow: 6,
    padding: 2,
    shape: {
      space: 6
    },
    label: {
      space: 6,
      style: {
        fontSize: THEME_CONSTANTS.l5FontSize,
        lineHeight: THEME_CONSTANTS.l5LineHeight
      }
    }
  }
};
