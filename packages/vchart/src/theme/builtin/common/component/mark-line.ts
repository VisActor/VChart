import type { IMarkLineTheme } from '../../../../component/marker/mark-line/interface';

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
    style: {
      stroke: null,
      lineWidth: 0,
      fill: 'rgba(46, 47, 50)',
      size: 10
    }
  },
  endSymbol: {
    visible: true,
    symbolType: 'triangle',
    style: {
      stroke: null,
      lineWidth: 0,
      fill: 'rgba(46, 47, 50)',
      size: 10
    }
  },
  label: {
    refY: 5,
    style: {
      fontSize: 14,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: { type: 'palette', key: 'backgroundColor' },
      stroke: { type: 'palette', key: 'backgroundColor' },
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
