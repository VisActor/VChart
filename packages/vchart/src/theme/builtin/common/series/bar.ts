import type { IBarSeriesTheme } from '../../../../series/bar/interface';

export const bar: IBarSeriesTheme = {
  label: {
    visible: false,
    position: 'outside',
    offset: 5,
    style: {
      lineWidth: 2,
      // TODO: 类型问题
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' }
    }
  }
};
