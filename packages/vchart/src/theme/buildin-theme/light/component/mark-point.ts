import type { IMarkPointTheme } from '../../../../component/marker/mark-point/interface';

export const markPoint: IMarkPointTheme = {
  itemLine: {
    decorativeLine: {
      visible: false
    },
    startSymbol: {
      size: 5,
      visible: true,
      style: {
        fill: '#eee'
      }
    },
    line: {
      style: {
        stroke: '#eee'
      }
    }
  },
  itemContent: {
    offsetY: -50
  }
};
