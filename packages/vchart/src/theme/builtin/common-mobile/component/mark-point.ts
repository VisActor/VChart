import type { IMarkPointTheme } from '../../../../component/marker/mark-point/interface';

export const markPoint: IMarkPointTheme = {
  itemLine: {
    decorativeLine: {
      visible: false
    },
    startSymbol: {
      size: 5,
      visible: true
    }
  },
  itemContent: {
    offsetY: -50
  }
};
