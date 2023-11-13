import type { ICirclePackingSeriesTheme } from '../../../../series/circle-packing/interface';
import { THEME_CONSTANTS } from '../constants';

export const circlePacking: ICirclePackingSeriesTheme = {
  layoutPadding: 5,
  circlePacking: {
    visible: true,
    style: {
      cursor: 'pointer',
      // TODO: 类型问题
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  },
  label: {
    visible: true,
    style: {
      cursor: 'pointer',
      fill: 'black',
      // TODO: 类型问题
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' },
      lineWidth: 2,
      fontSize: THEME_CONSTANTS.l5FontSize,
      lineHeight: THEME_CONSTANTS.l5LineHeight
    }
  }
};
