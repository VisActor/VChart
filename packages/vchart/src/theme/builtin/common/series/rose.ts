import type { IRoseSeriesTheme } from '../../../../series/rose/interface';

export const rose: IRoseSeriesTheme = {
  rose: {
    style: {
      fillOpacity: 1
    }
  },
  label: {
    style: {
      lineWidth: 2,
      // TODO: 类型问题
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' },
      textAlign: 'center',
      textBaseline: 'middle'
    }
  }
};
