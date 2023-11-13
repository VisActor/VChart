import type { IRadarSeriesTheme } from '../../../../series/radar/interface';

export const radar: IRadarSeriesTheme = {
  label: {
    visible: false,
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
