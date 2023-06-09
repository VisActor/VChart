import type { IFunnel3dSeriesTheme } from '../../../../series/funnel/interface';
import { THEME_CONSTANTS } from '../constants';

const fontSize = THEME_CONSTANTS.LABEL_FONT_SIZE;

export const funnel3d: IFunnel3dSeriesTheme = {
  transform: {
    style: {
      fill: '#f5f5f5'
    }
  },
  label: {
    style: {
      fontSize,
      fill: 'white',
      textBaseline: 'middle',
      lineWidth: 2
    }
  },
  outerLabel: {
    style: {
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
      fontSize,
      fill: '#707070',
      textBaseline: 'middle'
    }
  }
};
