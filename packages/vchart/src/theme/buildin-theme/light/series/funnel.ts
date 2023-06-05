import type { IFunnelSeriesTheme } from '../../../../series/funnel/interface';
import { DEFAULT_TEXT_FONT_SIZE as fontSize } from '../../config';

export const funnel: IFunnelSeriesTheme = {
  transform: {
    style: {
      fill: '#f5f5f5'
    }
  },
  label: {
    style: {
      fontFamily: 'sans-serif',
      fontSize,
      fill: 'white',
      textBaseline: 'middle',
      lineWidth: 2
    }
  },
  outerLabel: {
    style: {
      fontFamily: 'sans-serif',
      fontSize,
      fill: '#707070'
    },
    line: {
      style: {
        stroke: '#ddd'
      }
    }
  },
  transformLabel: {
    style: {
      fontFamily: 'sans-serif',
      fontSize,
      fill: '#707070',
      textBaseline: 'middle'
    }
  }
};
