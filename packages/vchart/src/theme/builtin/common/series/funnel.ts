import type { IFunnelSeriesTheme } from '../../../../series/funnel/interface';
import { THEME_CONSTANTS } from '../constants';

export const funnel: IFunnelSeriesTheme = {
  transform: {
    style: {
      // TODO: 类型问题
      // @ts-ignore
      fill: { type: 'palette', key: 'axisGridColor' }
    }
  },
  label: {
    style: {
      fill: 'white',
      textBaseline: 'middle',
      lineWidth: 2
    }
  },
  outerLabel: {
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      lineHeight: THEME_CONSTANTS.l4LineHeight,
      // TODO: 类型问题
      // @ts-ignore
      fill: { type: 'palette', key: 'secondaryFontColor' }
    },
    line: {
      style: {
        // TODO: 类型问题
        // @ts-ignore
        stroke: { type: 'palette', key: 'axisDomainColor' }
      }
    }
  },
  transformLabel: {
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      lineHeight: THEME_CONSTANTS.l4LineHeight,
      // TODO: 类型问题
      // @ts-ignore
      fill: { type: 'palette', key: 'secondaryFontColor' },
      textBaseline: 'middle'
    }
  }
};
