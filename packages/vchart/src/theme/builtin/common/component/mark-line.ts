import type { IMarkLineTheme } from '../../../../component/marker/mark-line/interface';
import { THEME_CONSTANTS } from '../constants';

export const markLine: IMarkLineTheme = {
  line: {
    style: {
      lineDash: [3, 3],
      stroke: 'rgba(46, 47, 50)'
    }
  },
  startSymbol: {
    visible: false,
    symbolType: 'triangle',
    size: 10,
    style: {
      stroke: null,
      lineWidth: 0,
      fill: 'rgba(46, 47, 50)'
    }
  },
  endSymbol: {
    visible: true,
    symbolType: 'triangle',
    size: 10,
    style: {
      stroke: null,
      lineWidth: 0,
      fill: 'rgba(46, 47, 50)'
    }
  },
  label: {
    refY: 5,
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      // lineHeight: THEME_CONSTANTS.l4LineHeight,
      fontFamily: THEME_CONSTANTS.defaultFontFamily,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: { type: 'palette', key: 'labelReverseFontColor' },
      stroke: { type: 'palette', key: 'labelReverseFontColor' },
      lineWidth: 0
    },
    labelBackground: {
      padding: {
        top: 2,
        bottom: 2,
        right: 4,
        left: 4
      },
      style: {
        cornerRadius: 0,
        fill: 'rgb(48, 115, 242)'
      }
    }
  }
};
