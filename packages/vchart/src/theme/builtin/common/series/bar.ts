import type { IBarSeriesTheme } from '../../../../series/bar/interface';

export const bar: IBarSeriesTheme = {
  label: {
    visible: false,
    position: 'outside',
    offset: 5,
    style: {
      lineWidth: 2,
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  },
  barBackground: {
    visible: false,
    style: {
      fill: { type: 'palette', key: 'primaryFontColor', a: 0.06 }
    }
  }
};
