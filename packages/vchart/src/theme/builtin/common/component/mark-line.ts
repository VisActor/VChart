import type { IMarkLineTheme } from '../../../../component/marker/mark-line/interface';
import { THEME_CONSTANTS } from '../constants';

export const markLine: IMarkLineTheme = {
  line: {
    style: {
      lineDash: [3, 3],
      stroke: { type: 'palette', key: 'primaryFontColor' }
    }
  },
  startSymbol: {
    visible: false,
    symbolType: 'triangle',
    size: 10,
    style: {
      stroke: null,
      lineWidth: 0,
      fill: { type: 'palette', key: 'primaryFontColor' }
    }
  },
  endSymbol: {
    visible: true,
    symbolType: 'triangle',
    size: 10,
    style: {
      stroke: null,
      lineWidth: 0,
      fill: { type: 'palette', key: 'primaryFontColor' }
    }
  },
  label: {
    refY: 5,
    style: {
      fontSize: THEME_CONSTANTS.l4FontSize,
      // lineHeight: THEME_CONSTANTS.l4LineHeight,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: { type: 'palette', key: 'primaryFontColor' }
    },
    labelBackground: {
      padding: {
        top: 2,
        bottom: 2,
        right: 4,
        left: 4
      },
      style: {
        cornerRadius: 3,
        fill: { type: 'palette', key: 'markLabelBackgroundColor' }
      }
    }
  }
};
