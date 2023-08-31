import type { ILineSeriesTheme } from '../../../../series/line/interface';

export const line: ILineSeriesTheme = {
  label: {
    visible: false,
    position: 'top',
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: 'white'
    }
  },
  point: {
    style: {
      symbolType: 'circle'
    }
  }
};
