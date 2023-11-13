import type { IAreaSeriesTheme } from '../../../../series/area/interface';

export const area: IAreaSeriesTheme = {
  label: {
    visible: false,
    offset: 5,
    position: 'top',
    style: {
      // TODO: 类型问题
      // @ts-ignore
      stroke: { type: 'palette', key: 'backgroundColor' },
      lineWidth: 2
    }
  },
  point: {
    style: {
      symbolType: 'circle'
    }
  }
};
