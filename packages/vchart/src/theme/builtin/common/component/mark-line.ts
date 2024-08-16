import type { IMarkerSymbol } from '../../../../component/marker/interface';
import type { IMarkLineTheme } from '../../../../component/marker/mark-line/interface';

const getSymbolTheme = (visible?: boolean): IMarkerSymbol => {
  return {
    visible,
    symbolType: 'triangle',
    size: 10,
    style: {
      fill: { type: 'palette', key: 'markLineStrokeColor' },
      stroke: null,
      lineWidth: 0
    }
  };
};

export const markLine: IMarkLineTheme = {
  line: {
    style: {
      lineDash: [3, 3],
      stroke: { type: 'palette', key: 'markLineStrokeColor' }
    }
  },
  startSymbol: getSymbolTheme(false),
  endSymbol: getSymbolTheme(true),
  label: {
    refY: 5,
    style: {
      fontSize: { type: 'token', key: 'l4FontSize' },
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
