import type { ILineSeriesTheme } from '../../../../series/line/interface';

export const line: ILineSeriesTheme = {
  label: {
    visible: false,
    position: 'top',
    offset: 5,
    style: {
      lineWidth: 2,
      // TODO: 类型问题
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  },
  point: {
    style: {
      symbolType: 'circle'
    }
  }
};
