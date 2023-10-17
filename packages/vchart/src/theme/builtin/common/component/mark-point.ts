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
        fill: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] }
      }
    },
    line: {
      style: {
        stroke: { type: 'palette', key: ['titleFontColor', 'primaryFontColor'] }
      }
    }
  },
  itemContent: {
    offsetY: -50
  }
};
