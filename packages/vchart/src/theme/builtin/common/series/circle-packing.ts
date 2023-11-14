import type { ICirclePackingSeriesTheme } from '../../../../series/circle-packing/interface';
import { THEME_CONSTANTS } from '../constants';

export const circlePacking: ICirclePackingSeriesTheme = {
  layoutPadding: 5,
  circlePacking: {
    visible: true,
    style: {
      cursor: 'pointer',
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  },
  label: {
    visible: true,
    style: {
      cursor: 'pointer',
      fill: 'black',
      stroke: { type: 'palette', key: 'backgroundColor' },
      lineWidth: 2,
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  }
};
